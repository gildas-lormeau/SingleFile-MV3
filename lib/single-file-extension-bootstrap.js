(function () {
	'use strict';

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

	/* global browser, globalThis, document, location, Node */

	const singlefile = globalThis.singlefileBootstrap;

	const MAX_CONTENT_SIZE = 32 * (1024 * 1024);

	let options, previousLocationHref;
	singlefile.pageInfo = {
		updatedResources: {},
		visitDate: new Date()
	};
	browser.runtime.sendMessage({ method: "bootstrap.init" }).then(message => {
		options = message.options;
		if (options && options.autoOpenEditor && detectSavedPage(document)) {
			if (document.readyState == "loading") {
				document.addEventListener("DOMContentLoaded", () => openEditor(document));
			} else {
				openEditor(document);
			}
		}
	});
	browser.runtime.onMessage.addListener(message => {
		if (message.method == "content.maybeInit" ||
			message.method == "content.init" ||
			message.method == "content.openEditor" ||
			message.method == "devtools.resourceCommitted") {
			return onMessage(message);
		}
	});
	document.addEventListener("DOMContentLoaded", init, false);

	async function onMessage(message) {
		if (message.method == "content.maybeInit") {
			init();
			return {};
		}
		if (message.method == "content.init") {
			options = message.options;
			return {};
		}
		if (message.method == "content.openEditor") {
			if (detectSavedPage(document)) {
				openEditor(document);
			}
			return {};
		}
		if (message.method == "devtools.resourceCommitted") {
			singlefile.pageInfo.updatedResources[message.url] = { content: message.content, type: message.type, encoding: message.encoding };
			return {};
		}
	}

	function init() {
		if (previousLocationHref != location.href && !singlefile.pageInfo.processing) {
			previousLocationHref = location.href;
			browser.runtime.sendMessage({ method: "tabs.init", savedPageDetected: detectSavedPage(document) }).catch(() => { });
			browser.runtime.sendMessage({ method: "ui.processInit" }).catch(() => { });
		}
	}

	async function openEditor(document) {
		const infobarElement = document.querySelector("singlefile-infobar");
		if (infobarElement) {
			infobarElement.remove();
		}
		serializeShadowRoots(document);
		const content = singlefile.helper.serialize(document);
		for (let blockIndex = 0; blockIndex * MAX_CONTENT_SIZE < content.length; blockIndex++) {
			const message = {
				method: "editor.open",
				filename: decodeURIComponent(location.href.match(/^.*\/(.*)$/)[1])
			};
			message.truncated = content.length > MAX_CONTENT_SIZE;
			if (message.truncated) {
				message.finished = (blockIndex + 1) * MAX_CONTENT_SIZE > content.length;
				message.content = content.substring(blockIndex * MAX_CONTENT_SIZE, (blockIndex + 1) * MAX_CONTENT_SIZE);
			} else {
				message.content = content;
			}
			await browser.runtime.sendMessage(message);
		}
	}

	function detectSavedPage(document) {
		const helper = singlefile.helper;
		const firstDocumentChild = document.documentElement.firstChild;
		return firstDocumentChild.nodeType == Node.COMMENT_NODE &&
			(firstDocumentChild.textContent.includes(helper.COMMENT_HEADER) || firstDocumentChild.textContent.includes(helper.COMMENT_HEADER_LEGACY));
	}

	function serializeShadowRoots(node) {
		const SHADOWROOT_ATTRIBUTE_NAME = "shadowroot";
		node.querySelectorAll("*").forEach(element => {
			const shadowRoot = singlefile.helper.getShadowRoot(element);
			if (shadowRoot) {
				serializeShadowRoots(shadowRoot);
				const templateElement = document.createElement("template");
				templateElement.setAttribute(SHADOWROOT_ATTRIBUTE_NAME, "open");
				templateElement.appendChild(shadowRoot);
				element.appendChild(templateElement);
			}
		});
	}

})();
