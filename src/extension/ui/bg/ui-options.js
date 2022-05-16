/*
 * Copyright 2010-2020 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * This file is part of SingleFile.
 *
 *   The code in this file is free software: you can redistribute it and/or 
 *   modify it under the terms of the GNU Affero General Public License 
 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
 *   of the License, or (at your option) any later version.
 * 
 *   The code in this file is distributed in the hope that it will be useful, 
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
 *   General Public License for more details.
 *
 *   As additional permission under GNU AGPL version 3 section 7, you may 
 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
 *   AGPL normally required by section 4, provided you include this license 
 *   notice and a URL through which recipients can access the Corresponding 
 *   Source.
 */

/* global browser, window, document, localStorage, FileReader, location, fetch, TextDecoder, DOMParser, HTMLElement */

import { getMessages } from "./../../core/bg/i18n.js";

const HELP_ICON_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABIUlEQVQ4y+2TsarCMBSGvxTBRdqiUZAWOrhJB9EXcPKFfCvfQYfulUKHDqXg4CYUJSioYO4mSDX3ttzt3n87fMlHTpIjlsulxpDZbEYYhgghSNOUOI5Ny2mZYBAELBYLer0eAJ7ncTweKYri4x7LJJRS0u12n7XrukgpjSc0CpVSXK/XZ32/31FKNW85z3PW6zXT6RSAJEnIsqy5UGvNZrNhu90CcDqd+C6tT6J+v//2Th+PB2VZ1hN2Oh3G4zGTyQTbtl/YbrdjtVpxu91+Ljyfz0RRhG3bzOfzF+Y4TvNXvlwuaK2pE4tfzr/wzwsty0IIURlL0998KxRCMBqN8H2/wlzXJQxD2u12vVkeDoeUZUkURRU+GAw4HA7s9/sK+wK6CWHasQ/S/wAAAABJRU5ErkJggg==";
const HELP_PAGE_PATH = "/src/extension/ui/pages/help.html";
let DEFAULT_PROFILE_NAME, DISABLED_PROFILE_NAME, CURRENT_PROFILE_NAME;
browser.runtime.sendMessage({ method: "config.getConstants" }).then(data => ({ DEFAULT_PROFILE_NAME, DISABLED_PROFILE_NAME, CURRENT_PROFILE_NAME } = data));
const removeHiddenElementsLabel = document.getElementById("removeHiddenElementsLabel");
const removeUnusedStylesLabel = document.getElementById("removeUnusedStylesLabel");
const removeUnusedFontsLabel = document.getElementById("removeUnusedFontsLabel");
const removeFramesLabel = document.getElementById("removeFramesLabel");
const removeImportsLabel = document.getElementById("removeImportsLabel");
const blockScriptsLabel = document.getElementById("blockScriptsLabel");
const blockAudiosLabel = document.getElementById("blockAudiosLabel");
const blockVideosLabel = document.getElementById("blockVideosLabel");
const blockFontsLabel = document.getElementById("blockFontsLabel");
const blockStylesheetsLabel = document.getElementById("blockStylesheetsLabel");
const blockImagesLabel = document.getElementById("blockImagesLabel");
const acceptHeaderDocumentLabel = document.getElementById("acceptHeaderDocumentLabel");
const acceptHeaderScriptLabel = document.getElementById("acceptHeaderScriptLabel");
const acceptHeaderAudioLabel = document.getElementById("acceptHeaderAudioLabel");
const acceptHeaderVideoLabel = document.getElementById("acceptHeaderVideoLabel");
const acceptHeaderFontLabel = document.getElementById("acceptHeaderFontLabel");
const acceptHeaderStylesheetLabel = document.getElementById("acceptHeaderStylesheetLabel");
const acceptHeaderImageLabel = document.getElementById("acceptHeaderImageLabel");
const saveRawPageLabel = document.getElementById("saveRawPageLabel");
const insertMetaCSPLabel = document.getElementById("insertMetaCSPLabel");
const saveToClipboardLabel = document.getElementById("saveToClipboardLabel");
const saveToFilesystemLabel = document.getElementById("saveToFilesystemLabel");
const addProofLabel = document.getElementById("addProofLabel");
const woleetKeyLabel = document.getElementById("woleetKeyLabel");
const saveToGDriveLabel = document.getElementById("saveToGDriveLabel");
const saveToGitHubLabel = document.getElementById("saveToGitHubLabel");
const githubTokenLabel = document.getElementById("githubTokenLabel");
const githubUserLabel = document.getElementById("githubUserLabel");
const githubRepositoryLabel = document.getElementById("githubRepositoryLabel");
const githubBranchLabel = document.getElementById("githubBranchLabel");
const saveWithCompanionLabel = document.getElementById("saveWithCompanionLabel");
const compressHTMLLabel = document.getElementById("compressHTMLLabel");
const compressCSSLabel = document.getElementById("compressCSSLabel");
const moveStylesInHeadLabel = document.getElementById("moveStylesInHeadLabel");
const loadDeferredImagesLabel = document.getElementById("loadDeferredImagesLabel");
const loadDeferredImagesMaxIdleTimeLabel = document.getElementById("loadDeferredImagesMaxIdleTimeLabel");
const loadDeferredImagesKeepZoomLevelLabel = document.getElementById("loadDeferredImagesKeepZoomLevelLabel");
const loadDeferredImagesDispatchScrollEventLabel = document.getElementById("loadDeferredImagesDispatchScrollEventLabel");
const addMenuEntryLabel = document.getElementById("addMenuEntryLabel");
const filenameTemplateLabel = document.getElementById("filenameTemplateLabel");
const filenameMaxLengthLabel = document.getElementById("filenameMaxLengthLabel");
const filenameMaxLengthBytesUnitLabel = document.getElementById("filenameMaxLengthBytesUnitLabel");
const filenameMaxLengthCharsUnitLabel = document.getElementById("filenameMaxLengthCharsUnitLabel");
const shadowEnabledLabel = document.getElementById("shadowEnabledLabel");
const setMaxResourceSizeLabel = document.getElementById("setMaxResourceSizeLabel");
const maxResourceSizeLabel = document.getElementById("maxResourceSizeLabel");
const setMaxResourceDelayLabel = document.getElementById("setMaxResourceDelayLabel");
const maxResourceDelayLabel = document.getElementById("maxResourceDelayLabel");
const confirmFilenameLabel = document.getElementById("confirmFilenameLabel");
const filenameConflictActionLabel = document.getElementById("filenameConflictActionLabel");
const filenameConflictActionUniquifyLabel = document.getElementById("filenameConflictActionUniquifyLabel");
const filenameConflictActionOverwriteLabel = document.getElementById("filenameConflictActionOverwriteLabel");
const filenameConflictActionPromptLabel = document.getElementById("filenameConflictActionPromptLabel");
const filenameConflictActionSkipLabel = document.getElementById("filenameConflictActionSkipLabel");
const displayInfobarLabel = document.getElementById("displayInfobarLabel");
const displayStatsLabel = document.getElementById("displayStatsLabel");
const backgroundSaveLabel = document.getElementById("backgroundSaveLabel");
const removeAlternativeFontsLabel = document.getElementById("removeAlternativeFontsLabel");
const removeAlternativeImagesLabel = document.getElementById("removeAlternativeImagesLabel");
const removeAlternativeMediasLabel = document.getElementById("removeAlternativeMediasLabel");
const saveCreatedBookmarksLabel = document.getElementById("saveCreatedBookmarksLabel");
const replaceBookmarkURLLabel = document.getElementById("replaceBookmarkURLLabel");
const allowedBookmarkFoldersLabel = document.getElementById("allowedBookmarkFoldersLabel");
const ignoredBookmarkFoldersLabel = document.getElementById("ignoredBookmarkFoldersLabel");
const titleLabel = document.getElementById("titleLabel");
const userInterfaceLabel = document.getElementById("userInterfaceLabel");
const filenameLabel = document.getElementById("filenameLabel");
const htmlContentLabel = document.getElementById("htmlContentLabel");
const imagesLabel = document.getElementById("imagesLabel");
const stylesheetsLabel = document.getElementById("stylesheetsLabel");
const fontsLabel = document.getElementById("fontsLabel");
const networkLabel = document.getElementById("networkLabel");
const blockResourcesLabel = document.getElementById("blockResourcesLabel");
const acceptHeadersLabel = document.getElementById("acceptHeadersLabel");
const destinationLabel = document.getElementById("destinationLabel");
const bookmarksLabel = document.getElementById("bookmarksLabel");
const autoSettingsLabel = document.getElementById("autoSettingsLabel");
const autoSettingsUrlLabel = document.getElementById("autoSettingsUrlLabel");
const autoSettingsProfileLabel = document.getElementById("autoSettingsProfileLabel");
const showAllProfilesLabel = document.getElementById("showAllProfilesLabel");
const groupDuplicateImagesLabel = document.getElementById("groupDuplicateImagesLabel");
const confirmInfobarLabel = document.getElementById("confirmInfobarLabel");
const autoCloseLabel = document.getElementById("autoCloseLabel");
const editorLabel = document.getElementById("editorLabel");
const openEditorLabel = document.getElementById("openEditorLabel");
const openSavedPageLabel = document.getElementById("openSavedPageLabel");
const autoOpenEditorLabel = document.getElementById("autoOpenEditorLabel");
const defaultEditorModeLabel = document.getElementById("defaultEditorModeLabel");
const applySystemThemeLabel = document.getElementById("applySystemThemeLabel");
const warnUnsavedPageLabel = document.getElementById("warnUnsavedPageLabel");
const infobarTemplateLabel = document.getElementById("infobarTemplateLabel");
const blockMixedContentLabel = document.getElementById("blockMixedContentLabel");
const saveOriginalURLsLabel = document.getElementById("saveOriginalURLsLabel");
const includeInfobarLabel = document.getElementById("includeInfobarLabel");
const miscLabel = document.getElementById("miscLabel");
const helpLabel = document.getElementById("helpLabel");
const synchronizeLabel = document.getElementById("synchronizeLabel");
const addProfileButton = document.getElementById("addProfileButton");
const deleteProfileButton = document.getElementById("deleteProfileButton");
const renameProfileButton = document.getElementById("renameProfileButton");
const resetButton = document.getElementById("resetButton");
const exportButton = document.getElementById("exportButton");
const importButton = document.getElementById("importButton");
const fileInput = document.getElementById("fileInput");
const profileNamesInput = document.getElementById("profileNamesInput");
const removeHiddenElementsInput = document.getElementById("removeHiddenElementsInput");
const removeUnusedStylesInput = document.getElementById("removeUnusedStylesInput");
const removeUnusedFontsInput = document.getElementById("removeUnusedFontsInput");
const removeFramesInput = document.getElementById("removeFramesInput");
const removeImportsInput = document.getElementById("removeImportsInput");
const blockScriptsInput = document.getElementById("blockScriptsInput");
const blockVideosInput = document.getElementById("blockVideosInput");
const blockAudiosInput = document.getElementById("blockAudiosInput");
const blockFontsInput = document.getElementById("blockFontsInput");
const blockStylesheetsInput = document.getElementById("blockStylesheetsInput");
const blockImagesInput = document.getElementById("blockImagesInput");
const acceptHeaderDocumentInput = document.getElementById("acceptHeaderDocumentInput");
const acceptHeaderScriptInput = document.getElementById("acceptHeaderScriptInput");
const acceptHeaderAudioInput = document.getElementById("acceptHeaderAudioInput");
const acceptHeaderVideoInput = document.getElementById("acceptHeaderVideoInput");
const acceptHeaderFontInput = document.getElementById("acceptHeaderFontInput");
const acceptHeaderStylesheetInput = document.getElementById("acceptHeaderStylesheetInput");
const acceptHeaderImageInput = document.getElementById("acceptHeaderImageInput");
const saveRawPageInput = document.getElementById("saveRawPageInput");
const insertMetaCSPInput = document.getElementById("insertMetaCSPInput");
const saveToClipboardInput = document.getElementById("saveToClipboardInput");
const addProofInput = document.getElementById("addProofInput");
const woleetKeyInput = document.getElementById("woleetKeyInput");
const saveToGDriveInput = document.getElementById("saveToGDriveInput");
const saveToGitHubInput = document.getElementById("saveToGitHubInput");
const githubTokenInput = document.getElementById("githubTokenInput");
const githubUserInput = document.getElementById("githubUserInput");
const githubRepositoryInput = document.getElementById("githubRepositoryInput");
const githubBranchInput = document.getElementById("githubBranchInput");
const saveWithCompanionInput = document.getElementById("saveWithCompanionInput");
const saveToFilesystemInput = document.getElementById("saveToFilesystemInput");
const compressHTMLInput = document.getElementById("compressHTMLInput");
const compressCSSInput = document.getElementById("compressCSSInput");
const moveStylesInHeadInput = document.getElementById("moveStylesInHeadInput");
const loadDeferredImagesInput = document.getElementById("loadDeferredImagesInput");
const loadDeferredImagesMaxIdleTimeInput = document.getElementById("loadDeferredImagesMaxIdleTimeInput");
const loadDeferredImagesKeepZoomLevelInput = document.getElementById("loadDeferredImagesKeepZoomLevelInput");
const loadDeferredImagesDispatchScrollEventInput = document.getElementById("loadDeferredImagesDispatchScrollEventInput");
const contextMenuEnabledInput = document.getElementById("contextMenuEnabledInput");
const filenameTemplateInput = document.getElementById("filenameTemplateInput");
const filenameMaxLengthInput = document.getElementById("filenameMaxLengthInput");
const filenameMaxLengthUnitInput = document.getElementById("filenameMaxLengthUnitInput");
const shadowEnabledInput = document.getElementById("shadowEnabledInput");
const maxResourceSizeInput = document.getElementById("maxResourceSizeInput");
const maxResourceSizeEnabledInput = document.getElementById("maxResourceSizeEnabledInput");
const maxResourceDelayInput = document.getElementById("maxResourceDelayInput");
const maxResourceDelayEnabledInput = document.getElementById("maxResourceDelayEnabledInput");
const confirmFilenameInput = document.getElementById("confirmFilenameInput");
const filenameConflictActionInput = document.getElementById("filenameConflictActionInput");
const displayInfobarInput = document.getElementById("displayInfobarInput");
const displayStatsInput = document.getElementById("displayStatsInput");
const backgroundSaveInput = document.getElementById("backgroundSaveInput");
const removeAlternativeFontsInput = document.getElementById("removeAlternativeFontsInput");
const removeAlternativeImagesInput = document.getElementById("removeAlternativeImagesInput");
const removeAlternativeMediasInput = document.getElementById("removeAlternativeMediasInput");
const saveCreatedBookmarksInput = document.getElementById("saveCreatedBookmarksInput");
const replaceBookmarkURLInput = document.getElementById("replaceBookmarkURLInput");
const allowedBookmarkFoldersInput = document.getElementById("allowedBookmarkFoldersInput");
const ignoredBookmarkFoldersInput = document.getElementById("ignoredBookmarkFoldersInput");
const groupDuplicateImagesInput = document.getElementById("groupDuplicateImagesInput");
const infobarTemplateInput = document.getElementById("infobarTemplateInput");
const blockMixedContentInput = document.getElementById("blockMixedContentInput");
const saveOriginalURLsInput = document.getElementById("saveOriginalURLsInput");
const includeInfobarInput = document.getElementById("includeInfobarInput");
const confirmInfobarInput = document.getElementById("confirmInfobarInput");
const autoCloseInput = document.getElementById("autoCloseInput");
const openEditorInput = document.getElementById("openEditorInput");
const openSavedPageInput = document.getElementById("openSavedPageInput");
const autoOpenEditorInput = document.getElementById("autoOpenEditorInput");
const defaultEditorModeInput = document.getElementById("defaultEditorModeInput");
const defaultEditorModeNormalLabel = document.getElementById("defaultEditorModeNormalLabel");
const defaultEditorModeEditLabel = document.getElementById("defaultEditorModeEditLabel");
const defaultEditorModeFormatLabel = document.getElementById("defaultEditorModeFormatLabel");
const defaultEditorModeCutLabel = document.getElementById("defaultEditorModeCutLabel");
const defaultEditorModeCutExternalLabel = document.getElementById("defaultEditorModeCutExternalLabel");
const applySystemThemeInput = document.getElementById("applySystemThemeInput");
const warnUnsavedPageInput = document.getElementById("warnUnsavedPageInput");
const expandAllButton = document.getElementById("expandAllButton");
const rulesDeleteAllButton = document.getElementById("rulesDeleteAllButton");
const ruleUrlInput = document.getElementById("ruleUrlInput");
const ruleProfileInput = document.getElementById("ruleProfileInput");
const ruleEditProfileInput = document.getElementById("ruleEditProfileInput");
const ruleAddButton = document.getElementById("ruleAddButton");
const rulesElement = document.querySelector(".rules-table");
const ruleEditUrlInput = document.getElementById("ruleEditUrlInput");
const ruleEditButton = document.getElementById("ruleEditButton");
const createURLElement = rulesElement.querySelector(".rule-create");
const showAllProfilesInput = document.getElementById("showAllProfilesInput");
const synchronizeInput = document.getElementById("synchronizeInput");
const resetAllButton = document.getElementById("resetAllButton");
const resetCurrentButton = document.getElementById("resetCurrentButton");
const resetCancelButton = document.getElementById("resetCancelButton");
const confirmButton = document.getElementById("confirmButton");
const cancelButton = document.getElementById("cancelButton");
const promptInput = document.getElementById("promptInput");
const promptCancelButton = document.getElementById("promptCancelButton");
const promptConfirmButton = document.getElementById("promptConfirmButton");
let optionsDeleteDisplayedRulesConfirm;
let profileAddPrompt;
let profileDeleteConfirm;
let profileRenamePrompt;
let optionsAddProofConfirm;
let profileDefaultSettings;
let profileDisabled;
let optionsDeleteRuleTooltip;
let optionsDeleteRuleConfirm;
let optionsUpdateRuleTooltip;

init();
let sidePanelDisplay;
if (location.href.endsWith("#side-panel")) {
	sidePanelDisplay = true;
	document.querySelector(".options-title").remove();
	document.documentElement.classList.add("side-panel");
}
browser.runtime.onMessage.addListener(message => {
	if (message.method == "options.refresh" || (message.method == "options.refreshPanel" && sidePanelDisplay)) {
		refresh(message.profileName);
	}
});
let pendingSave = Promise.resolve();
rulesDeleteAllButton.addEventListener("click", async event => {
	if (await confirm(optionsDeleteDisplayedRulesConfirm, event.clientY - 100)) {
		await browser.runtime.sendMessage({ method: "config.deleteRules", profileName: !showAllProfilesInput.checked && profileNamesInput.value });
		await refresh();
		await refreshExternalComponents();
	}
}, false);
createURLElement.onsubmit = async event => {
	event.preventDefault();
	try {
		await browser.runtime.sendMessage({ method: "config.addRule", url: ruleUrlInput.value, profileName: ruleProfileInput.value });
	} catch (error) {
		// ignored
	}
	ruleUrlInput.value = "";
	ruleProfileInput.value = DEFAULT_PROFILE_NAME;
	await refresh();
	await refreshExternalComponents();
	ruleUrlInput.focus();
};
ruleUrlInput.onclick = ruleUrlInput.onkeyup = ruleUrlInput.onchange = async () => {
	ruleAddButton.disabled = !ruleUrlInput.value;
	const rules = await browser.runtime.sendMessage({ method: "config.getRules" });
	if (rules.find(rule => rule.url == ruleUrlInput.value)) {
		ruleAddButton.disabled = true;
	}
};
ruleEditUrlInput.onclick = ruleEditUrlInput.onkeyup = ruleEditUrlInput.onchange = async () => {
	ruleEditButton.disabled = !ruleEditUrlInput.value;
	const rules = await browser.runtime.sendMessage({ method: "config.getRules" });
	if (rules.find(rule => rule.url == ruleEditUrlInput.value)) {
		ruleEditButton.disabled = true;
	}
};
if (getLocalStorageItem("optionShowAllProfiles")) {
	showAllProfilesInput.checked = true;
}
showAllProfilesInput.addEventListener("click", () => {
	if (showAllProfilesInput.checked) {
		setLocalStorageItem("optionShowAllProfiles", 1);
	} else {
		removeLocalStorageItem("optionShowAllProfiles");
	}
}, false);
addProfileButton.addEventListener("click", async event => {
	const profileName = await prompt(profileAddPrompt, event.clientY + 50);
	if (profileName) {
		try {
			await browser.runtime.sendMessage({ method: "config.createProfile", profileName, fromProfileName: profileNamesInput.value });
		} catch (error) {
			// ignored
		}
		if (sidePanelDisplay) {
			await refresh();
		} else {
			await refresh(profileName);
		}
		await refreshExternalComponents();
	}
}, false);
deleteProfileButton.addEventListener("click", async event => {
	if (await confirm(profileDeleteConfirm, event.clientY + 50)) {
		try {
			await browser.runtime.sendMessage({ method: "config.deleteProfile", profileName: profileNamesInput.value });
		} catch (error) {
			// ignored
		}
		profileNamesInput.value = null;
		await refresh();
		await refreshExternalComponents();
	}
}, false);
renameProfileButton.addEventListener("click", async event => {
	const profileName = await prompt(profileRenamePrompt, event.clientY + 50, profileNamesInput.value);
	if (profileName) {
		try {
			await browser.runtime.sendMessage({ method: "config.renameProfile", profileName: profileNamesInput.value, newProfileName: profileName });
		} catch (error) {
			// ignored
		}
		await refresh(profileName);
		await refreshExternalComponents();
	}
}, false);
resetButton.addEventListener("click", async event => {
	const choice = await reset(event.clientY - 250);
	if (choice) {
		if (choice == "all") {
			await browser.runtime.sendMessage({ method: "config.resetProfiles" });
			await refresh(DEFAULT_PROFILE_NAME);
			await refreshExternalComponents();
		}
		if (choice == "current") {
			await browser.runtime.sendMessage({ method: "config.resetProfile", profileName: profileNamesInput.value });
			await refresh();
			await refreshExternalComponents();
		}
		await update();
	}
}, false);
exportButton.addEventListener("click", async () => {
	await browser.runtime.sendMessage({ method: "config.exportConfig" });
}, false);
importButton.addEventListener("click", () => {
	fileInput.onchange = async () => {
		if (fileInput.files.length) {
			const reader = new FileReader();
			reader.readAsText(fileInput.files[0]);
			const serializedConfig = await new Promise((resolve, reject) => {
				reader.addEventListener("load", () => resolve(reader.result), false);
				reader.addEventListener("error", reject, false);
			});
			const config = JSON.parse(serializedConfig);
			await browser.runtime.sendMessage({ method: "config.importConfig", config });
			await refresh(DEFAULT_PROFILE_NAME);
			await refreshExternalComponents();
			fileInput.value = "";
		}
	};
	fileInput.click();
}, false);
expandAllButton.addEventListener("click", () => {
	if (expandAllButton.className) {
		expandAllButton.className = "";
	} else {
		expandAllButton.className = "opened";
	}
	document.querySelectorAll("details").forEach(detailElement => detailElement.open = Boolean(expandAllButton.className));
}, false);
saveCreatedBookmarksInput.addEventListener("click", saveCreatedBookmarks, false);
saveWithCompanionInput.addEventListener("click", () => enableExternalSave(saveWithCompanionInput), false);
saveToClipboardInput.addEventListener("click", onClickSaveToClipboard, false);
saveToFilesystemInput.addEventListener("click", () => disableDestinationPermissions(["clipboardWrite", "nativeMessaging"]), false);
saveToClipboardInput.addEventListener("click", () => disableDestinationPermissions(["nativeMessaging"]), false);
saveWithCompanionInput.addEventListener("click", () => disableDestinationPermissions(["clipboardWrite"]), false);
saveToGDriveInput.addEventListener("click", () => disableDestinationPermissions(["clipboardWrite", "nativeMessaging"], false), false);
addProofInput.addEventListener("click", async event => {
	if (addProofInput.checked) {
		addProofInput.checked = false;
		if (await confirm(optionsAddProofConfirm, event.clientY - 100)) {
			addProofInput.checked = true;
			woleetKeyInput.disabled = false;
		}
		await update();
	}
});
browser.runtime.sendMessage({ method: "config.isSync" }).then(data => synchronizeInput.checked = data.sync);
synchronizeInput.addEventListener("click", async () => {
	if (synchronizeInput.checked) {
		await browser.runtime.sendMessage({ method: "config.enableSync" });
		await refresh(DEFAULT_PROFILE_NAME);
	} else {
		await browser.runtime.sendMessage({ method: "config.disableSync" });
		await refresh();
	}
}, false);
document.body.onchange = async event => {
	let target = event.target;
	if (target != ruleUrlInput &&
		target != ruleProfileInput &&
		target != ruleEditUrlInput &&
		target != ruleEditProfileInput &&
		target != saveCreatedBookmarksInput) {
		if (target != profileNamesInput && target != showAllProfilesInput) {
			await update();
		}
		if (target == profileNamesInput) {
			await refresh(profileNamesInput.value);
			if (sidePanelDisplay) {
				const tabsData = await browser.runtime.sendMessage({ method: "tabsData.get" });
				tabsData.profileName = profileNamesInput.value;
				await browser.runtime.sendMessage({ method: "tabsData.set", tabsData: tabsData });
				await browser.runtime.sendMessage({ method: "ui.refreshMenu" });
			}
		} else {
			if (target == contextMenuEnabledInput) {
				await browser.runtime.sendMessage({ method: "ui.refreshMenu" });
			}
			if (target == openEditorInput) {
				await browser.runtime.sendMessage({ method: "ui.refreshMenu" });
			}
			await refresh();
		}
	}
};

async function init() {
	const messages = await getMessages();
	optionsDeleteDisplayedRulesConfirm = messages.optionsDeleteDisplayedRulesConfirm.message;
	profileAddPrompt = messages.profileAddPrompt.message;
	profileDeleteConfirm = messages.profileDeleteConfirm.message;
	profileRenamePrompt = messages.profileRenamePrompt.message;
	optionsAddProofConfirm = messages.optionsAddProofConfirm.message;
	profileDefaultSettings = messages.profileDefaultSettings.message;
	profileDisabled = messages.profileDisabled.message;
	optionsDeleteRuleTooltip = messages.optionsDeleteRuleTooltip.message;
	optionsDeleteRuleConfirm = messages.optionsDeleteRuleConfirm.message;
	optionsUpdateRuleTooltip = messages.optionsUpdateRuleTooltip.message;
	addProfileButton.title = messages.profileAddButtonTooltip.message;
	deleteProfileButton.title = messages.profileDeleteButtonTooltip.message;
	renameProfileButton.title = messages.profileRenameButtonTooltip.message;
	removeHiddenElementsLabel.textContent = messages.optionRemoveHiddenElements.message;
	removeUnusedStylesLabel.textContent = messages.optionRemoveUnusedStyles.message;
	removeUnusedFontsLabel.textContent = messages.optionRemoveUnusedFonts.message;
	removeFramesLabel.textContent = messages.optionRemoveFrames.message;
	removeImportsLabel.textContent = messages.optionRemoveImports.message;
	blockScriptsLabel.textContent = messages.optionResourceScript.message;
	blockAudiosLabel.textContent = messages.optionResourceAudio.message;
	blockVideosLabel.textContent = messages.optionResourceVideo.message;
	blockFontsLabel.textContent = messages.optionResourceFont.message;
	blockStylesheetsLabel.textContent = messages.optionResourceStylesheet.message;
	blockImagesLabel.textContent = messages.optionResourceImage.message;
	acceptHeaderDocumentLabel.textContent = messages.optionResourceDocument.message;
	acceptHeaderScriptLabel.textContent = messages.optionResourceScript.message;
	acceptHeaderAudioLabel.textContent = messages.optionResourceAudio.message;
	acceptHeaderVideoLabel.textContent = messages.optionResourceVideo.message;
	acceptHeaderFontLabel.textContent = messages.optionResourceFont.message;
	acceptHeaderStylesheetLabel.textContent = messages.optionResourceStylesheet.message;
	acceptHeaderImageLabel.textContent = messages.optionResourceImage.message;
	saveRawPageLabel.textContent = messages.optionSaveRawPage.message;
	insertMetaCSPLabel.textContent = messages.optionInsertMetaCSP.message;
	saveToClipboardLabel.textContent = messages.optionSaveToClipboard.message;
	saveToFilesystemLabel.textContent = messages.optionSaveToFilesystem.message;
	addProofLabel.textContent = messages.optionAddProof.message;
	woleetKeyLabel.textContent = messages.optionWoleetKey.message;
	saveToGDriveLabel.textContent = messages.optionSaveToGDrive.message;
	saveToGitHubLabel.textContent = messages.optionSaveToGitHub.message;
	githubTokenLabel.textContent = messages.optionGitHubToken.message;
	githubUserLabel.textContent = messages.optionGitHubUser.message;
	githubRepositoryLabel.textContent = messages.optionGitHubRepository.message;
	githubBranchLabel.textContent = messages.optionGitHubBranch.message;
	saveWithCompanionLabel.textContent = messages.optionSaveWithCompanion.message;
	compressHTMLLabel.textContent = messages.optionCompressHTML.message;
	compressCSSLabel.textContent = messages.optionCompressCSS.message;
	moveStylesInHeadLabel.textContent = messages.optionMoveStylesInHead.message;
	loadDeferredImagesLabel.textContent = messages.optionLoadDeferredImages.message;
	loadDeferredImagesMaxIdleTimeLabel.textContent = messages.optionLoadDeferredImagesMaxIdleTime.message;
	loadDeferredImagesKeepZoomLevelLabel.textContent = messages.optionLoadDeferredImagesKeepZoomLevel.message;
	loadDeferredImagesDispatchScrollEventLabel.textContent = messages.optionLoadDeferredImagesDispatchScrollEvent.message;
	addMenuEntryLabel.textContent = messages.optionAddMenuEntry.message;
	filenameTemplateLabel.textContent = messages.optionFilenameTemplate.message;
	filenameMaxLengthLabel.textContent = messages.optionFilenameMaxLength.message;
	filenameMaxLengthBytesUnitLabel.textContent = messages.optionFilenameMaxLengthBytesUnit.message;
	filenameMaxLengthCharsUnitLabel.textContent = messages.optionFilenameMaxLengthCharsUnit.message;
	shadowEnabledLabel.textContent = messages.optionDisplayShadow.message;
	setMaxResourceSizeLabel.textContent = messages.optionSetMaxResourceSize.message;
	maxResourceSizeLabel.textContent = messages.optionMaxResourceSize.message;
	setMaxResourceDelayLabel.textContent = messages.optionSetMaxResourceDelay.message;
	maxResourceDelayLabel.textContent = messages.optionMaxResourceDelay.message;
	confirmFilenameLabel.textContent = messages.optionConfirmFilename.message;
	filenameConflictActionLabel.textContent = messages.optionFilenameConflictAction.message;
	filenameConflictActionUniquifyLabel.textContent = messages.optionFilenameConflictActionUniquify.message;
	filenameConflictActionOverwriteLabel.textContent = messages.optionFilenameConflictActionOverwrite.message;
	filenameConflictActionPromptLabel.textContent = messages.optionFilenameConflictActionPrompt.message;
	filenameConflictActionSkipLabel.textContent = messages.optionFilenameConflictActionSkip.message;
	displayInfobarLabel.textContent = messages.optionDisplayInfobar.message;
	displayStatsLabel.textContent = messages.optionDisplayStats.message;
	backgroundSaveLabel.textContent = messages.optionBackgroundSave.message;
	removeAlternativeFontsLabel.textContent = messages.optionRemoveAlternativeFonts.message;
	removeAlternativeImagesLabel.textContent = messages.optionRemoveAlternativeImages.message;
	removeAlternativeMediasLabel.textContent = messages.optionRemoveAlternativeMedias.message;
	saveCreatedBookmarksLabel.textContent = messages.optionSaveCreatedBookmarks.message;
	replaceBookmarkURLLabel.textContent = messages.optionReplaceBookmarkURL.message;
	allowedBookmarkFoldersLabel.textContent = messages.optionAllowedBookmarkFolders.message;
	ignoredBookmarkFoldersLabel.textContent = messages.optionIgnoredBookmarkFolders.message;
	groupDuplicateImagesLabel.textContent = messages.optionGroupDuplicateImages.message;
	titleLabel.textContent = messages.optionsTitle.message;
	userInterfaceLabel.textContent = messages.optionsUserInterfaceSubTitle.message;
	filenameLabel.textContent = messages.optionsFileNameSubTitle.message;
	htmlContentLabel.textContent = messages.optionsHTMLContentSubTitle.message;
	imagesLabel.textContent = messages.optionsImagesSubTitle.message;
	stylesheetsLabel.textContent = messages.optionsStylesheetsSubTitle.message;
	fontsLabel.textContent = messages.optionsFontsSubTitle.message;
	networkLabel.textContent = messages.optionsNetworkSubTitle;
	blockResourcesLabel.textContent = messages.optionsBlockedResources;
	acceptHeadersLabel.textContent = messages.optionsAcceptHeaders;
	destinationLabel.textContent = messages.optionsDestinationSubTitle;
	destinationLabel.textContent = messages.optionsDestinationSubTitle.message;
	bookmarksLabel.textContent = messages.optionsBookmarkSubTitle.message;
	miscLabel.textContent = messages.optionsMiscSubTitle.message;
	helpLabel.textContent = messages.optionsHelpLink.message;
	infobarTemplateLabel.textContent = messages.optionInfobarTemplate.message;
	blockMixedContentLabel.textContent = messages.optionBlockMixedContent.message;
	saveOriginalURLsLabel.textContent = messages.optionSaveOriginalURLs.message;
	includeInfobarLabel.textContent = messages.optionIncludeInfobar.message;
	confirmInfobarLabel.textContent = messages.optionConfirmInfobar.message;
	autoCloseLabel.textContent = messages.optionAutoClose.message;
	editorLabel.textContent = messages.optionsEditorSubTitle.message;
	openEditorLabel.textContent = messages.optionOpenEditor.message;
	openSavedPageLabel.textContent = messages.optionOpenSavedPage.message;
	autoOpenEditorLabel.textContent = messages.optionAutoOpenEditor.message;
	defaultEditorModeLabel.textContent = messages.optionDefaultEditorMode.message;
	defaultEditorModeNormalLabel.textContent = messages.optionDefaultEditorModeNormal.message;
	defaultEditorModeEditLabel.textContent = messages.optionDefaultEditorModeEdit.message;
	defaultEditorModeFormatLabel.textContent = messages.optionDefaultEditorModeFormat.message;
	defaultEditorModeCutLabel.textContent = messages.optionDefaultEditorModeCut.message;
	defaultEditorModeCutExternalLabel.textContent = messages.optionDefaultEditorModeCutExternal.message;
	applySystemThemeLabel.textContent = messages.optionApplySystemTheme.message;
	warnUnsavedPageLabel.textContent = messages.optionWarnUnsavedPage.message;
	resetButton.textContent = messages.optionsResetButton.message;
	exportButton.textContent = messages.optionsExportButton.message;
	importButton.textContent = messages.optionsImportButton.message;
	resetButton.title = messages.optionsResetTooltip.message;
	autoSettingsLabel.textContent = messages.optionsAutoSettingsSubTitle.message;
	autoSettingsUrlLabel.textContent = messages.optionsAutoSettingsUrl.message;
	autoSettingsProfileLabel.textContent = messages.optionsAutoSettingsProfile.message;
	ruleAddButton.title = messages.optionsAddRuleTooltip.message;
	ruleEditButton.title = messages.optionsValidateChangesTooltip.message;
	rulesDeleteAllButton.title = messages.optionsDeleteRulesTooltip.message;
	showAllProfilesLabel.textContent = messages.optionsAutoSettingsShowAllProfiles.message;
	ruleUrlInput.placeholder = ruleEditUrlInput.placeholder = messages.optionsAutoSettingsUrlPlaceholder.message;
	synchronizeLabel.textContent = messages.optionSynchronize.message;
	resetAllButton.textContent = messages.optionsResetAllButton.message;
	resetCurrentButton.textContent = messages.optionsResetCurrentButton.message;
	resetCancelButton.textContent = promptCancelButton.textContent = cancelButton.textContent = messages.optionsCancelButton.message;
	confirmButton.textContent = promptConfirmButton.textContent = messages.optionsOKButton.message;
	document.getElementById("resetConfirmLabel").textContent = messages.optionsResetConfirm.message;
}

if (location.href.endsWith("#")) {
	document.querySelector(".new-window-link").remove();
	document.documentElement.classList.add("maximized");
}
let tabsData;
browser.runtime.sendMessage({ method: "tabsData.get" }).then(allTabsData => {
	tabsData = allTabsData;
	return refresh(tabsData.profileName);
});
getHelpContents();

async function refresh(profileName) {
	const [profiles, rules] = await Promise.all([
		browser.runtime.sendMessage({ method: "config.getProfiles" }),
		browser.runtime.sendMessage({ method: "config.getRules" })]);
	const selectedProfileName = profileName || profileNamesInput.value || DEFAULT_PROFILE_NAME;
	Array.from(profileNamesInput.childNodes).forEach(node => node.remove());
	profileNamesInput.options.length = 0;
	ruleProfileInput.options.length = 0;
	ruleEditProfileInput.options.length = 0;
	let optionElement = document.createElement("option");
	optionElement.value = DEFAULT_PROFILE_NAME;
	optionElement.textContent = profileDefaultSettings;
	[CURRENT_PROFILE_NAME].concat(...Object.keys(profiles)).forEach(profileName => {
		const optionElement = document.createElement("option");
		optionElement.value = optionElement.textContent = profileName;
		if (profileName == DEFAULT_PROFILE_NAME) {
			optionElement.textContent = profileDefaultSettings;
		}
		if (profileName != CURRENT_PROFILE_NAME) {
			profileNamesInput.appendChild(optionElement);
		}
		ruleProfileInput.appendChild(optionElement.cloneNode(true));
		ruleEditProfileInput.appendChild(optionElement.cloneNode(true));
	});
	profileNamesInput.disabled = profileNamesInput.options.length == 1;
	optionElement = document.createElement("option");
	optionElement.value = DISABLED_PROFILE_NAME;
	optionElement.textContent = profileDisabled;
	const rulesDataElement = rulesElement.querySelector(".rules-data");
	Array.from(rulesDataElement.childNodes).forEach(node => (!node.className || !node.className.includes("rule-edit")) && node.remove());
	const editURLElement = rulesElement.querySelector(".rule-edit");
	createURLElement.hidden = false;
	editURLElement.hidden = true;
	ruleProfileInput.value = selectedProfileName;
	let rulesDisplayed;
	rules.forEach(rule => {
		if (showAllProfilesInput.checked || selectedProfileName == rule.profile) {
			rulesDisplayed = true;
			const ruleElement = rulesElement.querySelector(".rule-view").cloneNode(true);
			const ruleUrlElement = ruleElement.querySelector(".rule-url");
			const ruleProfileElement = ruleElement.querySelector(".rule-profile");
			ruleUrlElement.textContent = ruleUrlElement.title = rule.url;
			ruleProfileElement.textContent = ruleProfileElement.title = getProfileText(rule.profile);
			ruleElement.hidden = false;
			ruleElement.className = "tr data";
			rulesDataElement.appendChild(ruleElement);
			const ruleDeleteButton = ruleElement.querySelector(".rule-delete-button");
			const ruleUpdateButton = ruleElement.querySelector(".rule-update-button");
			ruleDeleteButton.title = optionsDeleteRuleTooltip;
			ruleDeleteButton.addEventListener("click", async event => {
				if (await confirm(optionsDeleteRuleConfirm, event.clientY - 100)) {
					await browser.runtime.sendMessage({ method: "config.deleteRule", url: rule.url });
					await refresh();
					await refreshExternalComponents();
				}
			}, false);
			ruleUpdateButton.title = optionsUpdateRuleTooltip;
			ruleUpdateButton.addEventListener("click", async () => {
				if (editURLElement.hidden) {
					createURLElement.hidden = true;
					editURLElement.hidden = false;
					rulesDataElement.replaceChild(editURLElement, ruleElement);
					ruleEditUrlInput.value = rule.url;
					ruleEditProfileInput.value = rule.profile;
					ruleEditUrlInput.focus();
					editURLElement.onsubmit = async event => {
						event.preventDefault();
						rulesElement.appendChild(editURLElement);
						await browser.runtime.sendMessage({ method: "config.updateRule", url: rule.url, newUrl: ruleEditUrlInput.value, profileName: ruleEditProfileInput.value });
						await refresh();
						await refreshExternalComponents();
						ruleUrlInput.focus();
					};
				}
			}, false);
		}
	});
	rulesDeleteAllButton.disabled = !rulesDisplayed;
	rulesElement.appendChild(createURLElement);
	profileNamesInput.value = selectedProfileName;
	renameProfileButton.disabled = deleteProfileButton.disabled = profileNamesInput.value == DEFAULT_PROFILE_NAME;
	const profileOptions = profiles[selectedProfileName];
	removeHiddenElementsInput.checked = profileOptions.removeHiddenElements;
	removeUnusedStylesInput.checked = profileOptions.removeUnusedStyles;
	removeUnusedFontsInput.checked = profileOptions.removeUnusedFonts;
	removeFramesInput.checked = profileOptions.removeFrames;
	removeImportsInput.checked = profileOptions.removeImports;
	blockScriptsInput.checked = profileOptions.blockScripts;
	blockVideosInput.checked = profileOptions.blockVideos;
	blockAudiosInput.checked = profileOptions.blockAudios;
	blockFontsInput.checked = profileOptions.blockFonts;
	blockStylesheetsInput.checked = profileOptions.blockStylesheets;
	blockImagesInput.checked = profileOptions.blockImages;
	acceptHeaderDocumentInput.value = profileOptions.acceptHeaders.document;
	acceptHeaderScriptInput.value = profileOptions.acceptHeaders.script;
	acceptHeaderAudioInput.value = profileOptions.acceptHeaders.audio;
	acceptHeaderVideoInput.value = profileOptions.acceptHeaders.video;
	acceptHeaderFontInput.value = profileOptions.acceptHeaders.font;
	acceptHeaderStylesheetInput.value = profileOptions.acceptHeaders.stylesheet;
	acceptHeaderImageInput.value = profileOptions.acceptHeaders.image;
	saveRawPageInput.checked = profileOptions.saveRawPage;
	insertMetaCSPInput.checked = profileOptions.insertMetaCSP;
	saveToClipboardInput.checked = profileOptions.saveToClipboard;
	addProofInput.checked = profileOptions.addProof;
	woleetKeyInput.value = profileOptions.woleetKey;
	woleetKeyInput.disabled = !profileOptions.addProof;
	saveToGDriveInput.checked = profileOptions.saveToGDrive;
	saveToGitHubInput.checked = profileOptions.saveToGitHub;
	githubTokenInput.value = profileOptions.githubToken;
	githubTokenInput.disabled = !profileOptions.saveToGitHub;
	githubUserInput.value = profileOptions.githubUser;
	githubUserInput.disabled = !profileOptions.saveToGitHub;
	githubRepositoryInput.value = profileOptions.githubRepository;
	githubRepositoryInput.disabled = !profileOptions.saveToGitHub;
	githubBranchInput.value = profileOptions.githubBranch;
	githubBranchInput.disabled = !profileOptions.saveToGitHub;
	saveWithCompanionInput.checked = profileOptions.saveWithCompanion;
	saveToFilesystemInput.checked = !profileOptions.saveToGDrive && !profileOptions.saveToGitHub && !profileOptions.saveWithCompanion && !saveToClipboardInput.checked;
	compressHTMLInput.checked = profileOptions.compressHTML;
	compressCSSInput.checked = profileOptions.compressCSS;
	moveStylesInHeadInput.checked = profileOptions.moveStylesInHead;
	loadDeferredImagesInput.checked = profileOptions.loadDeferredImages;
	loadDeferredImagesMaxIdleTimeInput.value = profileOptions.loadDeferredImagesMaxIdleTime;
	loadDeferredImagesKeepZoomLevelInput.checked = profileOptions.loadDeferredImagesKeepZoomLevel;
	loadDeferredImagesKeepZoomLevelInput.disabled = !profileOptions.loadDeferredImages;
	loadDeferredImagesMaxIdleTimeInput.disabled = !profileOptions.loadDeferredImages;
	loadDeferredImagesDispatchScrollEventInput.checked = profileOptions.loadDeferredImagesDispatchScrollEvent;
	loadDeferredImagesDispatchScrollEventInput.disabled = !profileOptions.loadDeferredImages;
	contextMenuEnabledInput.checked = profileOptions.contextMenuEnabled;
	filenameTemplateInput.value = profileOptions.filenameTemplate;
	filenameMaxLengthInput.value = profileOptions.filenameMaxLength;
	filenameMaxLengthUnitInput.value = profileOptions.filenameMaxLengthUnit;
	shadowEnabledInput.checked = profileOptions.shadowEnabled;
	maxResourceSizeEnabledInput.checked = profileOptions.maxResourceSizeEnabled;
	maxResourceSizeInput.value = profileOptions.maxResourceSizeEnabled ? profileOptions.maxResourceSize : 10;
	maxResourceSizeInput.disabled = !profileOptions.maxResourceSizeEnabled;
	maxResourceDelayEnabledInput.checked = Boolean(profileOptions.networkTimeout);
	maxResourceDelayInput.value = profileOptions.networkTimeout ? profileOptions.networkTimeout / 1000 : 60;
	maxResourceDelayInput.disabled = !profileOptions.networkTimeout;
	confirmFilenameInput.checked = profileOptions.confirmFilename;
	filenameConflictActionInput.value = profileOptions.filenameConflictAction;
	displayInfobarInput.checked = profileOptions.displayInfobar;
	displayStatsInput.checked = profileOptions.displayStats;
	backgroundSaveInput.checked = profileOptions.backgroundSave;
	removeAlternativeFontsInput.checked = profileOptions.removeAlternativeFonts;
	removeAlternativeImagesInput.checked = profileOptions.removeAlternativeImages;
	groupDuplicateImagesInput.checked = profileOptions.groupDuplicateImages;
	removeAlternativeMediasInput.checked = profileOptions.removeAlternativeMedias;
	saveCreatedBookmarksInput.checked = profileOptions.saveCreatedBookmarks;
	replaceBookmarkURLInput.checked = profileOptions.replaceBookmarkURL;
	replaceBookmarkURLInput.disabled = !profileOptions.saveCreatedBookmarks;
	allowedBookmarkFoldersInput.value = profileOptions.allowedBookmarkFolders.map(folder => folder.replace(/,/g, "\\,")).join(","); // eslint-disable-line no-useless-escape
	allowedBookmarkFoldersInput.disabled = !profileOptions.saveCreatedBookmarks;
	ignoredBookmarkFoldersInput.value = profileOptions.ignoredBookmarkFolders.map(folder => folder.replace(/,/g, "\\,")).join(","); // eslint-disable-line no-useless-escape
	ignoredBookmarkFoldersInput.disabled = !profileOptions.saveCreatedBookmarks;
	infobarTemplateInput.value = profileOptions.infobarTemplate;
	blockMixedContentInput.checked = profileOptions.blockMixedContent;
	saveOriginalURLsInput.checked = profileOptions.saveOriginalURLs;
	includeInfobarInput.checked = profileOptions.includeInfobar;
	confirmInfobarInput.checked = profileOptions.confirmInfobarContent;
	autoCloseInput.checked = profileOptions.autoClose;
	openEditorInput.checked = profileOptions.openEditor;
	openSavedPageInput.checked = profileOptions.openSavedPage;
	autoOpenEditorInput.checked = profileOptions.autoOpenEditor;
	defaultEditorModeInput.value = profileOptions.defaultEditorMode;
	applySystemThemeInput.checked = profileOptions.applySystemTheme;
	warnUnsavedPageInput.checked = profileOptions.warnUnsavedPage;
}

function getProfileText(profileName) {
	return profileName == DEFAULT_PROFILE_NAME ? profileDefaultSettings : profileName == DISABLED_PROFILE_NAME ? profileDisabled : profileName;
}

async function update() {
	try {
		await pendingSave;
	} catch (error) {
		// ignored
	}
	pendingSave = browser.runtime.sendMessage({
		method: "config.updateProfile",
		profileName: profileNamesInput.value,
		profile: {
			removeHiddenElements: removeHiddenElementsInput.checked,
			removeUnusedStyles: removeUnusedStylesInput.checked,
			removeUnusedFonts: removeUnusedFontsInput.checked,
			removeFrames: removeFramesInput.checked,
			removeImports: removeImportsInput.checked,
			blockScripts: blockScriptsInput.checked,
			blockVideos: blockVideosInput.checked,
			blockAudios: blockAudiosInput.checked,
			blockFonts: blockFontsInput.checked,
			blockStylesheets: blockStylesheetsInput.checked,
			blockImages: blockImagesInput.checked,
			acceptHeaders: {
				document: acceptHeaderDocumentInput.value,
				script: acceptHeaderScriptInput.value,
				audio: acceptHeaderAudioInput.value,
				video: acceptHeaderVideoInput.value,
				font: acceptHeaderFontInput.value,
				stylesheet: acceptHeaderStylesheetInput.value,
				image: acceptHeaderImageInput.value
			},
			saveRawPage: saveRawPageInput.checked,
			insertMetaCSP: insertMetaCSPInput.checked,
			saveToClipboard: saveToClipboardInput.checked,
			addProof: addProofInput.checked,
			woleetKey: woleetKeyInput.value,
			saveToGDrive: saveToGDriveInput.checked,
			saveToGitHub: saveToGitHubInput.checked,
			githubToken: githubTokenInput.value,
			githubUser: githubUserInput.value,
			githubRepository: githubRepositoryInput.value,
			githubBranch: githubBranchInput.value,
			saveWithCompanion: saveWithCompanionInput.checked,
			compressHTML: compressHTMLInput.checked,
			compressCSS: compressCSSInput.checked,
			moveStylesInHead: moveStylesInHeadInput.checked,
			loadDeferredImages: loadDeferredImagesInput.checked,
			loadDeferredImagesMaxIdleTime: Math.max(loadDeferredImagesMaxIdleTimeInput.value, 0),
			loadDeferredImagesKeepZoomLevel: loadDeferredImagesKeepZoomLevelInput.checked,
			loadDeferredImagesDispatchScrollEvent: loadDeferredImagesDispatchScrollEventInput.checked,
			contextMenuEnabled: contextMenuEnabledInput.checked,
			filenameTemplate: filenameTemplateInput.value,
			filenameMaxLength: filenameMaxLengthInput.value,
			filenameMaxLengthUnit: filenameMaxLengthUnitInput.value,
			shadowEnabled: shadowEnabledInput.checked,
			maxResourceSizeEnabled: maxResourceSizeEnabledInput.checked,
			maxResourceSize: maxResourceSizeEnabledInput.checked ? Math.max(maxResourceSizeInput.value, 0) : 10,
			networkTimeout: maxResourceDelayEnabledInput.checked ? Math.max(maxResourceDelayInput.value * 1000, 60) : 0,
			confirmFilename: confirmFilenameInput.checked,
			filenameConflictAction: filenameConflictActionInput.value,
			displayInfobar: displayInfobarInput.checked,
			displayStats: displayStatsInput.checked,
			backgroundSave: backgroundSaveInput.checked,
			removeAlternativeFonts: removeAlternativeFontsInput.checked,
			removeAlternativeImages: removeAlternativeImagesInput.checked,
			removeAlternativeMedias: removeAlternativeMediasInput.checked,
			saveCreatedBookmarks: saveCreatedBookmarksInput.checked,
			replaceBookmarkURL: replaceBookmarkURLInput.checked,
			allowedBookmarkFolders: allowedBookmarkFoldersInput.value.replace(/([^\\]),/g, "$1 ,").split(/[^\\],/).map(folder => folder.replace(/\\,/g, ",")),
			ignoredBookmarkFolders: ignoredBookmarkFoldersInput.value.replace(/([^\\]),/g, "$1 ,").split(/[^\\],/).map(folder => folder.replace(/\\,/g, ",")),
			groupDuplicateImages: groupDuplicateImagesInput.checked,
			infobarTemplate: infobarTemplateInput.value,
			blockMixedContent: blockMixedContentInput.checked,
			saveOriginalURLs: saveOriginalURLsInput.checked,
			includeInfobar: includeInfobarInput.checked,
			confirmInfobarContent: confirmInfobarInput.checked,
			autoClose: autoCloseInput.checked,
			openEditor: openEditorInput.checked,
			openSavedPage: openSavedPageInput.checked,
			autoOpenEditor: autoOpenEditorInput.checked,
			defaultEditorMode: defaultEditorModeInput.value,
			applySystemTheme: applySystemThemeInput.checked,
			warnUnsavedPage: warnUnsavedPageInput.checked
		}
	});
	try {
		await pendingSave;
	} catch (error) {
		// ignored
	}
}

async function refreshExternalComponents() {
	try {
		await browser.runtime.sendMessage({ method: "ui.refreshMenu" });
		if (sidePanelDisplay) {
			await browser.runtime.sendMessage({ method: "options.refresh", profileName: profileNamesInput.value });
		} else {
			await browser.runtime.sendMessage({ method: "options.refreshPanel", profileName: profileNamesInput.value });
		}
	} catch (error) {
		// ignored
	}
}

async function saveCreatedBookmarks() {
	if (saveCreatedBookmarksInput.checked) {
		saveCreatedBookmarksInput.checked = false;
		try {
			const permissionGranted = await browser.permissions.request({ permissions: ["bookmarks"] });
			if (permissionGranted) {
				saveCreatedBookmarksInput.checked = true;
				await update();
				await refresh();
				await browser.runtime.sendMessage({ method: "bookmarks.saveCreatedBookmarks" });
			} else {
				await disableOption();
			}
		} catch (error) {
			saveCreatedBookmarksInput.checked = false;
			await disableOption();
		}
	} else {
		try {
			await browser.permissions.remove({ permissions: ["bookmarks"] });
		} catch (error) {
			// ignored
		}
		await disableOption();
	}

	async function disableOption() {
		await update();
		await refresh();
		await browser.runtime.sendMessage({ method: "bookmarks.disable" });
	}
}

async function onClickSaveToClipboard() {
	if (saveToClipboardInput.checked) {
		saveToClipboardInput.checked = false;
		try {
			const permissionGranted = await browser.permissions.request({ permissions: ["clipboardWrite"] });
			if (permissionGranted) {
				saveToClipboardInput.checked = true;
				await browser.runtime.sendMessage({ method: "downloads.disableGDrive" });
			}
		} catch (error) {
			saveToClipboardInput.checked = false;
		}
	}
	await update();
	await refresh();
}

async function disableDestinationPermissions(permissions, disableGDrive = true) {
	if (disableGDrive) {
		await browser.runtime.sendMessage({ method: "downloads.disableGDrive" });
	}
	try {
		await browser.permissions.remove({ permissions });
	} catch (error) {
		//ignored
	}
}

async function enableExternalSave(input) {
	if (input.checked) {
		input.checked = false;
		try {
			const permissionGranted = await browser.permissions.request({ permissions: ["nativeMessaging"] });
			if (permissionGranted) {
				input.checked = true;
				await refreshOption();
				if (window.chrome) {
					window.chrome.runtime.reload();
					location.reload();
				}
			} else {
				await refreshOption();
			}
		} catch (error) {
			input.checked = true;
			await refreshOption();
		}
	} else {
		await refreshOption();
	}

	async function refreshOption() {
		await update();
		await refresh();
	}
}

async function confirm(message, positionY) {
	document.getElementById("confirmLabel").textContent = message;
	document.getElementById("formConfirmContainer").style.setProperty("display", "flex");
	document.querySelector("#formConfirmContainer .popup-content").style.setProperty("margin-top", positionY + "px");
	confirmButton.focus();
	document.body.style.setProperty("overflow-y", "hidden");
	return new Promise(resolve => {
		confirmButton.onclick = event => hideAndResolve(event, true);
		cancelButton.onclick = event => hideAndResolve(event);
		window.onkeyup = event => {
			if (event.key == "Escape") {
				hideAndResolve(event);
			}
		};

		function hideAndResolve(event, value) {
			event.preventDefault();
			document.getElementById("formConfirmContainer").style.setProperty("display", "none");
			document.body.style.setProperty("overflow-y", "");
			resolve(value);
		}
	});
}

async function reset(positionY) {
	document.getElementById("formResetContainer").style.setProperty("display", "flex");
	document.querySelector("#formResetContainer .popup-content").style.setProperty("margin-top", positionY + "px");
	resetCancelButton.focus();
	document.body.style.setProperty("overflow-y", "hidden");
	return new Promise(resolve => {
		resetAllButton.onclick = event => hideAndResolve(event, "all");
		resetCurrentButton.onclick = event => hideAndResolve(event, "current");
		resetCancelButton.onclick = event => hideAndResolve(event);
		window.onkeyup = event => {
			if (event.key == "Escape") {
				hideAndResolve(event);
			}
		};

		function hideAndResolve(event, value) {
			event.preventDefault();
			document.getElementById("formResetContainer").style.setProperty("display", "none");
			document.body.style.setProperty("overflow-y", "");
			resolve(value);
		}
	});
}

async function prompt(message, positionY, defaultValue = "") {
	document.getElementById("promptLabel").textContent = message;
	document.getElementById("formPromptContainer").style.setProperty("display", "flex");
	document.querySelector("#formPromptContainer .popup-content").style.setProperty("margin-top", positionY + "px");
	promptInput.value = defaultValue;
	promptInput.focus();
	document.body.style.setProperty("overflow-y", "hidden");
	return new Promise(resolve => {
		promptConfirmButton.onclick = event => hideAndResolve(event, promptInput.value);
		promptCancelButton.onclick = event => hideAndResolve(event);
		window.onkeyup = event => {
			if (event.key == "Escape") {
				hideAndResolve(event);
			}
		};

		function hideAndResolve(event, value) {
			event.preventDefault();
			document.getElementById("formPromptContainer").style.setProperty("display", "none");
			document.body.style.setProperty("overflow-y", "");
			resolve(value);
		}
	});
}

async function getHelpContents() {
	const helpPage = await fetch(browser.runtime.getURL(HELP_PAGE_PATH));
	const content = new TextDecoder().decode(await helpPage.arrayBuffer());
	const doc = (new DOMParser()).parseFromString(content, "text/html");
	const items = doc.querySelectorAll("[data-options-label]");
	items.forEach(itemElement => {
		const optionLabel = document.getElementById(itemElement.dataset.optionsLabel);
		if (optionLabel) {
			const helpIconWrapper = document.createElement("span");
			const helpIconContainer = document.createElement("span");
			const helpIcon = document.createElement("img");
			helpIcon.src = HELP_ICON_URL;
			helpIconWrapper.className = "help-icon-wrapper";
			const labelWords = optionLabel.textContent.split(/\s+/);
			if (labelWords.length > 1) {
				helpIconWrapper.textContent = labelWords.pop();
				optionLabel.textContent = labelWords.join(" ") + " ";
			}
			helpIconContainer.className = "help-icon";
			helpIconContainer.onclick = () => {
				helpContent.hidden = !helpContent.hidden;
				return false;
			};
			helpIcon.tabIndex = 0;
			helpIconContainer.onkeyup = event => {
				if (event.code == "Enter") {
					helpContent.hidden = !helpContent.hidden;
					return false;
				}
			};
			helpIconContainer.appendChild(helpIcon);
			helpIconWrapper.appendChild(helpIconContainer);
			optionLabel.appendChild(helpIconWrapper);
			const helpContent = document.createElement("div");
			helpContent.hidden = true;
			helpContent.className = "help-content";
			itemElement.childNodes.forEach(node => {
				if (node instanceof HTMLElement && node.className != "option") {
					helpContent.appendChild(document.importNode(node, true));
				}
			});
			helpContent.querySelectorAll("a[href]").forEach(linkElement => {
				const hrefValue = linkElement.getAttribute("href");
				if (hrefValue.startsWith("#")) {
					linkElement.href = browser.runtime.getURL(HELP_PAGE_PATH + linkElement.getAttribute("href"));
					linkElement.target = "_blank";
				}
			});
			optionLabel.parentElement.insertAdjacentElement("afterEnd", helpContent);
		}
	});
}

function getLocalStorageItem(key) {
	try {
		return localStorage.getItem(key);
	} catch (error) {
		// ignored
	}
}

function setLocalStorageItem(key, value) {
	try {
		return localStorage.setItem(key, value);
	} catch (error) {
		// ignored
	}
}

function removeLocalStorageItem(key) {
	try {
		return localStorage.removeItem(key);
	} catch (error) {
		// ignored
	}
}
