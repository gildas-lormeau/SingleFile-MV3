// The entry "Annotate and save the selection..." (SingleFile#2057) saves the selected content and
// opens it in the annotation editor, which used to take a save to a file, opening that file and
// choosing "Annotate the page...". It is an action the menu editor can add: the default menus do not
// hold it, so nothing changes for the users who do not add it.
//
// Like "Save selection", it is hidden when the raw page is saved, where a selection means nothing.
// It is also hidden when the profile already opens the editor before saving: "Save selection" then
// does the same thing.
//
// What the entry does when it is clicked is not tested here: it passes the options "selected" and
// "openEditor" to the save, the combination "Save selection" already produces when the option "edit
// the page before saving" is enabled.

import test from "node:test";
import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";

const ACTION = "edit-and-save-selection";
const LABEL_KEY = "menuEditAndSaveSelection";
const DEFAULT_PROFILE_NAME = "__Default_Settings__";
const stored = {};
const items = new Map();
const tab = { id: 1, url: "https://example.com/page" };
const storage = {
	async get(keys) {
		return keys ? Object.fromEntries(keys.map(key => [key, stored[key]])) : { ...stored };
	},
	async set(values) {
		Object.assign(stored, values);
	},
	async remove(keys) {
		keys.forEach(key => delete stored[key]);
	}
};
const listener = { addListener() { } };
globalThis.browser = {
	storage: { local: storage, session: storage, onChanged: listener },
	tabs: { async query() { return []; }, onActivated: listener, onUpdated: listener, onRemoved: listener, onReplaced: listener },
	runtime: { onMessage: listener, onInstalled: listener, getURL(path) { return path; } },
	i18n: { getMessage(key) { return key; } },
	action: { onClicked: listener, async setIcon() { }, async setBadgeText() { }, async setBadgeBackgroundColor() { }, async setTitle() { } },
	contextMenus: {
		onClicked: listener,
		create(item) { items.set(item.id, { ...item }); },
		async update(id, changes) { Object.assign(items.get(id), changes); },
		async removeAll() { items.clear(); }
	}
};

const config = await import("../src/core/bg/config.js");
const { getDefaultLayout, normalizeLayout, ACTIONS } = await import("../src/ui/common/menu-layout.js");
await config.getProfiles();
const menus = await import("../src/ui/bg/ui-menus.js");
await setImmediate();

test("the default menus do not hold the entry", async () => {
	const defaultLayout = getDefaultLayout();
	Object.keys(defaultLayout).forEach(surface => assert.equal(JSON.stringify(defaultLayout[surface]).includes(ACTION), false, surface));
	await menus.refreshTab(tab);
	assert.deepEqual(getEntryItems(), []);
	assert.equal(getItems("menuSaveSelection").length > 0, true, "control: the entry \"Save selection\" is created");
});

test("the entry is an action the menu editor can add and bind to a profile", () => {
	assert.equal(ACTIONS[ACTION].labelKey, LABEL_KEY);
	const layout = normalizeLayout({ page: [{ action: ACTION, profile: "Work" }, { action: "unknown-action" }] });
	assert.deepEqual(layout.page, [{ action: ACTION, profile: "Work" }]);
});

test("the entry is created once it is in the layout", async () => {
	await setLayout();
	await menus.refreshTab(tab);
	assert.equal(getEntryItems().length, 1);
});

test("the entry is displayed with the default options", async () => {
	await setLayout();
	await setOptions({ openEditor: false, saveRawPage: false });
	await menus.refreshTab(tab);
	await menus.onTabActivated(tab);
	assert.notEqual(getEntryItems()[0].visible, false);
});

test("the entry is hidden when the profile opens the editor before saving", async () => {
	await setLayout();
	await setOptions({ openEditor: true, saveRawPage: false });
	await menus.refreshTab(tab);
	await menus.onTabActivated(tab);
	assert.equal(getEntryItems()[0].visible, false);
	assert.notEqual(getItems("menuSaveSelection")[0].visible, false, "control: \"Save selection\" stays displayed");
});

test("the entry is hidden when the raw page is saved", async () => {
	await setLayout();
	await setOptions({ openEditor: false, saveRawPage: true });
	await menus.refreshTab(tab);
	await menus.onTabActivated(tab);
	assert.equal(getEntryItems()[0].visible, false);
});

function getEntryItems() {
	return getItems(LABEL_KEY);
}

function getItems(title) {
	return [...items.values()].filter(item => item.title == title);
}

function setLayout() {
	return config.onMessage({ method: "config.setMenuLayout", menuLayout: { page: [{ action: ACTION }, { action: "save-selection" }], button: [], tab: [] } });
}

async function setOptions(options) {
	const profiles = await config.getProfiles();
	const profile = Object.assign({}, profiles[DEFAULT_PROFILE_NAME], options);
	await config.onMessage({ method: "config.updateProfile", profileName: DEFAULT_PROFILE_NAME, profile });
}
