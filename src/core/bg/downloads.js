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

/* global browser, fetch */

import * as config from "./config.js";
import * as bookmarks from "./bookmarks.js";
import * as companion from "./companion.js";
import * as business from "./business.js";
import * as editor from "./editor.js";
import { launchWebAuthFlow, extractAuthCode } from "./tabs-util.js";
import * as ui from "./../../ui/bg/index.js";
import * as woleet from "./../../lib/woleet/woleet.js";
import { GDrive } from "./../../lib/gdrive/gdrive.js";
import { WebDAV } from "./../../lib/webdav/webdav.js";
import { GitHub } from "./../../lib/github/github.js";
import { download } from "./download-util.js";

const GDRIVE_CLIENT_ID = "207618107333-7tjs1im1pighftpoepea2kvkubnfjj44.apps.googleusercontent.com";
const GDRIVE_CLIENT_KEY = "VQJ8Gq8Vxx72QyxPyeLtWvUt";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const CONFLICT_ACTION_SKIP = "skip";
const CONFLICT_ACTION_UNIQUIFY = "uniquify";
const REGEXP_ESCAPE = /([{}()^$&.*?/+|[\\\\]|\]|-)/g;

const gDrive = new GDrive(GDRIVE_CLIENT_ID, GDRIVE_CLIENT_KEY, SCOPES);
export {
	onMessage,
	downloadPage,
	saveToGDrive,
	saveToGitHub,
	saveWithWebDAV,
	encodeSharpCharacter
};

async function onMessage(message, sender) {
	if (message.method.endsWith(".download")) {
		return downloadTabPage(message, sender.tab);
	}
	if (message.method.endsWith(".disableGDrive")) {
		const authInfo = await config.getAuthInfo();
		config.removeAuthInfo();
		await gDrive.revokeAuthToken(authInfo && (authInfo.accessToken || authInfo.revokableAccessToken));
		return {};
	}
	if (message.method.endsWith(".end")) {
		if (message.hash) {
			try {
				await woleet.anchor(message.hash, message.woleetKey);
			} catch (error) {
				ui.onError(sender.tab.id, error.message, error.link);
			}
		}
		business.onSaveEnd(message.taskId);
		return {};
	}
	if (message.method.endsWith(".getInfo")) {
		return business.getTasksInfo();
	}
	if (message.method.endsWith(".cancel")) {
		business.cancelTask(message.taskId);
		return {};
	}
	if (message.method.endsWith(".cancelAll")) {
		business.cancelAllTasks();
		return {};
	}
	if (message.method.endsWith(".saveUrls")) {
		business.saveUrls(message.urls);
		return {};
	}
}

async function downloadTabPage(message, tab) {
	if (message.openEditor) {
		ui.onEdit(tab.id);
		await editor.open({ tabIndex: tab.index + 1, filename: message.filename, content: await (await fetch(message.content)).text() });
	} else {
		if (message.saveToClipboard) {
			ui.onEnd(tab.id);
		} else {
			await downloadContent(tab, tab.incognito, message);
		}
	}
	return {};
}

async function downloadContent(tab, incognito, message) {
	try {
		const prompt = filename => promptFilename(tab.id, filename);
		let response;
		if (message.saveWithWebDAV) {
			const pageContent = await (await fetch(message.content)).text();
			response = await saveWithWebDAV(message.taskId, encodeSharpCharacter(message.filename), pageContent, message.webDAVURL, message.webDAVUser, message.webDAVPassword, { filenameConflictAction: message.filenameConflictAction, prompt });
		} else if (message.saveToGDrive) {
			const pageBlob = await (await fetch(message.content)).blob();
			await saveToGDrive(message.taskId, encodeSharpCharacter(message.filename), pageBlob, {
				forceWebAuthFlow: message.forceWebAuthFlow
			}, {
				onProgress: (offset, size) => ui.onUploadProgress(tab.id, offset, size),
				filenameConflictAction: message.filenameConflictAction,
				prompt
			});
		} else if (message.saveToGitHub) {
			const pageContent = await (await fetch(message.content)).text();
			response = await saveToGitHub(message.taskId, encodeSharpCharacter(message.filename), pageContent, message.githubToken, message.githubUser, message.githubRepository, message.githubBranch, {
				filenameConflictAction: message.filenameConflictAction,
				prompt
			});
			await response.pushPromise;
		} else if (message.saveWithCompanion) {
			await companion.save({
				filename: message.filename,
				content: message.content,
				filenameConflictAction: message.filenameConflictAction
			});
		} else {
			message.url = message.content;
			response = await downloadPage(message, {
				confirmFilename: message.confirmFilename,
				incognito,
				filenameConflictAction: message.filenameConflictAction,
				filenameReplacementCharacter: message.filenameReplacementCharacter,
				includeInfobar: message.includeInfobar
			});
		}
		if (message.replaceBookmarkURL && response && response.url) {
			await bookmarks.update(message.bookmarkId, { url: response.url });
		}
		ui.onEnd(tab.id);
		if (message.openSavedPage) {
			const createTabProperties = { active: true, url: message.content };
			if (tab.index != null) {
				createTabProperties.index = tab.index + 1;
			}
			browser.tabs.create(createTabProperties);
		}
	} catch (error) {
		if (!error.message || error.message != "upload_cancelled") {
			console.error(error); // eslint-disable-line no-console
			ui.onError(tab.id, error.message, error.link);
		}
	}
}

function encodeSharpCharacter(path) {
	return path.replace(/#/g, "%23");
}

function getRegExp(string) {
	return string.replace(REGEXP_ESCAPE, "\\$1");
}

async function getAuthInfo(authOptions, force) {
	let authInfo = await config.getAuthInfo();
	const options = {
		interactive: true,
		forceWebAuthFlow: authOptions.forceWebAuthFlow,
		launchWebAuthFlow: options => launchWebAuthFlow(options),
		extractAuthCode: authURL => extractAuthCode(authURL)
	};
	gDrive.setAuthInfo(authInfo, options);
	if (!authInfo || !authInfo.accessToken || force) {
		authInfo = await gDrive.auth(options);
		if (authInfo) {
			await config.setAuthInfo(authInfo);
		} else {
			await config.removeAuthInfo();
		}
	}
	return authInfo;
}

async function saveToGitHub(taskId, filename, content, githubToken, githubUser, githubRepository, githubBranch, { filenameConflictAction, prompt }) {
	try {
		const taskInfo = business.getTaskInfo(taskId);
		if (!taskInfo || !taskInfo.cancelled) {
			const client = new GitHub(githubToken, githubUser, githubRepository, githubBranch);
			business.setCancelCallback(taskId, () => client.abort());
			return await client.upload(filename, content, { filenameConflictAction, prompt });
		}
	} catch (error) {
		throw new Error(error.message + " (GitHub)");
	}
}

async function saveWithWebDAV(taskId, filename, content, url, username, password, { filenameConflictAction, prompt }) {
	try {
		const taskInfo = business.getTaskInfo(taskId);
		if (!taskInfo || !taskInfo.cancelled) {
			const client = new WebDAV(url, username, password);
			business.setCancelCallback(taskId, () => client.abort());
			return await client.upload(filename, content, { filenameConflictAction, prompt });
		}
	} catch (error) {
		throw new Error(error.message + " (WebDAV)");
	}
}

async function saveToGDrive(taskId, filename, blob, authOptions, uploadOptions) {
	try {
		await getAuthInfo(authOptions);
		const taskInfo = business.getTaskInfo(taskId);
		if (!taskInfo || !taskInfo.cancelled) {
			return await gDrive.upload(filename, blob, uploadOptions, callback => business.setCancelCallback(taskId, callback));
		}
	}
	catch (error) {
		if (error.message == "invalid_token") {
			let authInfo;
			try {
				authInfo = await gDrive.refreshAuthToken();
			} catch (error) {
				if (error.message == "unknown_token") {
					authInfo = await getAuthInfo(authOptions, true);
				} else {
					throw new Error(error.message + " (Google Drive)");
				}
			}
			if (authInfo) {
				await config.setAuthInfo(authInfo);
			} else {
				await config.removeAuthInfo();
			}
			return await saveToGDrive(taskId, filename, blob, authOptions, uploadOptions);
		} else {
			throw new Error(error.message + " (Google Drive)");
		}
	}
}

function promptFilename(tabId, filename) {
	return browser.tabs.sendMessage(tabId, { method: "content.prompt", message: "Filename conflict, please enter a new filename", value: filename });
}

async function downloadPage(pageData, options) {
	const filenameConflictAction = options.filenameConflictAction;
	let skipped;
	if (filenameConflictAction == CONFLICT_ACTION_SKIP) {
		const downloadItems = await browser.downloads.search({
			filenameRegex: "(\\\\|/)" + getRegExp(pageData.filename) + "$",
			exists: true
		});
		if (downloadItems.length) {
			skipped = true;
		} else {
			options.filenameConflictAction = CONFLICT_ACTION_UNIQUIFY;
		}
	}
	if (!skipped) {
		const downloadInfo = {
			url: pageData.url,
			saveAs: options.confirmFilename,
			filename: pageData.filename,
			conflictAction: options.filenameConflictAction
		};
		if (options.incognito) {
			downloadInfo.incognito = true;
		}
		const downloadData = await download(downloadInfo, options.filenameReplacementCharacter);
		if (downloadData.filename) {
			let url = downloadData.filename;
			if (!url.startsWith("file:")) {
				if (url.startsWith("/")) {
					url = downloadData.filename.substring(1);
				}
				url = "file:///" + encodeSharpCharacter(url);
			}
			return { url };
		}
	}
}