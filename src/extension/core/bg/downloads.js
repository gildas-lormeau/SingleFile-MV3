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

/* global browser, Blob */

import * as config from "./config.js";
import * as bookmarks from "./bookmarks.js";
import * as companion from "./companion.js";
import * as business from "./business.js";
import * as editor from "./editor.js";
import { launchWebAuthFlow, extractAuthCode, promptValue } from "./tabs-util.js";
import * as ui from "./../../ui/bg/index.js";
import * as woleet from "./../../lib/woleet/woleet.js";
import { GDrive } from "./../../lib/gdrive/gdrive.js";
import { pushGitHub } from "./../../lib/github/github.js";
import { download } from "./download-util.js";

const partialContents = new Map();
const MIMETYPE_HTML = "text/html";
const CLIENT_ID = "207618107333-3pj2pmelhnl4sf3rpctghs9cean3q8nj.apps.googleusercontent.com";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
const CONFLICT_ACTION_SKIP = "skip";
const CONFLICT_ACTION_UNIQUIFY = "uniquify";
const REGEXP_ESCAPE = /([{}()^$&.*?/+|[\\\\]|\]|-)/g;

const manifest = browser.runtime.getManifest();
const requestPermissionIdentity = manifest.optional_permissions && manifest.optional_permissions.includes("identity");
const gDrive = new GDrive(CLIENT_ID, SCOPES);
export {
	onMessage,
	downloadPage,
	saveToGDrive,
	saveToGitHub
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
	let contents;
	if (message.truncated) {
		contents = partialContents.get(tab.id);
		if (!contents) {
			contents = [];
			partialContents.set(tab.id, contents);
		}
		contents.push(message.content);
		if (message.finished) {
			partialContents.delete(tab.id);
		}
	} else if (message.content) {
		contents = [message.content];
	}
	if (!message.truncated || message.finished) {
		if (message.openEditor) {
			ui.onEdit(tab.id);
			await editor.open({ tabIndex: tab.index + 1, filename: message.filename, content: contents.join("") });
		} else {
			if (message.saveToClipboard) {
				ui.onEnd(tab.id);
			} else {
				await downloadContent(contents, tab, tab.incognito, message);
			}
		}
	}
	return {};
}

async function downloadContent(contents, tab, incognito, message) {
	try {
		if (message.saveToGDrive) {
			await (await saveToGDrive(message.taskId, message.filename, new Blob(contents, { type: MIMETYPE_HTML }), {
				forceWebAuthFlow: message.forceWebAuthFlow,
				extractAuthCode: message.extractAuthCode
			}, {
				onProgress: (offset, size) => ui.onUploadProgress(tab.id, offset, size)
			})).uploadPromise;
		} else if (message.saveToGitHub) {
			await (await saveToGitHub(message.taskId, message.filename, contents.join(""), message.githubToken, message.githubUser, message.githubRepository, message.githubBranch)).pushPromise;
		} else if (message.saveWithCompanion) {
			await companion.save({
				filename: message.filename,
				content: message.content,
				filenameConflictAction: message.filenameConflictAction
			});
		} else {
			message.url = "data:text/html," + encodeURIComponent(contents.join(""));
			await downloadPage(message, {
				confirmFilename: message.confirmFilename,
				incognito,
				filenameConflictAction: message.filenameConflictAction,
				filenameReplacementCharacter: message.filenameReplacementCharacter,
				includeInfobar: message.includeInfobar
			});
		}
		ui.onEnd(tab.id);
		if (message.openSavedPage) {
			const createTabProperties = { active: true, url: "data:text/html," + encodeURIComponent(contents.join("")) };
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

function getRegExp(string) {
	return string.replace(REGEXP_ESCAPE, "\\$1");
}

async function getAuthInfo(authOptions, force) {
	let authInfo = await config.getAuthInfo();
	const options = {
		interactive: true,
		auto: authOptions.extractAuthCode,
		forceWebAuthFlow: authOptions.forceWebAuthFlow,
		requestPermissionIdentity,
		launchWebAuthFlow: options => launchWebAuthFlow(options),
		extractAuthCode: authURL => extractAuthCode(authURL),
		promptAuthCode: () => promptValue("Please enter the access code for Google Drive")
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

async function saveToGitHub(taskId, filename, content, githubToken, githubUser, githubRepository, githubBranch) {
	const taskInfo = business.getTaskInfo(taskId);
	if (!taskInfo || !taskInfo.cancelled) {
		const pushInfo = pushGitHub(githubToken, githubUser, githubRepository, githubBranch, filename, content);
		business.setCancelCallback(taskId, pushInfo.cancelPush);
		try {
			await (await pushInfo).pushPromise;
			return pushInfo;
		} catch (error) {
			throw new Error(error.message + " (GitHub)");
		}
	}
}

async function saveToGDrive(taskId, filename, blob, authOptions, uploadOptions) {
	try {
		await getAuthInfo(authOptions);
		const taskInfo = business.getTaskInfo(taskId);
		if (!taskInfo || !taskInfo.cancelled) {
			const uploadInfo = await gDrive.upload(filename, blob, uploadOptions);
			business.setCancelCallback(taskId, uploadInfo.cancelUpload);
			return uploadInfo;
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
			await saveToGDrive(taskId, filename, blob, authOptions, uploadOptions);
		} else {
			throw new Error(error.message + " (Google Drive)");
		}
	}
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
		if (downloadData.filename && pageData.bookmarkId && pageData.replaceBookmarkURL) {
			if (!downloadData.filename.startsWith("file:")) {
				if (downloadData.filename.startsWith("/")) {
					downloadData.filename = downloadData.filename.substring(1);
				}
				downloadData.filename = "file:///" + downloadData.filename.replace(/#/g, "%23");
			}
			await bookmarks.update(pageData.bookmarkId, { url: downloadData.filename });
		}
	}
}