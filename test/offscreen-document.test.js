// src/core/bg/offscreen.js guards every call into the offscreen document with a check-then-create:
// ask runtime.getContexts whether one exists, create it only if not. Chrome allows exactly one per
// extension and rejects the second createDocument, and nothing in this module ever closes the one it
// makes, so the document outlives the service worker while the worker is killed after ~30s idle.
// Every save after that idle timeout therefore runs the check against an existing document, which
// makes the check load-bearing rather than incidental.
//
// A 2026-09-05 probe on Chrome 131 saw getContexts return [] while a document did exist, proved by
// the createDocument that followed rejecting with "Only a single offscreen document may be created."
// That probe passed contextTypes alone; this module also passes documentUrls, which is the suspected
// difference. The rejection is now swallowed, so the check is advisory: the error itself proves the
// document is there.

/* global setTimeout */

import test from "node:test";
import assert from "node:assert/strict";

const EXTENSION_ORIGIN = "chrome-extension://singlefiletestid";
const SINGLE_DOCUMENT_MESSAGE = "Only a single offscreen document may be created.";

let contexts, createCalls, createResult, sentMessages;

globalThis.browser = {
	runtime: {
		getURL: path => EXTENSION_ORIGIN + path,
		getContexts: async filter => {
			contexts.filters.push(filter);
			return contexts.value;
		},
		sendMessage: async message => {
			sentMessages.push(message);
			return { done: true };
		}
	},
	offscreen: {
		createDocument: async parameters => {
			createCalls.push(parameters);
			return createResult();
		}
	}
};

const offscreen = await import("../src/core/bg/offscreen.js");

function reset(existing = []) {
	contexts = { value: existing, filters: [] };
	createCalls = [];
	sentMessages = [];
	createResult = () => undefined;
}

test("the document is created when the check reports none", async () => {
	reset();
	await offscreen.processPage({ tabId: 1 });
	assert.equal(createCalls.length, 1);
	assert.equal(createCalls[0].url, "/src/ui/pages/offscreen-document.html");
	assert.deepEqual(sentMessages.map(message => message.method), ["processPage"]);
});

test("nothing is created when the check reports one", async () => {
	reset([{ contextType: "OFFSCREEN_DOCUMENT" }]);
	await offscreen.processPage({ tabId: 1 });
	assert.equal(createCalls.length, 0);
	assert.equal(sentMessages.length, 1);
});

test("the check asks for the document by url, not by type alone", async () => {
	reset();
	await offscreen.processPage({ tabId: 1 });
	const filter = contexts.filters[0];
	assert.deepEqual(filter.contextTypes, ["OFFSCREEN_DOCUMENT"]);
	assert.deepEqual(filter.documentUrls, [EXTENSION_ORIGIN + "/src/ui/pages/offscreen-document.html"],
		"the 2026-09-05 probe that saw an empty result passed contextTypes alone");
});

test("a document that already exists is not an error, whatever the check said", async () => {
	reset();
	createResult = () => {
		throw new Error(SINGLE_DOCUMENT_MESSAGE);
	};
	await offscreen.processPage({ tabId: 1 });
	assert.equal(createCalls.length, 1);
	assert.deepEqual(sentMessages.map(message => message.method), ["processPage"],
		"the caller must still reach the document the error proves is there");
});

test("any other creation failure still propagates", async () => {
	reset();
	createResult = () => {
		throw new Error("No permission to create an offscreen document");
	};
	await assert.rejects(() => offscreen.processPage({ tabId: 1 }), /No permission/);
	assert.equal(sentMessages.length, 0);
});

test("concurrent callers create the document once", async () => {
	reset();
	createResult = () => new Promise(resolve => setTimeout(resolve, 10));
	await Promise.all([offscreen.processPage({ tabId: 1 }), offscreen.getImageData("https://example.com/i.png", 2, 2)]);
	assert.equal(createCalls.length, 1);
	assert.equal(sentMessages.length, 2);
});

test("the guard runs again for the next save, since the worker may have restarted", async () => {
	reset();
	await offscreen.processPage({ tabId: 1 });
	await offscreen.processPage({ tabId: 2 });
	assert.equal(contexts.filters.length, 2, "the check is per call, not cached");
	assert.equal(createCalls.length, 2, "with the check reporting none both times, both calls create");
});
