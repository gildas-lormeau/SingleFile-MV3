/* eslint-disable no-console */
/* global process, URL, setTimeout, TextDecoder */

import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { homedir, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { cdp, getTargets, options } from "simple-cdp";

const EXTENSION_PATH = process.env.SF_EXTENSION_PATH || resolve(new URL("..", import.meta.url).pathname);
const FIXTURES_PATH = new URL("../node_modules/single-file-core/test/fixtures/", import.meta.url).pathname;
const FIXTURE_PATH = process.env.SF_FIXTURE_PATH || join(FIXTURES_PATH, "multi-page.zip.html");
const SINGLE_PAGE_FIXTURE_PATH = process.env.SF_SINGLE_PAGE_FIXTURE_PATH || join(FIXTURES_PATH, "single-page.zip.html");
const DEDUP_FIXTURE_PATH = process.env.SF_DEDUP_FIXTURE_PATH || join(FIXTURES_PATH, "multi-page-dedup.zip.html");
const ZIP_MODULE_URL = new URL("../node_modules/single-file-core/vendor/zip/zip.js", import.meta.url).href;
const CHROME_PATH = findChrome();
const DEBUG_PORT = Number(process.env.SF_E2E_PORT) || 19000 + (process.pid % 2000);
const EDITOR_PAGE_PATH = "/src/ui/pages/editor.html";
const SENDER_PAGE_PATH = "/src/ui/pages/pendings.html";

options.apiUrl = "http://127.0.0.1:" + DEBUG_PORT;

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
const chromeProcess = spawn(CHROME_PATH, [
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
], { stdio: "ignore" });

try {
	await run();
} catch (error) {
	failures++;
	console.error("FATAL", error);
} finally {
	chromeProcess.kill();
	await new Promise(resolve => chromeProcess.on("exit", resolve));
	rmSync(userDataDir, { recursive: true, force: true });
}
console.log(failures ? "FAILED (" + failures + ")" : "PASSED");
process.exit(failures ? 1 : 0);

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
	const { result: sendResult } = await cdp.Runtime.evaluate({
		expression: `(async () => {
			try {
				const bytes = Uint8Array.from(atob("${fixtureBase64}"), character => character.charCodeAt(0));
				const response = await chrome.runtime.sendMessage({
					method: "editor.open",
					content: Array.from(bytes),
					compressContent: true,
					selfExtractingArchive: true,
					filename: "fixture.zip.html"
				});
				return "sent " + JSON.stringify(response);
			} catch (error) {
				return "error " + error.message;
			}
		})()`,
		awaitPromise: true
	}, sessionId).catch(error => ({ result: { value: "evaluate failed (navigation?) " + error.message } }));
	console.log("editor.open:", sendResult && sendResult.value);

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

	await evalInFrame("document.querySelector(\"a[href='pages/2/index.html']\").click()");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/2/' || undefined"), "route follows TOC click");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Alpha' || undefined"), "alpha page displayed");
	await assertEquals("cluster shows page title", () => evalInPage("document.querySelector('.archive-page-title').textContent"), "Alpha page");

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


	const downloadDir = mkdtempSync(join(tmpdir(), "sf-editor-dl-"));
	await cdp.Browser.setDownloadBehavior({ behavior: "allow", downloadPath: downloadDir });
	await evalInPage("location.hash = '#sfz/pages/2/'");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Alpha' || undefined"), "alpha page displayed for editing");
	await evalInPage("document.querySelector('.add-note-yellow-button').dispatchEvent(new MouseEvent('mouseup'))");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note added to alpha");
	await evalInPage("location.hash = '#sfz/?toc'");
	await waitFor(() => evalInFrame("document.querySelectorAll('.sfz-modified-page').length == 1 || undefined"), "TOC shows one modified page");
	await evalInPage("document.querySelector('.save-page-button').dispatchEvent(new MouseEvent('mouseup'))");
	const savedFilePath = await waitFor(async () => {
		const filenames = readdirSync(downloadDir).filter(filename => !filename.endsWith(".crdownload") && !filename.startsWith("."));
		return filenames.length ? join(downloadDir, filenames[0]) : undefined;
	}, "archive downloaded");
	console.log("saved file:", savedFilePath);
	await waitFor(() => evalInFrame("document.querySelectorAll('.sfz-modified-page').length == 0 || undefined"), "modified markers cleared after save");
	await verifySavedArchive(savedFilePath);
	const savedBase64 = readFileSync(savedFilePath).toString("base64");
	rmSync(downloadDir, { recursive: true, force: true });
	await cdp.Runtime.evaluate({
		expression: "const savedBytes = Uint8Array.from(atob(\"" + savedBase64 + "\"), character => character.charCodeAt(0));" +
			"chrome.runtime.sendMessage({ method: \"editor.open\", content: Array.from(savedBytes), compressContent: true, selfExtractingArchive: true, filename: \"fixture-resaved.zip.html\" });"
	}, sessionId).catch(() => {});
	await waitFor(() => evalInPage("location.hash == '#sfz/?toc' || undefined"), "re-saved archive reopens on the TOC");
	await waitFor(() => evalInFrame("document.querySelectorAll(\"a[href$='index.html']\").length == 5 || undefined"), "re-saved archive TOC lists 5 pages");
	await evalInPage("location.hash = '#sfz/pages/2/'");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note persisted in re-saved archive");

	await evalInPage("location.hash = '#sfz/pages/3/'");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Beta' || undefined"), "route set before deep-link reopen");
	await cdp.Runtime.evaluate({
		expression: "const deepLinkBytes = Uint8Array.from(atob(\"" + fixtureBase64 + "\"), character => character.charCodeAt(0));" +
			"chrome.runtime.sendMessage({ method: \"editor.open\", content: Array.from(deepLinkBytes), compressContent: true, selfExtractingArchive: true, filename: \"fixture.zip.html\" });"
	}, sessionId).catch(() => {});
	await waitFor(async () => {
		const title = await evalInFrame("document.title").catch(() => undefined);
		return title == "Beta page" || undefined;
	}, "deep-linked session loads");
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/3/' || undefined"), "deep link opens the routed page");
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Beta' || undefined"), "deep-linked page displayed");

	const singlePageBase64 = readFileSync(SINGLE_PAGE_FIXTURE_PATH).toString("base64");
	await cdp.Runtime.evaluate({
		expression: `
			const singlePageBytes = Uint8Array.from(atob("${singlePageBase64}"), character => character.charCodeAt(0));
			chrome.runtime.sendMessage({
				method: "editor.open",
				content: Array.from(singlePageBytes),
				compressContent: true,
				selfExtractingArchive: true,
				filename: "single.zip.html"
			});`
	}, sessionId).catch(() => {});
	await waitFor(() => evalInFrame("document.querySelector('h1') && document.querySelector('h1').textContent == 'Alpha' || undefined"), "single-page archive displayed");
	await assertEquals("single-page: no archive route", () => evalInPage("location.hash"), "");
	await assertEquals("single-page: cluster hidden", () => evalInPage("document.querySelector('.archive-buttons').hidden"), true);
	await assertEquals("single-page: save button visible", () => evalInPage("document.querySelector('.save-page-button').hidden"), false);

	const dedupBase64 = readFileSync(DEDUP_FIXTURE_PATH).toString("base64");
	await cdp.Runtime.evaluate({
		expression: "const dedupBytes = Uint8Array.from(atob(\"" + dedupBase64 + "\"), character => character.charCodeAt(0));" +
			"chrome.runtime.sendMessage({ method: \"editor.open\", content: Array.from(dedupBytes), compressContent: true, selfExtractingArchive: true, filename: \"multi-page-dedup.zip.html\" });"
	}, sessionId).catch(() => {});
	await waitFor(() => evalInPage("location.hash == '#sfz/?toc' || undefined"), "dedup archive opens on the TOC");
	await evalInPage("location.hash = '#sfz/pages/2/'");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'One' || undefined; })()"), "dedup page displayed");
	await waitFor(() => evalInFrame("(() => { const image = document.querySelector('img.logo'); return image && image.naturalWidth == 64 || undefined; })()"), "deduplicated image resolved");
	await waitFor(() => evalInFrame("getComputedStyle(document.querySelector('h1')).borderBottomWidth == '2px' || undefined"), "deduplicated stylesheet applied");
	await evalInPage("document.querySelector('.add-note-yellow-button').dispatchEvent(new MouseEvent('mouseup'))");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note added to dedup page");
	const dedupDownloadDir = mkdtempSync(join(tmpdir(), "sf-editor-dl-"));
	await cdp.Browser.setDownloadBehavior({ behavior: "allow", downloadPath: dedupDownloadDir });
	await evalInPage("document.querySelector('.save-page-button').dispatchEvent(new MouseEvent('mouseup'))");
	const savedDedupPath = await waitFor(async () => {
		const filenames = readdirSync(dedupDownloadDir).filter(filename => !filename.endsWith(".crdownload") && !filename.startsWith("."));
		return filenames.length ? join(dedupDownloadDir, filenames[0]) : undefined;
	}, "dedup archive downloaded");
	await verifySavedDedupArchive(savedDedupPath);
	const savedDedupBase64 = readFileSync(savedDedupPath).toString("base64");
	rmSync(dedupDownloadDir, { recursive: true, force: true });
	await cdp.Runtime.evaluate({
		expression: "const resavedDedupBytes = Uint8Array.from(atob(\"" + savedDedupBase64 + "\"), character => character.charCodeAt(0));" +
			"chrome.runtime.sendMessage({ method: \"editor.open\", content: Array.from(resavedDedupBytes), compressContent: true, selfExtractingArchive: true, filename: \"multi-page-dedup-resaved.zip.html\" });"
	}, sessionId).catch(() => {});
	await waitFor(() => evalInPage("location.hash == '#sfz/pages/2/' || undefined"), "re-saved dedup archive reopens on the carried route");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'One' || undefined; })()"), "re-saved dedup page displayed");
	await waitFor(() => evalInFrame("Boolean(document.querySelector('single-file-note')) || undefined"), "note persisted in re-saved dedup archive");
	await waitFor(() => evalInFrame("(() => { const image = document.querySelector('img.logo'); return image && image.naturalWidth == 64 || undefined; })()"), "deduplicated image resolves on the edited page after round-trip");
	await evalInPage("location.hash = '#sfz/pages/3/'");
	await waitFor(() => evalInFrame("(() => { const heading = document.querySelector('h1'); return heading && heading.textContent == 'Two' || undefined; })()"), "re-saved dedup sibling page displayed");
	await waitFor(() => evalInFrame("(() => { const image = document.querySelector('img.logo'); return image && image.naturalWidth == 64 || undefined; })()"), "deduplicated image resolves after round-trip");




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
