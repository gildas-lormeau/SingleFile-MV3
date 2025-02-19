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

/* global browser, TextEncoder */

import * as yabson from "./../../lib/yabson/yabson.js";

const OFFSCREEN_DOCUMENT_URL = "/src/ui/pages/offscreen-document.html";
const MAX_CONTENT_SIZE = 16 * (1024 * 1024);

let creating, requestId = 0;

export {
	compressPage,
	processPage,
	getBlobURL,
	revokeObjectURL,
	getImageData,
	saveToClipboard
};

async function compressPage(pageData, options) {
	await createOffscreenDocument();
	const serializer = yabson.getSerializer(pageData);
	for await (const chunk of serializer) {
		await browser.runtime.sendMessage({
			method: "compressPage",
			tabId: options.tabId,
			data: Array.from(chunk)
		});
	}
	return browser.runtime.sendMessage({
		method: "compressPage",
		tabId: options.tabId,
		options
	});
}

async function processPage(options) {
	await createOffscreenDocument();
	return browser.runtime.sendMessage({ method: "processPage", options });
}

async function revokeObjectURL(url) {
	await createOffscreenDocument();
	return browser.runtime.sendMessage({ method: "revokeObjectURL", url });
}

async function getBlobURL(data, mimeType) {
	await createOffscreenDocument();
	return sendMessageData({ method: "getBlobURL", mimeType, requestId }, data);
}

async function getImageData(url, width, height) {
	await createOffscreenDocument();
	return browser.runtime.sendMessage({ method: "getImageData", url, width, height });
}

async function saveToClipboard(content, mimeType) {
	await createOffscreenDocument();
	return sendMessageData({ method: "saveToClipboard", mimeType, requestId }, Array.from(new TextEncoder().encode(content)));
}

async function createOffscreenDocument() {
	const offscreenUrl = browser.runtime.getURL(OFFSCREEN_DOCUMENT_URL);
	const existingContexts = await browser.runtime.getContexts({
		contextTypes: ["OFFSCREEN_DOCUMENT"],
		documentUrls: [offscreenUrl]
	});
	if (existingContexts.length > 0) {
		return;
	}

	if (creating) {
		await creating;
	} else {
		creating = await browser.offscreen.createDocument({ url: OFFSCREEN_DOCUMENT_URL, justification: "Auto-save/Compression features", reasons: ["DOM_PARSER", "WORKERS", "CLIPBOARD", "BLOBS"] });
		creating = null;
	}
}

async function sendMessageData(message, data) {
	let result;
	requestId++;
	for (let blockIndex = 0; blockIndex * MAX_CONTENT_SIZE < data.length; blockIndex++) {
		message.truncated = data.length > MAX_CONTENT_SIZE;
		if (message.truncated) {
			message.finished = (blockIndex + 1) * MAX_CONTENT_SIZE > data.length;
			message.data = data.slice(blockIndex * MAX_CONTENT_SIZE, (blockIndex + 1) * MAX_CONTENT_SIZE);
		} else {
			message.data = data;
		}
		result = await browser.runtime.sendMessage(message);
	}
	return result;
}