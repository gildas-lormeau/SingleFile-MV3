/* eslint-disable no-console */
/* global process, URL, setTimeout, TextDecoder */

import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { cdp, getTargets, options } from "simple-cdp";

const EXTENSION_PATH = process.env.SF_EXTENSION_PATH || resolve(new URL("..", import.meta.url).pathname);
const FIXTURES_PATH = new URL("../node_modules/single-file-core/test/fixtures/", import.meta.url).pathname;
const FIXTURE_PATH = process.env.SF_FIXTURE_PATH || join(FIXTURES_PATH, "multi-page.zip.html");
const SINGLE_PAGE_FIXTURE_PATH = process.env.SF_SINGLE_PAGE_FIXTURE_PATH || join(FIXTURES_PATH, "single-page.zip.html");
const DEDUP_FIXTURE_PATH = process.env.SF_DEDUP_FIXTURE_PATH || join(FIXTURES_PATH, "multi-page-dedup.zip.html");
const DIGEST_FIXTURE_PATH = process.env.SF_DIGEST_FIXTURE_PATH || join(FIXTURES_PATH, "classic-digest.html");
const ZIP_MODULE_URL = new URL("../node_modules/single-file-core/vendor/zip/zip.js", import.meta.url).href;
const FILENAME_CAPTURE_SCRIPT = "(() => {" +
	"if (!window.__sendMessagePatched) {" +
	"window.__sendMessagePatched = true;" +
	"const sendMessage = chrome.runtime.sendMessage.bind(chrome.runtime);" +
	"chrome.runtime.sendMessage = (...args) => {" +
	"const message = args[0];" +
	"if (message && message.method == \"downloads.download\" && message.filename) {" +
	"window.__savedFilename = message.filename;" +
	"}" +
	"return sendMessage(...args);" +
	"};" +
	"}" +
	"window.__savedFilename = undefined;" +
	"})()";
const PLAIN_PAGE_CONTENT = "<!DOCTYPE html><html><!--\n Page saved with SingleFile \n url: https://example.com/plain\n saved date: Thu Aug 27 2026 00:00:00 GMT+0000\n--><head><meta charset=\"utf-8\"><title>Plain page</title></head><body><h1>Gamma</h1></body></html>";
const CHROME_PATH = findChrome();
const DEBUG_PORT = Number(process.env.SF_E2E_PORT) || 19000 + (process.pid % 2000);
const EDITOR_PAGE_PATH = "/src/ui/pages/editor.html";
const SENDER_PAGE_PATH = "/src/ui/pages/pendings.html";

options.apiUrl = "http://127.0.0.1:" + DEBUG_PORT;
options.commandMaxTime = 15000;

function findChrome() {
	if (process.env.SF_CHROME_PATH) {
		return process.env.SF_CHROME_PATH;
	}
	const roots = [new URL(".browser", import.meta.url).pathname, join(homedir(), ".cache", "puppeteer", "chrome")];
	for (const root of roots) {
		const executablePath = findChromeExecutable(root, 0);
		if (executablePath) {
			return executablePath;
		}
	}
	throw new Error("Chrome for Testing not found, run: npm run install-test-browser");
}

function findChromeExecutable(root, depth) {
	if (depth > 8) {
		return;
	}
	let entries;
	try {
		entries = readdirSync(root, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of entries) {
		const entryPath = join(root, entry.name);
		if (entry.isFile() && (entry.name == "Google Chrome for Testing" || entry.name == "chrome" || entry.name == "chrome.exe")) {
			return entryPath;
		}
		if (entry.isDirectory()) {
			const executablePath = findChromeExecutable(entryPath, depth + 1);
			if (executablePath) {
				return executablePath;
			}
		}
	}
}

let failures = 0;
const userDataDir = mkdtempSync(join(tmpdir(), "sf-editor-e2e-"));
const downloadDir = mkdtempSync(join(tmpdir(), "sf-editor-dl-"));
mkdirSync(join(userDataDir, "Default"), { recursive: true });
writeFileSync(join(userDataDir, "Default", "Preferences"), JSON.stringify({
	download: { default_directory: downloadDir, prompt_for_download: false }
}));
const chromeArguments = [
	"--headless=new",
	"--remote-debugging-port=" + DEBUG_PORT,
	"--user-data-dir=" + userDataDir,
	"--load-extension=" + EXTENSION_PATH,
	"--disable-extensions-except=" + EXTENSION_PATH,
	"--no-first-run",
	"--no-default-browser-check",
	"--disable-background-timer-throttling",
	"--disable-renderer-backgrounding",
	"--disable-backgrounding-occluded-windows",
	"about:blank"
];
if (process.env.CI) {
	chromeArguments.unshift("--no-sandbox", "--disable-dev-shm-usage");
}
const chromeProcess = spawn(CHROME_PATH, chromeArguments, { stdio: ["ignore", "ignore", "pipe"] });
let chromeStderr = "";
chromeProcess.stderr.on("data", data => chromeStderr = (chromeStderr + data).slice(-4096));

let suiteCompleted = false;
process.on("beforeExit", () => {
	if (!suiteCompleted) {
		console.error("suite aborted early" + (chromeStderr ? ", chrome stderr: " + chromeStderr : ""));
		process.exitCode = 1;
	}
});

try {
	await run();
	suiteCompleted = true;
} catch (error) {
	suiteCompleted = true;
	failures++;
	console.error("FATAL", error);
	if (chromeStderr) {
		console.error("chrome stderr:", chromeStderr);
	}
} finally {
	chromeProcess.kill();
	await new Promise(resolve => chromeProcess.on("exit", resolve));
	rmSync(userDataDir, { recursive: true, force: true });
	rmSync(downloadDir, { recursive: true, force: true });
}
console.log(failures ? "FAILED (" + failures + ")" : "PASSED");
process.exit(failures ? 1 : 0);

function clearDownloadDir() {
	rmSync(downloadDir, { recursive: true, force: true });
	mkdirSync(downloadDir, { recursive: true });
}

function waitForDownload(description) {
	return waitFor(() => {
		const filenames = readdirSync(downloadDir).filter(filename => !filename.endsWith(".crdownload") && !filename.startsWith("."));
		return filenames.length ? join(downloadDir, filenames[0]) : undefined;
	}, description);
}

async function run() {
	const extensionId = await waitFor(async () => {
		const targets = (await getTargets()).filter(target => target.type == "service_worker" && target.url.startsWith("chrome-extension://"));
		if (process.env.SF_E2E_DEBUG) {
			console.log("targets:", (await getTargets()).map(target => target.type + " " + target.url.substring(0, 70)));
		}
		return targets.length ? targets[0].url.split("/")[2] : undefined;
	}, "extension loaded", 60000);
	console.log("extension id", extensionId);
	const baseURL = "chrome-extension://" + extensionId;
	const { targetId } = await cdp.Target.createTarget({ url: baseURL + SENDER_PAGE_PATH });
	const { sessionId } = await cdp.Target.attachToTarget({ targetId, flatten: true });
	await cdp.Runtime.enable(null, sessionId);
	await cdp.Page.enable(null, sessionId);
	await waitFor(async () => {
		const { result } = await cdp.Runtime.evaluate({ expression: "typeof chrome != 'undefined' && chrome.runtime && document.readyState == 'complete' && location.href.startsWith('chrome-extension:') || undefined" }, sessionId);
		if (!result.value) {
			const navigateResult = await cdp.Page.navigate({ url: baseURL + SENDER_PAGE_PATH }, sessionId);
			if (process.env.SF_E2E_DEBUG) {
				const { result: hrefResult } = await cdp.Runtime.evaluate({ expression: "location.href" }, sessionId);
				console.log("navigate:", JSON.stringify(navigateResult), "href:", hrefResult && hrefResult.value);
			}
		}
		return result.value;
	}, "sender page ready");
	const fixtureBase64 = readFileSync(FIXTURE_PATH).toString("base64");

	async function openEditorArchive(base64Content, filename, compressContent = true) {
		for (let attempt = 0; attempt < 3; attempt++) {
			try {
				await cdp.Runtime.evaluate({ expression: "window.__fixtureBase64 = \"\"; window.__editorOpenPending = true" }, sessionId);
				for (let offset = 0; offset < base64Content.length; offset += 200000) {
					await cdp.Runtime.evaluate({ expression: "window.__fixtureBase64 += " + JSON.stringify(base64Content.substring(offset, offset + 200000)) }, sessionId);
				}
				await cdp.Runtime.evaluate({
					expression: "(() => {" +
						"const bytes = Uint8Array.from(atob(window.__fixtureBase64), character => character.charCodeAt(0));" +
						(compressContent
							? "chrome.runtime.sendMessage({ method: \"editor.open\", content: Array.from(bytes), compressContent: true, selfExtractingArchive: true, filename: " + JSON.stringify(filename) + " });"
							: "chrome.runtime.sendMessage({ method: \"editor.open\", content: new TextDecoder().decode(bytes), compressContent: false, filename: " + JSON.stringify(filename) + " });") +
						"})()"
				}, sessionId);
				// eslint-disable-next-line no-unused-vars
			} catch (error) {
				// evaluate raced a navigation, retry the injection
			}
			const navigated = await poll(async () => {
				const { result } = await cdp.Runtime.evaluate({ expression: "window.__editorOpenPending === undefined || undefined" }, sessionId).catch(() => ({ result: {} }));
				return result && result.value;
			}, 10000);
			if (navigated) {
				return;
			}
			console.log("editor.open injection not acknowledged, retrying (attempt " + (attempt + 1) + ")");
		}
		throw new Error("editor.open injection failed");
	}
	await openEditorArchive(fixtureBase64, "fixture.zip.html");

	const contexts = [];
	cdp.Runtime.addEventListener("executionContextCreated", event => {
		if (event.params.sessionId === undefined || event.params.sessionId == sessionId) {
			contexts.push(event.params.context);
		}
	});
	cdp.Runtime.addEventListener("executionContextDestroyed", event => {
		const { executionContextId, executionContextUniqueId } = event.params;
		const contextIndex = contexts.findIndex(context =>
			executionContextUniqueId !== undefined ? context.uniqueId == executionContextUniqueId : context.id == executionContextId);
		if (contextIndex != -1) {
			contexts.splice(contextIndex, 1);
		}
	});
	cdp.Runtime.addEventListener("executionContextsCleared", () => contexts.length = 0);
	if (process.env.SF_E2E_DEBUG) {
		cdp.Runtime.addEventListener("exceptionThrown", event => {
			const details = event.params.exceptionDetails;
			console.log("EXCEPTION:", details.text, details.exception && details.exception.description && details.exception.description.split("\n").slice(0, 4).join(" | "));
		});
	}
	await waitFor(async () => {
		const href = await evalInPage("location.href");
		return href && href.includes(EDITOR_PAGE_PATH) ? href : undefined;
	}, "editor page loaded");
	contexts.length = 0;
	await cdp.Runtime.disable(null, sessionId);
	await cdp.Runtime.enable(null, sessionId);
	const FRAME_PROBE = "window.parent != window && Boolean(globalThis.singlefile) || undefined";
	const frameSessions = [];
	cdp.Target.addEventListener("attachedToTarget", event => {
		if (event.params.targetInfo && event.params.targetInfo.type == "iframe") {
			frameSessions.push(event.params.sessionId);
		}
	});
	cdp.Target.addEventListener("detachedFromTarget", event => {
		const sessionIndex = frameSessions.indexOf(event.params.sessionId);
		if (sessionIndex != -1) {
			frameSessions.splice(sessionIndex, 1);
		}
	});
	await cdp.Target.setAutoAttach({ autoAttach: true, waitForDebuggerOnStart: false, flatten: true }, sessionId);
	await waitFor(() => resolveFrameHandle().then(() => "resolved").catch(() => undefined), "editor iframe context");

	async function resolveFrameHandle() {
		const candidates = frameSessions.slice().reverse().map(frameSessionId => ({ sessionId: frameSessionId }))
			.concat(contexts.slice().reverse().map(context => ({ sessionId, contextId: context.id })));
		for (const candidate of candidates) {
			try {
				const evaluateParams = candidate.contextId ? { expression: FRAME_PROBE, contextId: candidate.contextId } : { expression: FRAME_PROBE };
				const { result } = await cdp.Runtime.evaluate(evaluateParams, candidate.sessionId);
				if (result && result.value) {
					return candidate;
				}
				// eslint-disable-next-line no-unused-vars
			} catch (error) {
				// stale candidate, try the next one
			}
		}
		contexts.length = 0;
		await cdp.Runtime.disable(null, sessionId).catch(() => { });
		await cdp.Runtime.enable(null, sessionId).catch(() => { });
		await cdp.Target.setAutoAttach({ autoAttach: true, waitForDebuggerOnStart: false, flatten: true }, sessionId).catch(() => { });
		throw new Error("no editor iframe context");
	}

	await waitFor(() => evalInFrame("document.querySelectorAll(\"a[href$='index.html']\").length == 5 || undefined"), "TOC displayed with 5 page links");
	await assertEquals("initial route is the TOC", () => evalInPage("location.hash"), "#sfz/?toc");
	await assertEquals("archive cluster visible", () => evalInPage("document.querySelector('.archive-buttons').hidden"), false);
	await assertEquals("cluster label says TOC", () => evalInPage("document.querySelector('.archive-page-title').textContent"), "Table of contents");
	await assertEquals("save button stays visible", () => evalInPage("document.querySelector('.save-page-button').hidden"), false);
	await assertEquals("import button hidden", () => evalInPage("document.querySelector('.import-mht-button').hidden"), true);
	await assertEquals("edit tools hidden on the TOC", () => evalInPage("[...document.querySelectorAll('.edit-buttons')].every(element => element.hidden)"), true);
	await evalInPage("document.querySelector('.editor').contentWindow.postMessage(JSON.stringify({ method: 'addNote', color: 'note-yellow' }), '*')");
	await new Promise(resolve => setTimeout(resolve, 500));
	await assertEquals("addNote ignored on the TOC", () => evalInFrame("document.querySelectorAll('single-file-note').length"), 0);

	await evalInFrame("document.querySelector(\"a[href='pages/2/index.html']\").click()");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/2/' || undefined"), "route follows TOC click");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Alpha' || undefined"), "alpha page displayed");
	// the cluster is updated when the frame reports the displayed page, after the page itself is visible
	await waitFor(() => evalInPage("document.querySelector('.archive-page-title').textContent == 'Alpha page' || undefined"), "cluster shows page title");
	await waitFor(() => evalInPage("[...document.querySelectorAll('.edit-buttons')].every(element => !element.hidden) || undefined"), "edit tools visible on a page");

	await evalInFrame("document.body.dataset.testMarker = 'stashed'");
	await evalInFrame("document.querySelector(\"a[href^='http'][href$='beta.html']\").click()");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/3/' || undefined"), "in-page archived link navigates");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Beta' || undefined"), "beta page displayed");

	await evalInPage("history.back()");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/2/' || undefined"), "history back returns to alpha");
	await waitFor(() => evalInFrame("document.body.dataset.testMarker == 'stashed' || undefined"), "stashed page state restored");

	await evalInPage("history.back()");
	await waitFor(() => evalInPage("location.hash == '#sfz/?toc' || undefined"), "history back returns to TOC");
	await waitFor(() => evalInFrame("document.querySelectorAll(\"a[href$='index.html']\").length == 5 || undefined"), "TOC displayed again");

	await evalInPage("history.forward()");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/2/' || undefined"), "history forward returns to alpha");

	await evalInPage("document.querySelector('.archive-toc-button').dispatchEvent(new MouseEvent('mouseup'))");
	await waitFor(() => evalInPage("location.hash == '#sfz/?toc' || undefined"), "TOC button navigates to the TOC");

	await evalInFrame("document.querySelector(\"a[href='index.html']\").click()");
	await waitFor(() => evalInPage("location.hash == '#sfz/' || undefined"), "root page route");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Fixture home' || undefined"), "root page displayed");


	clearDownloadDir();
	await evalInPage("location.hash = '#sfz/pages/2/'");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Alpha' || undefined"), "alpha page displayed for editing");
	await evalInPage("document.querySelector('.add-note-yellow-button').dispatchEvent(new MouseEvent('mouseup'))");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note added to alpha");
	await evalInPage("location.hash = '#sfz/?toc'");
	await waitFor(() => evalInFrame("document.querySelectorAll('.sfz-modified-page').length == 1 || undefined"), "TOC shows one modified page");
	await evalInPage("document.querySelector('.save-page-button').dispatchEvent(new MouseEvent('mouseup'))");
	const savedFilePath = await waitForDownload("archive downloaded");
	await assertEquals("archive saved under its filename", () => basename(savedFilePath), "fixture.zip.html");
	await waitFor(() => evalInFrame("document.querySelectorAll('.sfz-modified-page').length == 0 || undefined"), "modified markers cleared after save");
	await verifySavedArchive(savedFilePath);
	const savedBase64 = readFileSync(savedFilePath).toString("base64");
	await openEditorArchive(savedBase64, "fixture-resaved.zip.html");
	await waitFor(() => evalInPage("location.hash == '#sfz/?toc' || undefined"), "re-saved archive reopens on the TOC");
	await waitFor(() => evalInFrame("document.querySelectorAll(\"a[href$='index.html']\").length == 5 || undefined"), "re-saved archive TOC lists 5 pages");
	await evalInPage("location.hash = '#sfz/pages/2/'");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note persisted in re-saved archive");

	await evalInPage("location.hash = '#sfz/pages/3/'");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Beta' || undefined"), "route set before deep-link reopen");
	await openEditorArchive(fixtureBase64, "fixture.zip.html");
	await waitFor(async () => {
		const title = await evalInFrame("document.title").catch(() => undefined);
		return title == "Beta page" || undefined;
	}, "deep-linked session loads");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/3/' || undefined"), "deep link opens the routed page");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Beta' || undefined"), "deep-linked page displayed");

	const singlePageBase64 = readFileSync(SINGLE_PAGE_FIXTURE_PATH).toString("base64");
	await openEditorArchive(singlePageBase64, "single.zip.html");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Alpha' || undefined"), "single-page archive displayed");
	await assertEquals("single-page: no archive route", () => evalInPage("location.hash"), "");
	await assertEquals("single-page: cluster hidden", () => evalInPage("document.querySelector('.archive-buttons').hidden"), true);
	await assertEquals("single-page: save button visible", () => evalInPage("document.querySelector('.save-page-button').hidden"), false);
	await assertEquals("single-page: edit tools visible", () => evalInPage("[...document.querySelectorAll('.edit-buttons')].every(element => !element.hidden)"), true);

	const dedupBase64 = readFileSync(DEDUP_FIXTURE_PATH).toString("base64");
	await openEditorArchive(dedupBase64, "multi-page-dedup.zip.html");
	await waitFor(() => evalInPage("location.hash == '#sfz/?toc' || undefined"), "dedup archive opens on the TOC");
	await evalInPage("location.hash = '#sfz/pages/2/'");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'One' || undefined; })()"), "dedup page displayed");
	await waitFor(() => evalInFrame("(() => { const image = document.querySelector('img.logo'); return image && image.naturalWidth == 64 || undefined; })()"), "deduplicated image resolved");
	await waitFor(() => evalInFrame("getComputedStyle(document.querySelector('h1')).borderBottomWidth == '2px' || undefined"), "deduplicated stylesheet applied");
	await evalInPage("document.querySelector('.add-note-yellow-button').dispatchEvent(new MouseEvent('mouseup'))");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note added to dedup page");
	clearDownloadDir();
	await evalInPage("document.querySelector('.save-page-button').dispatchEvent(new MouseEvent('mouseup'))");
	const savedDedupPath = await waitForDownload("dedup archive downloaded");
	await assertEquals("dedup archive saved under its filename", () => basename(savedDedupPath), "multi-page-dedup.zip.html");
	await verifySavedDedupArchive(savedDedupPath);
	const savedDedupBase64 = readFileSync(savedDedupPath).toString("base64");
	await openEditorArchive(savedDedupBase64, "multi-page-dedup-resaved.zip.html");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/2/' || undefined"), "re-saved dedup archive reopens on the carried route");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'One' || undefined; })()"), "re-saved dedup page displayed");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note persisted in re-saved dedup archive");
	await waitFor(() => evalInFrame("(() => { const image = document.querySelector('img.logo'); return image && image.naturalWidth == 64 || undefined; })()"), "deduplicated image resolves on the edited page after round-trip");
	await evalInPage("location.hash = '#sfz/pages/3/'");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'Two' || undefined; })()"), "re-saved dedup sibling page displayed");
	await waitFor(() => evalInFrame("(() => { const image = document.querySelector('img.logo'); return image && image.naturalWidth == 64 || undefined; })()"), "deduplicated image resolves after round-trip");

	const dropBase64 = readFileSync(SINGLE_PAGE_FIXTURE_PATH).toString("base64");
	await evalInFrame("window.__dropBase64 = \"\"");
	for (let offset = 0; offset < dropBase64.length; offset += 200000) {
		await evalInFrame("window.__dropBase64 += " + JSON.stringify(dropBase64.substring(offset, offset + 200000)));
	}
	await evalInFrame("(() => {" +
		"const bytes = Uint8Array.from(atob(window.__dropBase64), character => character.charCodeAt(0));" +
		"const file = new File([bytes], \"dropped-single.zip.html\", { type: \"text/html\" });" +
		"document.ondrop({ dataTransfer: { files: [file] }, preventDefault: () => { } });" +
		"})()");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'Alpha' || undefined; })()"), "dropped single-page archive displayed");
	await assertEquals("dropped single-page: cluster hidden", () => evalInPage("document.querySelector('.archive-buttons').hidden"), true);
	await assertEquals("dropped single-page: archive route cleared", () => evalInPage("location.hash"), "");
	await evalInPage(FILENAME_CAPTURE_SCRIPT);
	clearDownloadDir();
	await evalInPage("document.querySelector('.save-page-button').dispatchEvent(new MouseEvent('mouseup'))");
	const savedDropPath = await waitForDownload("dropped archive downloaded");
	await assertEquals("dropped archive saved under the dropped filename", () => evalInPage("window.__savedFilename"), "dropped-single.zip.html");
	await assertEquals("dropped archive on disk under the dropped filename", () => basename(savedDropPath), "dropped-single.zip.html");
	await verifySavedDroppedArchive(savedDropPath);

	await openEditorArchive(dedupBase64, "multi-page-dedup-2.zip.html");
	await waitFor(() => evalInPage("location.hash == '#sfz/?toc' || undefined"), "archive reopened before plain drop");
	await evalInFrame("(() => {" +
		"const file = new File([" + JSON.stringify(PLAIN_PAGE_CONTENT) + "], \"dropped-plain.html\", { type: \"text/html\" });" +
		"document.ondrop({ dataTransfer: { files: [file] }, preventDefault: () => { } });" +
		"})()");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'Gamma' || undefined; })()"), "dropped plain page displayed");
	await assertEquals("plain drop: cluster hidden", () => evalInPage("document.querySelector('.archive-buttons').hidden"), true);
	await assertEquals("plain drop: archive route cleared", () => evalInPage("location.hash"), "");
	await evalInPage(FILENAME_CAPTURE_SCRIPT);
	clearDownloadDir();
	await evalInPage("document.querySelector('.save-page-button').dispatchEvent(new MouseEvent('mouseup'))");
	const savedPlainPath = await waitForDownload("dropped plain page downloaded");
	await assertEquals("plain drop saved under the dropped filename", () => evalInPage("window.__savedFilename"), "dropped-plain.html");
	await assertEquals("plain drop on disk under the dropped filename", () => basename(savedPlainPath), "dropped-plain.html");
	const savedPlainContent = readFileSync(savedPlainPath).toString();
	await assertEquals("plain drop save is a plain page with the dropped content", async () => savedPlainContent.includes("Gamma") && !savedPlainContent.includes("data-sfz") && !savedPlainContent.includes("sfz-pages.json"), true);

	const digestBase64 = readFileSync(DIGEST_FIXTURE_PATH).toString("base64");
	await openEditorArchive(digestBase64, "classic-digest.html", false);
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'Delta' || undefined; })()"), "classic page with template data displayed");
	await evalInPage(FILENAME_CAPTURE_SCRIPT);
	clearDownloadDir();
	await evalInPage("document.querySelector('.save-page-button').dispatchEvent(new MouseEvent('mouseup'))");
	const savedDigestPath = await waitForDownload("classic page with template data downloaded");
	const savedDigestName = basename(savedDigestPath);
	const savedDigestHash = createHash("sha256").update(readFileSync(savedDigestPath)).digest("hex");
	await assertEquals("digest filename recomputed from the template data", () => /^Digest fixture_[0-9a-f]{64}\.html$/.test(savedDigestName), true);
	await assertEquals("filename digest matches the saved bytes", () => savedDigestName.includes(savedDigestHash), true);




	async function verifySavedDedupArchive(savedFilePath) {
		const zip = await import(ZIP_MODULE_URL);
		const originalData = new Uint8Array(readFileSync(DEDUP_FIXTURE_PATH));
		const savedData = new Uint8Array(readFileSync(savedFilePath));
		const savedReader = new zip.ZipReader(new zip.Uint8ArrayReader(savedData));
		const originalReader = new zip.ZipReader(new zip.Uint8ArrayReader(originalData));
		const savedEntries = await savedReader.getEntries();
		const originalEntries = await originalReader.getEntries();
		const getText = async (entries, filename) => {
			const entry = entries.find(entry => entry.filename == filename);
			return entry ? await entry.getData(new zip.TextWriter()) : undefined;
		};
		const savedManifest = JSON.parse(await getText(savedEntries, "sfz-pages.json"));
		const originalManifest = JSON.parse(await getText(originalEntries, "sfz-pages.json"));
		const sortedAliases = aliases => JSON.stringify(Object.entries(aliases || {}).sort());
		await assertEquals("dedup aliases preserved in the saved manifest", async () => sortedAliases(savedManifest.aliases), sortedAliases(originalManifest.aliases));
		const symlinkEntry = savedEntries.find(entry => entry.filename == "pages/3/images/1.png");
		await assertEquals("alias entry stays a symlink", async () => (symlinkEntry.externalFileAttributes >>> 16).toString(8), "120777");
		await assertEquals("symlink targets the canonical entry", async () => await getText(savedEntries, "pages/3/images/1.png"), "../../../images/1.png");
		const savedLogo = await savedEntries.find(entry => entry.filename == "images/1.png").getData(new zip.Uint8ArrayWriter());
		const originalLogo = await originalEntries.find(entry => entry.filename == "images/1.png").getData(new zip.Uint8ArrayWriter());
		await assertEquals("canonical image preserved byte for byte", async () => savedLogo.length == originalLogo.length && savedLogo.every((value, index) => value == originalLogo[index]), true);
		const editedPage = await getText(savedEntries, "pages/2/index.html");
		await assertEquals("edited dedup page contains the note", async () => editedPage.includes("single-file-note"), true);
		await savedReader.close();
		await originalReader.close();
	}

	async function verifySavedDroppedArchive(savedFilePath) {
		const zip = await import(ZIP_MODULE_URL);
		const savedData = new Uint8Array(readFileSync(savedFilePath));
		const prelude = new TextDecoder().decode(savedData.subarray(0, 200));
		await assertEquals("dropped archive save has an SFZ prelude", async () => /^<!DOCTYPE html>\s?<html data-sfz>/.test(prelude), true);
		const savedReader = new zip.ZipReader(new zip.Uint8ArrayReader(savedData));
		const savedEntries = await savedReader.getEntries();
		const savedNames = savedEntries.map(entry => entry.filename).sort();
		await assertEquals("dropped archive save contains only the dropped page entries", async () => JSON.stringify(savedNames), JSON.stringify(["index.html", "manifest.json"]));
		const indexContent = await savedEntries.find(entry => entry.filename == "index.html").getData(new zip.TextWriter());
		await assertEquals("dropped archive save contains the dropped page content", async () => indexContent.includes("Alpha"), true);
		await savedReader.close();
	}

	async function verifySavedArchive(savedFilePath) {
		const zip = await import(ZIP_MODULE_URL);
		const originalData = new Uint8Array(readFileSync(FIXTURE_PATH));
		const savedData = new Uint8Array(readFileSync(savedFilePath));
		const prelude = new TextDecoder().decode(savedData.subarray(0, 200));
		await assertEquals("saved archive has an SFZ prelude", async () => prelude.startsWith("<!DOCTYPE html><html data-sfz>"), true);
		const savedReader = new zip.ZipReader(new zip.Uint8ArrayReader(savedData));
		const originalReader = new zip.ZipReader(new zip.Uint8ArrayReader(originalData));
		const savedEntries = await savedReader.getEntries();
		const originalEntries = await originalReader.getEntries();
		const savedNames = savedEntries.map(entry => entry.filename).sort();
		const originalNames = originalEntries.map(entry => entry.filename).sort();
		await assertEquals("saved archive has the same entries", async () => JSON.stringify(savedNames), JSON.stringify(originalNames));
		const getText = async (entries, filename) => {
			const entry = entries.find(entry => entry.filename == filename);
			return entry ? await entry.getData(new zip.TextWriter()) : undefined;
		};
		const alphaContent = await getText(savedEntries, "pages/2/index.html");
		await assertEquals("edited page contains the note", async () => alphaContent.includes("single-file-note") && alphaContent.includes("Alpha"), true);
		const betaSaved = await getText(savedEntries, "pages/3/index.html");
		const betaOriginal = await getText(originalEntries, "pages/3/index.html");
		await assertEquals("untouched page preserved byte for byte", async () => betaSaved == betaOriginal, true);
		const manifest = JSON.parse(await getText(savedEntries, "sfz-pages.json"));
		await assertEquals("manifest still lists 5 pages", async () => manifest.pages.length, 5);
		await assertEquals("manifest keeps markUnarchivedLinks", async () => manifest.markUnarchivedLinks, true);
		await assertEquals("saved TOC present", async () => Boolean(await getText(savedEntries, "sfz-toc.html")), true);
		await savedReader.close();
		await originalReader.close();
	}

	async function evalInPage(expression) {
		const { result, exceptionDetails } = await cdp.Runtime.evaluate({ expression }, sessionId);
		if (exceptionDetails) {
			throw new Error(exceptionDetails.text + " " + JSON.stringify(exceptionDetails.exception));
		}
		return result.value;
	}

	async function evalInFrame(expression) {
		const handle = await resolveFrameHandle();
		const evaluateParams = handle.contextId ? { expression, contextId: handle.contextId } : { expression };
		const { result, exceptionDetails } = await cdp.Runtime.evaluate(evaluateParams, handle.sessionId);
		if (exceptionDetails) {
			throw new Error(exceptionDetails.text + " " + JSON.stringify(exceptionDetails.exception));
		}
		return result.value;
	}

	async function assertEquals(label, getValue, expected) {
		const value = await getValue();
		if (value === expected) {
			console.log("PASS", label);
		} else {
			failures++;
			console.log("FAIL", label, "expected", JSON.stringify(expected), "got", JSON.stringify(value));
		}
	}
}

async function poll(getValue, timeout) {
	const start = Date.now();
	while (Date.now() - start < timeout) {
		try {
			const value = await getValue();
			if (value !== undefined && value !== false) {
				return value;
			}
			// eslint-disable-next-line no-unused-vars
		} catch (error) {
			// transient error, keep polling
		}
		await new Promise(resolve => setTimeout(resolve, 250));
	}
	return undefined;
}

async function waitFor(getValue, label, timeout = 20000) {
	const start = Date.now();
	let lastError;
	while (Date.now() - start < timeout) {
		try {
			const value = await getValue();
			if (value !== undefined && value !== false) {
				console.log("PASS", label);
				return value;
			}
			 
		} catch (error) {
			lastError = error;
		}
		await new Promise(resolve => setTimeout(resolve, 250));
	}
	failures++;
	console.log("FAIL (timeout)", label, lastError ? String(lastError) : "");
	throw new Error("timeout: " + label);
}
