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

/* global browser */

import * as yabson from "./../../lib/yabson/yabson.js";

const OFFSCREEN_DOCUMENT_URL = "/src/ui/pages/offscreen-document.html";

export {
	compressPage,
	processPage,
	revokeObjectURL
};

async function compressPage(pageData, options) {
	pageData = Array.from(await yabson.serialize(pageData));
	await createOffscreenDocument();
	return browser.runtime.sendMessage({ method: "compressPage", pageData, options });
}

async function processPage(options) {
	await createOffscreenDocument();
	return browser.runtime.sendMessage({ method: "processPage", options });
}

async function revokeObjectURL(url) {
	await createOffscreenDocument();
	return browser.runtime.sendMessage({ method: "revokeObjectURL", url });
}

async function createOffscreenDocument() {
	if (!await browser.offscreen.hasDocument()) {
		await browser.offscreen.createDocument({ url: OFFSCREEN_DOCUMENT_URL, justification: "Auto-save/Compression features", reasons: ["DOM_PARSER"] });
	}
}