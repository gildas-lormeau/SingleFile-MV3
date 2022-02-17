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

const MAX_CONTENT_SIZE = 8 * (1024 * 1024);

browser.runtime.onMessage.addListener((message, sender) => {
	if (message.method && message.method.startsWith("singlefile.fetch")) {
		return new Promise(resolve => {
			onRequest(message, sender)
				.then(resolve)
				.catch(error => resolve({ error: error && error.toString() }));
		});
	}
});

async function onRequest(message, sender) {
	if (message.method == "singlefile.fetch") {
		try {
			const response = await fetchResource(message.url, { headers: message.headers });
			return sendResponse(sender.tab.id, message.requestId, response);
		} catch (error) {
			return sendResponse(sender.tab.id, message.requestId, { error: error.message, arrray: [] });
		}
	} else if (message.method == "singlefile.fetchFrame") {
		return browser.tabs.sendMessage(sender.tab.id, message);
	}
}

async function sendResponse(tabId, requestId, response) {
	for (let blockIndex = 0; blockIndex * MAX_CONTENT_SIZE < response.array.length; blockIndex++) {
		const message = {
			method: "singlefile.fetchResponse",
			requestId,
			headers: response.headers,
			status: response.status,
			error: response.error
		};
		message.truncated = response.array.length > MAX_CONTENT_SIZE;
		if (message.truncated) {
			message.finished = (blockIndex + 1) * MAX_CONTENT_SIZE > response.array.length;
			message.array = response.array.slice(blockIndex * MAX_CONTENT_SIZE, (blockIndex + 1) * MAX_CONTENT_SIZE);
		} else {
			message.array = response.array;
		}
		await browser.tabs.sendMessage(tabId, message);
	}
	return {};
}

async function fetchResource(url, options = {}) {
	const response = await fetch(url, options);
	const array = Array.from(new Uint8Array(await response.arrayBuffer()));
	const headers = { "content-type": response.headers.get("content-type") };
	const status = response.status;
	return {
		array,
		headers,
		status
	};
}