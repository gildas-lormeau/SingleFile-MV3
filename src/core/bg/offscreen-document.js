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

/* global browser, Blob, URL, XMLHttpRequest, Image, document, TextDecoder */

import "./../../../lib/chrome-browser-polyfill.js";
import * as yabson from "./../../lib/yabson/yabson.js";

const singlefile = globalThis.singlefile;
const parsers = new Map(), pendingData = new Map();

browser.runtime.onMessage.addListener(async ({ method, truncated, finished, requestId, url, data, mimeType, options, width, height, tabId }) => {
	if (method == "processPage") {
		const result = await singlefile.getPageData(options, { fetch }, null, null);
		const blob = new Blob([typeof result.content == "string" ? result.content : new Uint8Array(result.content)], { type: result.mimeType });
		return {
			url: URL.createObjectURL(blob),
			archiveTime: result.archiveTime,
			doctype: result.doctype,
			filename: result.filename,
			title: result.title
		};
	}
	if (method == "compressPage") {
		let parser = parsers.get(tabId);
		if (!parser) {
			parser = yabson.getParser();
			parsers.set(tabId, parser);
		}
		if (data) {
			await parser.next(new Uint8Array(data));
			return {};
		} else {
			const result = await parser.next();
			parsers.delete(tabId);
			const pageData = result.value;
			const blob = await singlefile.processors.compression.process(pageData, options);
			return URL.createObjectURL(blob);
		}
	}
	if (method == "getBlobURL") {
		const options = {};
		if (mimeType) {
			options.type = mimeType;
		}
		const dataArray = handleDataRequest({ requestId, truncated, finished, data });
		if (dataArray) {
			return URL.createObjectURL(new Blob(dataArray, options));
		} else {
			return {};
		}
	}
	if (method == "revokeObjectURL") {
		URL.revokeObjectURL(url);
		return {};
	}
	if (method == "getImageData") {
		const image = new Image();
		await new Promise((resolve, reject) => {
			image.onload = resolve;
			image.onerror = event => reject(new Error(event.detail));
			image.src = url;
		});
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext("2d");
		context.drawImage(image, 0, 0, width, height);
		const { data } = await context.getImageData(0, 0, width, height);
		return {
			url: URL.createObjectURL(new Blob([data]))
		};
	}
	if (method == "saveToClipboard") {
		const dataArray = handleDataRequest({ requestId, truncated, finished, data });
		if (dataArray) {
			const data = new Uint8Array(dataArray.map(data => data.length).reduce((total, length) => total + length));
			for (let i = 0, offset = 0; i < dataArray.length; i++) {
				data.set(dataArray[i], offset);
				offset += dataArray[i].length;
			}
			saveToClipboard({ content: new TextDecoder().decode(data), mimeType });
		}
		return {};
	}
});

function saveToClipboard(pageData) {
	const command = "copy";
	document.addEventListener(command, listener);
	document.execCommand(command);
	document.removeEventListener(command, listener);

	function listener(event) {
		event.clipboardData.setData(pageData.mimeType, pageData.content);
		event.clipboardData.setData("text/plain", pageData.content);
		event.preventDefault();
	}
}

function fetch(url, options = {}) {
	return new Promise((resolve, reject) => {
		const xhrRequest = new XMLHttpRequest();
		xhrRequest.withCredentials = true;
		xhrRequest.responseType = "arraybuffer";
		xhrRequest.onerror = event => reject(new Error(event.detail));
		xhrRequest.onreadystatechange = () => {
			if (xhrRequest.readyState == XMLHttpRequest.DONE) {
				resolve({
					status: xhrRequest.status,
					headers: {
						get: name => xhrRequest.getResponseHeader(name)
					},
					arrayBuffer: async () => xhrRequest.response
				});
			}
		};
		xhrRequest.open("GET", url, true);
		if (options.headers) {
			for (const entry of Object.entries(options.headers)) {
				xhrRequest.setRequestHeader(entry[0], entry[1]);
			}
		}
		xhrRequest.send();
	});
}

function handleDataRequest({ requestId, truncated, finished, data }) {
	let dataArray;
	if (truncated) {
		dataArray = pendingData.get(requestId);
		if (!dataArray) {
			dataArray = [];
			pendingData.set(requestId, dataArray);
		}
		dataArray.push(new Uint8Array(data));
		if (finished) {
			pendingData.delete(requestId);
		}
	} else if (data) {
		dataArray = [new Uint8Array(data)];
	}
	if (!truncated || finished) {
		return dataArray;
	}
}