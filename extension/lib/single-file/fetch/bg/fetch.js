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

browser.runtime.onMessage.addListener((message, sender) => {
	if (message.method && message.method.startsWith("singlefile.fetch")) {
		return new Promise(resolve => {
			onRequest(message, sender)
				.then(resolve)
				.catch(error => resolve({ error: error && error.toString() }));
		});
	}
});

function onRequest(message, sender) {
	if (message.method == "singlefile.fetch") {
		return fetchResource(message.url, { headers: message.headers });
	} else if (message.method == "singlefile.fetchFrame") {
		return browser.tabs.sendMessage(sender.tab.id, message);
	}
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