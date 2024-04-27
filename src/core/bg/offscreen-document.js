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

/* global browser, Blob, URL, XMLHttpRequest, Image, document */

import { getPageData, compress } from "./../../index.js";
import * as yabson from "./../../lib/yabson/yabson.js";

browser.runtime.onMessage.addListener(async ({ method, pageData, url, data, options, width, height }) => {
	if (method == "processPage") {
		const result = await getPageData(options, null, null, { fetch });
		const blob = new Blob([typeof result.content == "string" ? result.content : new Uint8Array(result.content)], { type: pageData.mimeType });
		return {
			url: URL.createObjectURL(blob),
			archiveTime: result.archiveTime,
			doctype: result.doctype,
			filename: result.filename,
			title: result.title
		};
	}
	if (method == "compressPage") {
		const blob = await compress(await yabson.parse(pageData), options);
		return {
			url: URL.createObjectURL(blob)
		};
	}
	if (method == "getBlobURL") {
		return {
			url: URL.createObjectURL(new Blob([new Uint8Array(data)]))
		};
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
});

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