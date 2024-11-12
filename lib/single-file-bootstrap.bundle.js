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

	/* global globalThis, window */

	if (typeof globalThis == "undefined") {
		window.globalThis = window;
	}

	(() => {

		if (!globalThis.browser && globalThis.chrome) {
			const nativeAPI = globalThis.chrome;
			globalThis.__defineGetter__("browser", () => ({
				action: {
					onClicked: {
						addListener: listener => nativeAPI.action.onClicked.addListener(listener)
					},
					setBadgeText: options => nativeAPI.action.setBadgeText(options),
					setBadgeBackgroundColor: options => nativeAPI.action.setBadgeBackgroundColor(options),
					setTitle: options => nativeAPI.action.setTitle(options),
					setIcon: options => nativeAPI.action.setIcon(options)
				},
				bookmarks: {
					get: id => nativeAPI.bookmarks.get(id),
					onCreated: {
						addListener: listener => nativeAPI.bookmarks.onCreated.addListener(listener),
						removeListener: listener => nativeAPI.bookmarks.onCreated.removeListener(listener)
					},
					onChanged: {
						addListener: listener => nativeAPI.bookmarks.onChanged.addListener(listener),
						removeListener: listener => nativeAPI.bookmarks.onChanged.removeListener(listener)
					},
					onMoved: {
						addListener: listener => nativeAPI.bookmarks.onMoved.addListener(listener),
						removeListener: listener => nativeAPI.bookmarks.onMoved.removeListener(listener)
					},
					update: (id, changes) => nativeAPI.bookmarks.update(id, changes)
				},
				commands: {
					onCommand: {
						addListener: listener => nativeAPI.commands.onCommand.addListener(listener)
					}
				},
				downloads: {
					download: options => nativeAPI.downloads.download(options),
					onChanged: {
						addListener: listener => nativeAPI.downloads.onChanged.addListener(listener),
						removeListener: listener => nativeAPI.downloads.onChanged.removeListener(listener)
					},
					search: query => nativeAPI.downloads.search(query)
				},
				i18n: {
					getUILanguage: () => nativeAPI.i18n.getUILanguage(),
					getMessage: (messageName, substitutions) => nativeAPI.i18n.getMessage(messageName, substitutions)
				},
				identity: {
					getRedirectURL: () => nativeAPI.identity.getRedirectURL(),
					getAuthToken: details => nativeAPI.identity.getAuthToken(details),
					launchWebAuthFlow: details => nativeAPI.identity.launchWebAuthFlow(details),
					removeCachedAuthToken: details => nativeAPI.identity.removeCachedAuthToken(details)
				},
				contextMenus: {
					onClicked: {
						addListener: listener => nativeAPI.contextMenus.onClicked.addListener(listener)
					},
					create: options => nativeAPI.contextMenus.create(options),
					update: (menuItemId, options) => nativeAPI.contextMenus.update(menuItemId, options),
					removeAll: () => nativeAPI.contextMenus.removeAll()
				},
				permissions: {
					request: permissions => nativeAPI.permissions.request(permissions),
					remove: permissions => nativeAPI.permissions.remove(permissions)
				},
				runtime: {
					id: nativeAPI.runtime.id,
					sendNativeMessage: (application, message) => new Promise((resolve, reject) => {
						nativeAPI.runtime.sendNativeMessage(application, message, result => {
							if (nativeAPI.runtime.lastError) {
								reject(nativeAPI.runtime.lastError);
							} else {
								resolve(result);
							}
						});
					}),
					getManifest: () => nativeAPI.runtime.getManifest(),
					onMessage: {
						addListener: listener => nativeAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
							const response = listener(message, sender);
							if (response && typeof response.then == "function") {
								response
									.then(response => {
										if (response !== undefined) {
											try {
												sendResponse(response);
											} catch (error) {
												// ignored
											}
										}
									});
								return true;
							}
						}),
						removeListener: listener => nativeAPI.runtime.onMessage.removeListener(listener)
					},
					onMessageExternal: {
						addListener: listener => nativeAPI.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
							const response = listener(message, sender);
							if (response && typeof response.then == "function") {
								response
									.then(response => {
										if (response !== undefined) {
											try {
												sendResponse(response);
											} catch (error) {
												// ignored
											}
										}
									});
								return true;
							}
						})
					},
					sendMessage: message => new Promise((resolve, reject) => {
						nativeAPI.runtime.sendMessage(message, response => {
							if (nativeAPI.runtime.lastError) {
								reject(nativeAPI.runtime.lastError);
							} else {
								resolve(response);
							}
						});
						if (nativeAPI.runtime.lastError) {
							reject(nativeAPI.runtime.lastError);
						}
					}),
					getURL: (path) => nativeAPI.runtime.getURL(path),
					getContexts: (filter) => nativeAPI.runtime.getContexts(filter),
					get lastError() {
						return nativeAPI.runtime.lastError;
					}
				},
				scripting: {
					executeScript: injection => nativeAPI.scripting.executeScript(injection)
				},
				storage: {
					local: {
						set: value => nativeAPI.storage.local.set(value),
						get: keys => nativeAPI.storage.local.get(keys),
						clear: () => nativeAPI.storage.local.clear(),
						remove: keys => nativeAPI.storage.local.remove(keys)
					},
					sync: {
						set: value => nativeAPI.storage.sync.set(value),
						get: keys => nativeAPI.storage.sync.get(keys),
						clear: () => nativeAPI.storage.sync.clear(),
						remove: keys => nativeAPI.storage.sync.remove(keys)
					}
				},
				tabs: {
					onCreated: {
						addListener: listener => nativeAPI.tabs.onCreated.addListener(listener)
					},
					onActivated: {
						addListener: listener => nativeAPI.tabs.onActivated.addListener(listener)
					},
					onUpdated: {
						addListener: listener => nativeAPI.tabs.onUpdated.addListener(listener),
						removeListener: listener => nativeAPI.tabs.onUpdated.removeListener(listener)
					},
					onRemoved: {
						addListener: listener => nativeAPI.tabs.onRemoved.addListener(listener),
						removeListener: listener => nativeAPI.tabs.onRemoved.removeListener(listener)
					},
					onReplaced: {
						addListener: listener => nativeAPI.tabs.onReplaced.addListener(listener),
						removeListener: listener => nativeAPI.tabs.onReplaced.removeListener(listener)
					},
					captureVisibleTab: (windowId, options) => nativeAPI.tabs.captureVisibleTab(windowId, options),
					sendMessage: (tabId, message, options = {}) => new Promise((resolve, reject) => {
						nativeAPI.tabs.sendMessage(tabId, message, options, response => {
							if (nativeAPI.runtime.lastError) {
								reject(nativeAPI.runtime.lastError);
							} else {
								resolve(response);
							}
						});
						if (nativeAPI.runtime.lastError) {
							reject(nativeAPI.runtime.lastError);
						}
					}),
					query: options => nativeAPI.tabs.query(options),
					create: createProperties => nativeAPI.tabs.create(createProperties),
					get: options => nativeAPI.tabs.get(options),
					remove: tabId => nativeAPI.tabs.remove(tabId),
					update: (tabId, updateProperties) => nativeAPI.tabs.update(tabId, updateProperties)
				},
				devtools: {
					inspectedWindow: {
						onResourceContentCommitted: {
							addListener: listener => nativeAPI.devtools.inspectedWindow.onResourceContentCommitted.addListener(listener)
						},
						get tabId() {
							return nativeAPI.devtools.inspectedWindow.tabId;
						}
					}
				},
				offscreen: {
					createDocument: parameters => nativeAPI.offscreen.createDocument(parameters)
				},
				declarativeNetRequest: {
					updateSessionRules: parameters => nativeAPI.declarativeNetRequest.updateSessionRules(parameters)
				}
			}));
		}

	})();

})();
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singlefileBootstrap = {}));
})(this, (function (exports) { 'use strict';

	/*
	 * Copyright 2010-2022 Gildas Lormeau
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

	/* global globalThis, window */

	const LOAD_DEFERRED_IMAGES_START_EVENT = "single-file-load-deferred-images-start";
	const LOAD_DEFERRED_IMAGES_END_EVENT = "single-file-load-deferred-images-end";
	const LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_START_EVENT = "single-file-load-deferred-images-keep-zoom-level-start";
	const LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_END_EVENT = "single-file-load-deferred-images-keep-zoom-level-end";
	const BLOCK_COOKIES_START_EVENT = "single-file-block-cookies-start";
	const BLOCK_COOKIES_END_EVENT = "single-file-block-cookies-end";
	const DISPATCH_SCROLL_START_EVENT = "single-file-dispatch-scroll-event-start";
	const DISPATCH_SCROLL_END_EVENT = "single-file-dispatch-scroll-event-end";
	const BLOCK_STORAGE_START_EVENT = "single-file-block-storage-start";
	const BLOCK_STORAGE_END_EVENT = "single-file-block-storage-end";
	const LOAD_IMAGE_EVENT = "single-file-load-image";
	const IMAGE_LOADED_EVENT = "single-file-image-loaded";
	const NEW_FONT_FACE_EVENT = "single-file-new-font-face";
	const DELETE_FONT_EVENT = "single-file-delete-font";
	const CLEAR_FONTS_EVENT = "single-file-clear-fonts";
	const NEW_WORKLET_EVENT = "single-file-new-worklet";
	const FONT_FACE_PROPERTY_NAME = "_singleFile_fontFaces";
	const WORKLET_PROPERTY_NAME = "_singleFile_worklets";

	const CustomEvent$1 = globalThis.CustomEvent;
	const document$2 = globalThis.document;
	const Document = globalThis.Document;
	const JSON$2 = globalThis.JSON;
	const MutationObserver$3 = globalThis.MutationObserver;

	let fontFaces, worklets;
	if (window[FONT_FACE_PROPERTY_NAME]) {
		fontFaces = window[FONT_FACE_PROPERTY_NAME];
	} else {
		fontFaces = window[FONT_FACE_PROPERTY_NAME] = new Map();
	}
	if (window[WORKLET_PROPERTY_NAME]) {
		worklets = window[WORKLET_PROPERTY_NAME];
	} else {
		worklets = window[WORKLET_PROPERTY_NAME] = new Map();
	}

	init$1();
	new MutationObserver$3(init$1).observe(document$2, { childList: true });

	function init$1() {
		if (document$2 instanceof Document) {
			document$2.addEventListener(NEW_FONT_FACE_EVENT, event => {
				const detail = event.detail;
				const key = Object.assign({}, detail);
				delete key.src;
				fontFaces.set(JSON$2.stringify(key), detail);
			});
			document$2.addEventListener(DELETE_FONT_EVENT, event => {
				const detail = event.detail;
				const key = Object.assign({}, detail);
				delete key.src;
				fontFaces.delete(JSON$2.stringify(key));
			});
			document$2.addEventListener(CLEAR_FONTS_EVENT, () => fontFaces = new Map());
			document$2.addEventListener(NEW_WORKLET_EVENT, event => {
				const detail = event.detail;
				worklets.set(detail.moduleURL, detail);
			});
		}
	}

	function getFontsData$1() {
		return Array.from(fontFaces.values());
	}

	function getWorkletsData$1() {
		return Array.from(worklets.values());
	}

	function loadDeferredImagesStart(options) {
		if (options.loadDeferredImagesBlockCookies) {
			document$2.dispatchEvent(new CustomEvent$1(BLOCK_COOKIES_START_EVENT));
		}
		if (options.loadDeferredImagesBlockStorage) {
			document$2.dispatchEvent(new CustomEvent$1(BLOCK_STORAGE_START_EVENT));
		}
		if (options.loadDeferredImagesDispatchScrollEvent) {
			document$2.dispatchEvent(new CustomEvent$1(DISPATCH_SCROLL_START_EVENT));
		}
		if (options.loadDeferredImagesKeepZoomLevel) {
			document$2.dispatchEvent(new CustomEvent$1(LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_START_EVENT));
		} else {
			document$2.dispatchEvent(new CustomEvent$1(LOAD_DEFERRED_IMAGES_START_EVENT));
		}
	}

	function loadDeferredImagesEnd(options) {
		if (options.loadDeferredImagesBlockCookies) {
			document$2.dispatchEvent(new CustomEvent$1(BLOCK_COOKIES_END_EVENT));
		}
		if (options.loadDeferredImagesBlockStorage) {
			document$2.dispatchEvent(new CustomEvent$1(BLOCK_STORAGE_END_EVENT));
		}
		if (options.loadDeferredImagesDispatchScrollEvent) {
			document$2.dispatchEvent(new CustomEvent$1(DISPATCH_SCROLL_END_EVENT));
		}
		if (options.loadDeferredImagesKeepZoomLevel) {
			document$2.dispatchEvent(new CustomEvent$1(LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_END_EVENT));
		} else {
			document$2.dispatchEvent(new CustomEvent$1(LOAD_DEFERRED_IMAGES_END_EVENT));
		}
	}

	/*
	 * The MIT License (MIT)
	 *
	 * Author: Gildas Lormeau
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	// derived from https://github.com/postcss/postcss-selector-parser/blob/master/src/util/unesc.js

	/*
	 * The MIT License (MIT)
	 * Copyright (c) Ben Briggs <beneb.info@gmail.com> (http://beneb.info)
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 *
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 *
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */

	const whitespace = "[\\x20\\t\\r\\n\\f]";
	const unescapeRegExp = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig");

	function process$2(str) {
		return str.replace(unescapeRegExp, (_, escaped, escapedWhitespace) => {
			const high = "0x" + escaped - 0x10000;

			// NaN means non-codepoint
			// Workaround erroneous numeric interpretation of +"0x"
			// eslint-disable-next-line no-self-compare
			return high !== high || escapedWhitespace
				? escaped
				: high < 0
					? // BMP codepoint
					String.fromCharCode(high + 0x10000)
					: // Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode((high >> 10) | 0xd800, (high & 0x3ff) | 0xdc00);
		});
	}

	const SINGLE_FILE_PREFIX = "single-file-";
	const COMMENT_HEADER = "Page saved with SingleFile";
	const WAIT_FOR_USERSCRIPT_PROPERTY_NAME = "_singleFile_waitForUserScript";
	const MESSAGE_PREFIX = "__frameTree__::";

	/*
	 * Copyright 2010-2022 Gildas Lormeau
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


	const INFOBAR_TAGNAME$1 = "single-file-infobar";

	/*
	 * Copyright 2010-2022 Gildas Lormeau
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


	const ON_BEFORE_CAPTURE_EVENT_NAME = SINGLE_FILE_PREFIX + "on-before-capture";
	const ON_AFTER_CAPTURE_EVENT_NAME = SINGLE_FILE_PREFIX + "on-after-capture";
	const GET_ADOPTED_STYLESHEETS_REQUEST_EVENT = SINGLE_FILE_PREFIX + "request-get-adopted-stylesheets";
	const GET_ADOPTED_STYLESHEETS_RESPONSE_EVENT = SINGLE_FILE_PREFIX + "response-get-adopted-stylesheets";
	const UNREGISTER_GET_ADOPTED_STYLESHEETS_REQUEST_EVENT = SINGLE_FILE_PREFIX + "unregister-request-get-adopted-stylesheets";
	const ON_INIT_USERSCRIPT_EVENT = SINGLE_FILE_PREFIX + "user-script-init";
	const REMOVED_CONTENT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "removed-content";
	const HIDDEN_CONTENT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "hidden-content";
	const KEPT_CONTENT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "kept-content";
	const HIDDEN_FRAME_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "hidden-frame";
	const PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "preserved-space-element";
	const SHADOW_ROOT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "shadow-root-element";
	const WIN_ID_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "win-id";
	const IMAGE_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "image";
	const POSTER_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "poster";
	const VIDEO_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "video";
	const CANVAS_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "canvas";
	const STYLE_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "movable-style";
	const INPUT_VALUE_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "input-value";
	const INPUT_CHECKED_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "input-checked";
	const LAZY_SRC_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "lazy-loaded-src";
	const STYLESHEET_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "stylesheet";
	const DISABLED_NOSCRIPT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "disabled-noscript";
	const INVALID_ELEMENT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "invalid-element";
	const ASYNC_SCRIPT_ATTRIBUTE_NAME = "data-" + SINGLE_FILE_PREFIX + "async-script";
	const FLOW_ELEMENTS_SELECTOR = "*:not(base):not(link):not(meta):not(noscript):not(script):not(style):not(template):not(title)";
	const KEPT_TAG_NAMES = ["NOSCRIPT", "DISABLED-NOSCRIPT", "META", "LINK", "STYLE", "TITLE", "TEMPLATE", "SOURCE", "OBJECT", "SCRIPT", "HEAD", "BODY"];
	const IGNORED_TAG_NAMES = ["SCRIPT", "NOSCRIPT", "META", "LINK", "TEMPLATE"];
	const REGEXP_SIMPLE_QUOTES_STRING = /^'(.*?)'$/;
	const REGEXP_DOUBLE_QUOTES_STRING = /^"(.*?)"$/;
	const FONT_WEIGHTS = {
		regular: "400",
		normal: "400",
		bold: "700",
		bolder: "700",
		lighter: "100"
	};
	const COMMENT_HEADER_LEGACY = "Archive processed by SingleFile";
	const SINGLE_FILE_UI_ELEMENT_CLASS = "single-file-ui-element";
	const INFOBAR_TAGNAME = INFOBAR_TAGNAME$1;
	const EMPTY_RESOURCE = "data:,";
	const addEventListener = (type, listener, options) => globalThis.addEventListener(type, listener, options);
	const dispatchEvent = event => { try { globalThis.dispatchEvent(event); } catch (error) {  /* ignored */ } };
	const JSON$1 = globalThis.JSON;
	const CustomEvent = globalThis.CustomEvent;
	const MutationObserver$2 = globalThis.MutationObserver;
	const URL = globalThis.URL;

	function initUserScriptHandler() {
		addEventListener(ON_INIT_USERSCRIPT_EVENT, ({ detail }) => globalThis[WAIT_FOR_USERSCRIPT_PROPERTY_NAME] = async (eventPrefixName, options) => {
			const userScriptOptions = Object.assign({}, options);
			delete userScriptOptions.win;
			delete userScriptOptions.doc;
			delete userScriptOptions.onprogress;
			delete userScriptOptions.frames;
			delete userScriptOptions.taskId;
			delete userScriptOptions._migratedTemplateFormat;
			delete userScriptOptions.woleetKey;
			let detailUserScript;
			try {
				detailUserScript = detail == "jsonDetail" ? JSON$1.stringify({ options: userScriptOptions }) : { options: userScriptOptions };
			} catch (error) {
				// ignored
			}
			const event = new CustomEvent(eventPrefixName + "-request", { cancelable: true, detail: detailUserScript });
			let resolvePromiseResponse;
			const promiseResponse = new Promise(resolve => {
				resolvePromiseResponse = resolve;
				addEventListener(eventPrefixName + "-response", event => {
					if (event.detail) {
						try {
							const detail = typeof event.detail == "string" ? JSON$1.parse(event.detail) : event.detail;
							if (detail.options) {
								Object.assign(options, detail.options);
							}
						} catch (error) {
							// ignored
						}
					}
					resolve();
				});
			});
			dispatchEvent(event);
			if (event.defaultPrevented) {
				await promiseResponse;
			} else {
				resolvePromiseResponse();
			}
		});
		new MutationObserver$2(initUserScriptHandler).observe(globalThis.document, { childList: true });
	}

	function initDoc(doc) {
		doc.querySelectorAll("meta[http-equiv=refresh]").forEach(element => {
			element.removeAttribute("http-equiv");
			element.setAttribute("disabled-http-equiv", "refresh");
		});
	}

	function preProcessDoc(doc, win, options) {
		doc.querySelectorAll("noscript:not([" + DISABLED_NOSCRIPT_ATTRIBUTE_NAME + "])").forEach(element => {
			element.setAttribute(DISABLED_NOSCRIPT_ATTRIBUTE_NAME, element.textContent);
			element.textContent = "";
		});
		initDoc(doc);
		if (doc.head) {
			doc.head.querySelectorAll(FLOW_ELEMENTS_SELECTOR).forEach(element => element.hidden = true);
		}
		doc.querySelectorAll("svg foreignObject").forEach(element => {
			const flowElements = element.querySelectorAll("html > head > " + FLOW_ELEMENTS_SELECTOR + ", html > body > " + FLOW_ELEMENTS_SELECTOR);
			if (flowElements.length) {
				Array.from(element.childNodes).forEach(node => node.remove());
				flowElements.forEach(flowElement => element.appendChild(flowElement));
			}
		});
		const invalidElements = new Map();
		let elementsInfo;
		if (win && doc.documentElement) {
			doc.querySelectorAll("button button, a a").forEach(element => {
				const placeHolderElement = doc.createElement("template");
				placeHolderElement.setAttribute(INVALID_ELEMENT_ATTRIBUTE_NAME, "");
				placeHolderElement.content.appendChild(element.cloneNode(true));
				invalidElements.set(element, placeHolderElement);
				element.replaceWith(placeHolderElement);
			});
			elementsInfo = getElementsInfo(win, doc, doc.documentElement, options);
			if (options.moveStylesInHead) {
				doc.querySelectorAll("body style, body ~ style").forEach(element => {
					const computedStyle = getComputedStyle(win, element);
					if (computedStyle && testHiddenElement(element, computedStyle)) {
						element.setAttribute(STYLE_ATTRIBUTE_NAME, "");
						elementsInfo.markedElements.push(element);
					}
				});
			}
		} else {
			elementsInfo = {
				canvases: [],
				images: [],
				posters: [],
				videos: [],
				usedFonts: [],
				shadowRoots: [],
				markedElements: []
			};
		}
		let referrer = "";
		if (doc.referrer) {
			try {
				referrer = new URL("/", new URL(doc.referrer).origin).href;
			} catch (error) {
				// ignored
			}
		}
		return {
			canvases: elementsInfo.canvases,
			fonts: getFontsData(),
			worklets: getWorkletsData(),
			stylesheets: getStylesheetsData(doc),
			images: elementsInfo.images,
			posters: elementsInfo.posters,
			videos: elementsInfo.videos,
			usedFonts: Array.from(elementsInfo.usedFonts.values()),
			shadowRoots: elementsInfo.shadowRoots,
			referrer,
			markedElements: elementsInfo.markedElements,
			invalidElements,
			scrollPosition: { x: win.scrollX, y: win.scrollY },
			adoptedStyleSheets: getStylesheetsContent(doc.adoptedStyleSheets)
		};
	}

	function getElementsInfo(win, doc, element, options, data = { usedFonts: new Map(), canvases: [], images: [], posters: [], videos: [], shadowRoots: [], markedElements: [] }, adoptedStyleSheetsCache = new Map(), ascendantHidden) {
		if (element.childNodes) {
			const elements = Array.from(element.childNodes).filter(node => (node instanceof win.HTMLElement) || (node instanceof win.SVGElement) || (node instanceof globalThis.HTMLElement) || (node instanceof globalThis.SVGElement));
			elements.forEach(element => {
				let elementHidden, elementKept, computedStyle;
				if (!options.autoSaveExternalSave && (options.removeHiddenElements || options.removeUnusedFonts || options.compressHTML)) {
					computedStyle = getComputedStyle(win, element);
					if ((element instanceof win.HTMLElement) || (element instanceof globalThis.HTMLElement)) {
						if (options.removeHiddenElements) {
							elementKept = ((ascendantHidden || element.closest("html > head")) && KEPT_TAG_NAMES.includes(element.tagName.toUpperCase())) || element.closest("details");
							if (!elementKept) {
								elementHidden = ascendantHidden || testHiddenElement(element, computedStyle);
								if (elementHidden && !IGNORED_TAG_NAMES.includes(element.tagName.toUpperCase())) {
									element.setAttribute(HIDDEN_CONTENT_ATTRIBUTE_NAME, "");
									data.markedElements.push(element);
								}
							}
						}
					}
					if (!elementHidden) {
						if (options.compressHTML && computedStyle) {
							const whiteSpace = computedStyle.getPropertyValue("white-space");
							if (whiteSpace && whiteSpace.startsWith("pre")) {
								element.setAttribute(PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME, "");
								data.markedElements.push(element);
							}
						}
						if (options.removeUnusedFonts) {
							getUsedFont(computedStyle, options, data.usedFonts);
							getUsedFont(getComputedStyle(win, element, ":first-letter"), options, data.usedFonts);
							getUsedFont(getComputedStyle(win, element, ":before"), options, data.usedFonts);
							getUsedFont(getComputedStyle(win, element, ":after"), options, data.usedFonts);
						}
					}
				}
				getResourcesInfo(win, doc, element, options, data, elementHidden, computedStyle);
				const shadowRoot = !((element instanceof win.SVGElement) || (element instanceof globalThis.SVGElement)) && getShadowRoot(element);
				if (shadowRoot && !element.classList.contains(SINGLE_FILE_UI_ELEMENT_CLASS) && element.tagName.toLowerCase() != INFOBAR_TAGNAME) {
					const shadowRootInfo = {};
					element.setAttribute(SHADOW_ROOT_ATTRIBUTE_NAME, data.shadowRoots.length);
					data.markedElements.push(element);
					data.shadowRoots.push(shadowRootInfo);
					try {
						if (shadowRoot.adoptedStyleSheets) {
							if (shadowRoot.adoptedStyleSheets.length) {
								shadowRootInfo.adoptedStyleSheets = getStylesheetsContent(shadowRoot.adoptedStyleSheets, adoptedStyleSheetsCache);
							} else if (shadowRoot.adoptedStyleSheets.length === undefined) {
								const listener = event => shadowRootInfo.adoptedStyleSheets = event.detail.adoptedStyleSheets;
								shadowRoot.addEventListener(GET_ADOPTED_STYLESHEETS_RESPONSE_EVENT, listener);
								shadowRoot.dispatchEvent(new CustomEvent(GET_ADOPTED_STYLESHEETS_REQUEST_EVENT, { bubbles: true }));
								if (!shadowRootInfo.adoptedStyleSheets) {
									element.dispatchEvent(new CustomEvent(GET_ADOPTED_STYLESHEETS_REQUEST_EVENT, { bubbles: true }));
								}
								shadowRoot.removeEventListener(GET_ADOPTED_STYLESHEETS_RESPONSE_EVENT, listener);
							}
						}
					} catch (error) {
						// ignored
					}
					getElementsInfo(win, doc, shadowRoot, options, data, adoptedStyleSheetsCache, elementHidden);
					shadowRootInfo.content = shadowRoot.innerHTML;
					shadowRootInfo.mode = shadowRoot.mode;
					shadowRootInfo.delegateFocus = shadowRoot.delegatesFocus;
					shadowRootInfo.clonable = shadowRoot.clonable;
					shadowRootInfo.serializable = shadowRoot.serializable;
					try {
						if (shadowRoot.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length === undefined) {
							shadowRoot.dispatchEvent(new CustomEvent(UNREGISTER_GET_ADOPTED_STYLESHEETS_REQUEST_EVENT, { bubbles: true }));
						}
					} catch (error) {
						// ignored
					}
				}
				getElementsInfo(win, doc, element, options, data, adoptedStyleSheetsCache, elementHidden);
				if (!options.autoSaveExternalSave && options.removeHiddenElements && ascendantHidden) {
					if (elementKept || element.getAttribute(KEPT_CONTENT_ATTRIBUTE_NAME) == "") {
						if (element.parentElement) {
							element.parentElement.setAttribute(KEPT_CONTENT_ATTRIBUTE_NAME, "");
							data.markedElements.push(element.parentElement);
						}
					} else if (elementHidden) {
						element.setAttribute(REMOVED_CONTENT_ATTRIBUTE_NAME, "");
						data.markedElements.push(element);
					}
				}
			});
		}
		return data;
	}

	function getStylesheetsContent(styleSheets, adoptedStyleSheetsCache = new Map()) {
		if (styleSheets) {
			const result = [];
			for (const styleSheet of Array.from(styleSheets)) {
				if (adoptedStyleSheetsCache.has(styleSheet)) {
					result.push(adoptedStyleSheetsCache.get(styleSheet));
				} else {
					let cssText = "";
					if (styleSheet && styleSheet.cssRules) {
						for (const cssRule of styleSheet.cssRules) {
							cssText += cssRule.cssText + "\n";
						}
					}
					adoptedStyleSheetsCache.set(styleSheet, cssText);
					result.push(cssText);
				}
			}
			return result;
		} else {
			return [];
		}
	}

	function getResourcesInfo(win, doc, element, options, data, elementHidden, computedStyle) {
		const tagName = element.tagName && element.tagName.toUpperCase();
		if (tagName == "CANVAS") {
			try {
				data.canvases.push({
					dataURI: element.toDataURL("image/png", ""),
					backgroundColor: computedStyle.getPropertyValue("background-color")
				});
				element.setAttribute(CANVAS_ATTRIBUTE_NAME, data.canvases.length - 1);
				data.markedElements.push(element);
			} catch (error) {
				// ignored
			}
		}
		if (tagName == "IMG") {
			const imageData = {
				currentSrc: elementHidden ?
					EMPTY_RESOURCE :
					(options.loadDeferredImages && element.getAttribute(LAZY_SRC_ATTRIBUTE_NAME)) || element.currentSrc
			};
			data.images.push(imageData);
			element.setAttribute(IMAGE_ATTRIBUTE_NAME, data.images.length - 1);
			data.markedElements.push(element);
			element.removeAttribute(LAZY_SRC_ATTRIBUTE_NAME);
			computedStyle = computedStyle || getComputedStyle(win, element);
			if (computedStyle) {
				imageData.size = getSize(win, element, computedStyle);
				const boxShadow = computedStyle.getPropertyValue("box-shadow");
				const backgroundImage = computedStyle.getPropertyValue("background-image");
				if ((!boxShadow || boxShadow == "none") &&
					(!backgroundImage || backgroundImage == "none") &&
					(imageData.size.pxWidth > 1 || imageData.size.pxHeight > 1)) {
					imageData.replaceable = true;
					imageData.backgroundColor = computedStyle.getPropertyValue("background-color");
					imageData.objectFit = computedStyle.getPropertyValue("object-fit");
					imageData.boxSizing = computedStyle.getPropertyValue("box-sizing");
					imageData.objectPosition = computedStyle.getPropertyValue("object-position");
				}
			}
		}
		if (tagName == "VIDEO") {
			const src = element.currentSrc;
			if (src && !src.startsWith("blob:") && !src.startsWith("data:")) {
				const computedStyle = getComputedStyle(win, element.parentNode);
				data.videos.push({
					positionParent: computedStyle && computedStyle.getPropertyValue("position"),
					src,
					size: {
						pxWidth: element.clientWidth,
						pxHeight: element.clientHeight
					},
					currentTime: element.currentTime
				});
				element.setAttribute(VIDEO_ATTRIBUTE_NAME, data.videos.length - 1);
			}
			if (!element.getAttribute("poster")) {
				const canvasElement = doc.createElement("canvas");
				const context = canvasElement.getContext("2d");
				canvasElement.width = element.clientWidth;
				canvasElement.height = element.clientHeight;
				try {
					context.drawImage(element, 0, 0, canvasElement.width, canvasElement.height);
					data.posters.push(canvasElement.toDataURL("image/png", ""));
					element.setAttribute(POSTER_ATTRIBUTE_NAME, data.posters.length - 1);
					data.markedElements.push(element);
				} catch (error) {
					// ignored
				}
			}
		}
		if (tagName == "IFRAME") {
			if (elementHidden && options.removeHiddenElements) {
				element.setAttribute(HIDDEN_FRAME_ATTRIBUTE_NAME, "");
				data.markedElements.push(element);
			}
		}
		if (tagName == "INPUT") {
			if (element.type != "password") {
				element.setAttribute(INPUT_VALUE_ATTRIBUTE_NAME, element.value);
				data.markedElements.push(element);
			}
			if (element.type == "radio" || element.type == "checkbox") {
				element.setAttribute(INPUT_CHECKED_ATTRIBUTE_NAME, element.checked);
				data.markedElements.push(element);
			}
		}
		if (tagName == "TEXTAREA") {
			element.setAttribute(INPUT_VALUE_ATTRIBUTE_NAME, element.value);
			data.markedElements.push(element);
		}
		if (tagName == "SELECT") {
			element.querySelectorAll("option").forEach(option => {
				if (option.selected) {
					option.setAttribute(INPUT_VALUE_ATTRIBUTE_NAME, "");
					data.markedElements.push(option);
				}
			});
		}
		if (tagName == "SCRIPT") {
			if (element.async && element.getAttribute("async") != "" && element.getAttribute("async") != "async") {
				element.setAttribute(ASYNC_SCRIPT_ATTRIBUTE_NAME, "");
				data.markedElements.push(element);
			}
			element.textContent = element.textContent.replace(/<\/script>/gi, "<\\/script>");
		}
	}

	function getUsedFont(computedStyle, options, usedFonts) {
		if (computedStyle) {
			const fontStyle = computedStyle.getPropertyValue("font-style") || "normal";
			computedStyle.getPropertyValue("font-family").split(",").forEach(fontFamilyName => {
				fontFamilyName = normalizeFontFamily(fontFamilyName);
				if (!options.loadedFonts || options.loadedFonts.find(font => normalizeFontFamily(font.family) == fontFamilyName && font.style == fontStyle)) {
					const fontWeight = getFontWeight(computedStyle.getPropertyValue("font-weight"));
					const fontVariant = computedStyle.getPropertyValue("font-variant") || "normal";
					const value = [fontFamilyName, fontWeight, fontStyle, fontVariant];
					usedFonts.set(JSON$1.stringify(value), [fontFamilyName, fontWeight, fontStyle, fontVariant]);
				}
			});
		}
	}

	function getShadowRoot(element) {
		const chrome = globalThis.chrome;
		if (element.openOrClosedShadowRoot) {
			return element.openOrClosedShadowRoot;
		} else if (chrome && chrome.dom && chrome.dom.openOrClosedShadowRoot) {
			try {
				return chrome.dom.openOrClosedShadowRoot(element);
			} catch (error) {
				return element.shadowRoot;
			}
		} else {
			return element.shadowRoot;
		}
	}

	function normalizeFontFamily(fontFamilyName = "") {
		return removeQuotes(process$2(fontFamilyName.trim())).toLowerCase();
	}

	function testHiddenElement(element, computedStyle) {
		let hidden = false;
		if (computedStyle) {
			const display = computedStyle.getPropertyValue("display");
			const opacity = computedStyle.getPropertyValue("opacity");
			const visibility = computedStyle.getPropertyValue("visibility");
			hidden = display == "none";
			if (!hidden && (opacity == "0" || visibility == "hidden") && element.getBoundingClientRect) {
				const boundingRect = element.getBoundingClientRect();
				hidden = !boundingRect.width && !boundingRect.height;
			}
		}
		return Boolean(hidden);
	}

	function postProcessDoc(doc, markedElements, invalidElements) {
		doc.querySelectorAll("[" + DISABLED_NOSCRIPT_ATTRIBUTE_NAME + "]").forEach(element => {
			element.textContent = element.getAttribute(DISABLED_NOSCRIPT_ATTRIBUTE_NAME);
			element.removeAttribute(DISABLED_NOSCRIPT_ATTRIBUTE_NAME);
		});
		doc.querySelectorAll("meta[disabled-http-equiv]").forEach(element => {
			element.setAttribute("http-equiv", element.getAttribute("disabled-http-equiv"));
			element.removeAttribute("disabled-http-equiv");
		});
		if (doc.head) {
			doc.head.querySelectorAll("*:not(base):not(link):not(meta):not(noscript):not(script):not(style):not(template):not(title)").forEach(element => element.removeAttribute("hidden"));
		}
		if (!markedElements) {
			const singleFileAttributes = [REMOVED_CONTENT_ATTRIBUTE_NAME, HIDDEN_FRAME_ATTRIBUTE_NAME, HIDDEN_CONTENT_ATTRIBUTE_NAME, PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME, IMAGE_ATTRIBUTE_NAME, POSTER_ATTRIBUTE_NAME, VIDEO_ATTRIBUTE_NAME, CANVAS_ATTRIBUTE_NAME, INPUT_VALUE_ATTRIBUTE_NAME, INPUT_CHECKED_ATTRIBUTE_NAME, SHADOW_ROOT_ATTRIBUTE_NAME, STYLESHEET_ATTRIBUTE_NAME, ASYNC_SCRIPT_ATTRIBUTE_NAME];
			markedElements = doc.querySelectorAll(singleFileAttributes.map(name => "[" + name + "]").join(","));
		}
		markedElements.forEach(element => {
			element.removeAttribute(REMOVED_CONTENT_ATTRIBUTE_NAME);
			element.removeAttribute(HIDDEN_CONTENT_ATTRIBUTE_NAME);
			element.removeAttribute(KEPT_CONTENT_ATTRIBUTE_NAME);
			element.removeAttribute(HIDDEN_FRAME_ATTRIBUTE_NAME);
			element.removeAttribute(PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME);
			element.removeAttribute(IMAGE_ATTRIBUTE_NAME);
			element.removeAttribute(POSTER_ATTRIBUTE_NAME);
			element.removeAttribute(VIDEO_ATTRIBUTE_NAME);
			element.removeAttribute(CANVAS_ATTRIBUTE_NAME);
			element.removeAttribute(INPUT_VALUE_ATTRIBUTE_NAME);
			element.removeAttribute(INPUT_CHECKED_ATTRIBUTE_NAME);
			element.removeAttribute(SHADOW_ROOT_ATTRIBUTE_NAME);
			element.removeAttribute(STYLESHEET_ATTRIBUTE_NAME);
			element.removeAttribute(ASYNC_SCRIPT_ATTRIBUTE_NAME);
			element.removeAttribute(STYLE_ATTRIBUTE_NAME);
		});
		if (invalidElements) {
			invalidElements.forEach((placeholderElement, element) => placeholderElement.replaceWith(element));
		}
	}

	function getStylesheetsData(doc) {
		if (doc) {
			const contents = [];
			doc.querySelectorAll("style").forEach((styleElement, styleIndex) => {
				try {
					if (!styleElement.sheet.disabled) {
						const tempStyleElement = doc.createElement("style");
						tempStyleElement.textContent = styleElement.textContent;
						doc.body.appendChild(tempStyleElement);
						const stylesheet = tempStyleElement.sheet;
						tempStyleElement.remove();
						const textContentStylesheet = Array.from(stylesheet.cssRules).map(cssRule => cssRule.cssText).join("\n");
						const sheetStylesheet = Array.from(styleElement.sheet.cssRules).map(cssRule => cssRule.cssText).join("\n");
						if (!stylesheet || textContentStylesheet != sheetStylesheet) {
							styleElement.setAttribute(STYLESHEET_ATTRIBUTE_NAME, styleIndex);
							contents[styleIndex] = Array.from(styleElement.sheet.cssRules).map(cssRule => cssRule.cssText).join("\n");
						}
					}
				} catch (error) {
					// ignored
				}
			});
			return contents;
		}
	}

	function getSize(win, imageElement, computedStyle) {
		let pxWidth = imageElement.naturalWidth;
		let pxHeight = imageElement.naturalHeight;
		if (!pxWidth && !pxHeight) {
			const noStyleAttribute = imageElement.getAttribute("style") == null;
			computedStyle = computedStyle || getComputedStyle(win, imageElement);
			if (computedStyle) {
				let removeBorderWidth = false;
				if (computedStyle.getPropertyValue("box-sizing") == "content-box") {
					const boxSizingValue = imageElement.style.getPropertyValue("box-sizing");
					const boxSizingPriority = imageElement.style.getPropertyPriority("box-sizing");
					const clientWidth = imageElement.clientWidth;
					imageElement.style.setProperty("box-sizing", "border-box", "important");
					removeBorderWidth = imageElement.clientWidth != clientWidth;
					if (boxSizingValue) {
						imageElement.style.setProperty("box-sizing", boxSizingValue, boxSizingPriority);
					} else {
						imageElement.style.removeProperty("box-sizing");
					}
				}
				let paddingLeft, paddingRight, paddingTop, paddingBottom, borderLeft, borderRight, borderTop, borderBottom;
				paddingLeft = getWidth("padding-left", computedStyle);
				paddingRight = getWidth("padding-right", computedStyle);
				paddingTop = getWidth("padding-top", computedStyle);
				paddingBottom = getWidth("padding-bottom", computedStyle);
				if (removeBorderWidth) {
					borderLeft = getWidth("border-left-width", computedStyle);
					borderRight = getWidth("border-right-width", computedStyle);
					borderTop = getWidth("border-top-width", computedStyle);
					borderBottom = getWidth("border-bottom-width", computedStyle);
				} else {
					borderLeft = borderRight = borderTop = borderBottom = 0;
				}
				pxWidth = Math.max(0, imageElement.clientWidth - paddingLeft - paddingRight - borderLeft - borderRight);
				pxHeight = Math.max(0, imageElement.clientHeight - paddingTop - paddingBottom - borderTop - borderBottom);
				if (noStyleAttribute) {
					imageElement.removeAttribute("style");
				}
			}
		}
		return { pxWidth, pxHeight };
	}

	function getWidth(styleName, computedStyle) {
		if (computedStyle.getPropertyValue(styleName).endsWith("px")) {
			return parseFloat(computedStyle.getPropertyValue(styleName));
		}
	}

	function getFontsData() {
		return getFontsData$1();
	}

	function getWorkletsData() {
		return getWorkletsData$1();
	}

	function serialize$1(doc) {
		const docType = doc.doctype;
		let docTypeString = "";
		if (docType) {
			docTypeString = "<!DOCTYPE " + docType.nodeName;
			if (docType.publicId) {
				docTypeString += " PUBLIC \"" + docType.publicId + "\"";
				if (docType.systemId) {
					docTypeString += " \"" + docType.systemId + "\"";
				}
			} else if (docType.systemId) {
				docTypeString += " SYSTEM \"" + docType.systemId + "\"";
			} if (docType.internalSubset) {
				docTypeString += " [" + docType.internalSubset + "]";
			}
			docTypeString += "> ";
		}
		return docTypeString + doc.documentElement.outerHTML;
	}

	function removeQuotes(string) {
		if (string.match(REGEXP_SIMPLE_QUOTES_STRING)) {
			string = string.replace(REGEXP_SIMPLE_QUOTES_STRING, "$1");
		} else {
			string = string.replace(REGEXP_DOUBLE_QUOTES_STRING, "$1");
		}
		return string.trim();
	}

	function getFontWeight(weight) {
		return FONT_WEIGHTS[weight.toLowerCase().trim()] || weight;
	}

	function getComputedStyle(win, element, pseudoElement) {
		try {
			return win.getComputedStyle(element, pseudoElement);
		} catch (error) {
			// ignored
		}
	}

	/*
	 * Copyright 2010-2022 Gildas Lormeau
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

	const helper$2 = {
		LAZY_SRC_ATTRIBUTE_NAME,
		SINGLE_FILE_UI_ELEMENT_CLASS
	};

	const MAX_IDLE_TIMEOUT_CALLS = 10;
	const ATTRIBUTES_MUTATION_TYPE = "attributes";

	const browser$1 = globalThis.browser;
	const document$1 = globalThis.document;
	const MutationObserver$1 = globalThis.MutationObserver;
	const timeouts = new Map();

	let idleTimeoutCalls;

	if (browser$1 && browser$1.runtime && browser$1.runtime.onMessage && browser$1.runtime.onMessage.addListener) {
		browser$1.runtime.onMessage.addListener(message => {
			if (message.method == "singlefile.lazyTimeout.onTimeout") {
				const timeoutData = timeouts.get(message.type);
				if (timeoutData) {
					timeouts.delete(message.type);
					try {
						timeoutData.callback();
					} catch (error) {
						clearRegularTimeout(message.type);
					}
				}
			}
		});
	}

	async function process$1(options) {
		if (document$1.documentElement) {
			timeouts.clear();
			const bodyHeight = document$1.body ? Math.max(document$1.body.scrollHeight, document$1.documentElement.scrollHeight) : document$1.documentElement.scrollHeight;
			const bodyWidth = document$1.body ? Math.max(document$1.body.scrollWidth, document$1.documentElement.scrollWidth) : document$1.documentElement.scrollWidth;
			if (bodyHeight > globalThis.innerHeight || bodyWidth > globalThis.innerWidth) {
				const maxScrollY = Math.max(bodyHeight - (globalThis.innerHeight * 1.5), 0);
				const maxScrollX = Math.max(bodyWidth - (globalThis.innerWidth * 1.5), 0);
				if (globalThis.scrollY < maxScrollY || globalThis.scrollX < maxScrollX) {
					return triggerLazyLoading(options);
				}
			}
		}
	}

	function triggerLazyLoading(options) {
		idleTimeoutCalls = 0;
		return new Promise(async resolve => { // eslint-disable-line  no-async-promise-executor
			let loadingImages;
			const pendingImages = new Set();
			const observer = new MutationObserver$1(async mutations => {
				mutations = mutations.filter(mutation => mutation.type == ATTRIBUTES_MUTATION_TYPE);
				if (mutations.length) {
					const updated = mutations.filter(mutation => {
						if (mutation.attributeName == "src") {
							mutation.target.setAttribute(helper$2.LAZY_SRC_ATTRIBUTE_NAME, mutation.target.src);
							mutation.target.addEventListener("load", onResourceLoad);
						}
						if (mutation.attributeName == "src" || mutation.attributeName == "srcset" ||
							(mutation.target.tagName && mutation.target.tagName.toUpperCase() == "SOURCE")) {
							return !mutation.target.classList || !mutation.target.classList.contains(helper$2.SINGLE_FILE_UI_ELEMENT_CLASS);
						}
					});
					if (updated.length) {
						loadingImages = true;
						await deferForceLazyLoadEnd(observer, options, cleanupAndResolve);
						if (!pendingImages.size) {
							await deferLazyLoadEnd(observer, options, cleanupAndResolve);
						}
					}
				}
			});
			await setIdleTimeout(options.loadDeferredImagesMaxIdleTime * 2);
			await deferForceLazyLoadEnd(observer, options, cleanupAndResolve);
			observer.observe(document$1, { subtree: true, childList: true, attributes: true });
			document$1.addEventListener(LOAD_IMAGE_EVENT, onImageLoadEvent);
			document$1.addEventListener(IMAGE_LOADED_EVENT, onImageLoadedEvent);
			loadDeferredImagesStart(options);

			async function setIdleTimeout(delay) {
				await setAsyncTimeout("idleTimeout", async () => {
					if (!loadingImages) {
						clearAsyncTimeout("loadTimeout");
						clearAsyncTimeout("maxTimeout");
						lazyLoadEnd(observer, options, cleanupAndResolve);
					} else if (idleTimeoutCalls < MAX_IDLE_TIMEOUT_CALLS) {
						idleTimeoutCalls++;
						clearAsyncTimeout("idleTimeout");
						await setIdleTimeout(Math.max(500, delay / 2));
					}
				}, delay, options.loadDeferredImagesNativeTimeout);
			}

			function onResourceLoad(event) {
				const element = event.target;
				element.removeAttribute(helper$2.LAZY_SRC_ATTRIBUTE_NAME);
				element.removeEventListener("load", onResourceLoad);
			}

			async function onImageLoadEvent(event) {
				loadingImages = true;
				await deferForceLazyLoadEnd(observer, options, cleanupAndResolve);
				await deferLazyLoadEnd(observer, options, cleanupAndResolve);
				if (event.detail) {
					pendingImages.add(event.detail);
				}
			}

			async function onImageLoadedEvent(event) {
				await deferForceLazyLoadEnd(observer, options, cleanupAndResolve);
				await deferLazyLoadEnd(observer, options, cleanupAndResolve);
				pendingImages.delete(event.detail);
				if (!pendingImages.size) {
					await deferLazyLoadEnd(observer, options, cleanupAndResolve);
				}
			}

			function cleanupAndResolve(value) {
				observer.disconnect();
				document$1.removeEventListener(LOAD_IMAGE_EVENT, onImageLoadEvent);
				document$1.removeEventListener(IMAGE_LOADED_EVENT, onImageLoadedEvent);
				resolve(value);
			}
		});
	}

	async function deferLazyLoadEnd(observer, options, resolve) {
		await setAsyncTimeout("loadTimeout", () => lazyLoadEnd(observer, options, resolve), options.loadDeferredImagesMaxIdleTime, options.loadDeferredImagesNativeTimeout);
	}

	async function deferForceLazyLoadEnd(observer, options, resolve) {
		await setAsyncTimeout("maxTimeout", async () => {
			await clearAsyncTimeout("loadTimeout");
			await lazyLoadEnd(observer, options, resolve);
		}, options.loadDeferredImagesMaxIdleTime * 10, options.loadDeferredImagesNativeTimeout);
	}

	async function lazyLoadEnd(observer, options, resolve) {
		await clearAsyncTimeout("idleTimeout");
		loadDeferredImagesEnd(options);
		await setAsyncTimeout("endTimeout", async () => {
			await clearAsyncTimeout("maxTimeout");
			resolve();
		}, options.loadDeferredImagesMaxIdleTime / 2, options.loadDeferredImagesNativeTimeout);
		observer.disconnect();
	}

	async function setAsyncTimeout(type, callback, delay, forceNativeTimeout) {
		if (browser$1 && browser$1.runtime && browser$1.runtime.sendMessage && !forceNativeTimeout) {
			if (!timeouts.get(type) || !timeouts.get(type).pending) {
				const timeoutData = { callback, pending: true };
				timeouts.set(type, timeoutData);
				try {
					await browser$1.runtime.sendMessage({ method: "singlefile.lazyTimeout.setTimeout", type, delay });
				} catch (error) {
					setRegularTimeout(type, callback, delay);
				}
				timeoutData.pending = false;
			}
		} else {
			setRegularTimeout(type, callback, delay);
		}
	}

	function setRegularTimeout(type, callback, delay) {
		const timeoutId = timeouts.get(type);
		if (timeoutId) {
			globalThis.clearTimeout(timeoutId);
		}
		timeouts.set(type, callback);
		globalThis.setTimeout(callback, delay);
	}

	async function clearAsyncTimeout(type) {
		if (browser$1 && browser$1.runtime && browser$1.runtime.sendMessage) {
			try {
				await browser$1.runtime.sendMessage({ method: "singlefile.lazyTimeout.clearTimeout", type });
			} catch (error) {
				clearRegularTimeout(type);
			}
		} else {
			clearRegularTimeout(type);
		}
	}

	function clearRegularTimeout(type) {
		const previousTimeoutId = timeouts.get(type);
		timeouts.delete(type);
		if (previousTimeoutId) {
			globalThis.clearTimeout(previousTimeoutId);
		}
	}

	/*
	 * Copyright 2010-2022 Gildas Lormeau
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


	const helper$1 = {
		ON_BEFORE_CAPTURE_EVENT_NAME,
		ON_AFTER_CAPTURE_EVENT_NAME,
		WIN_ID_ATTRIBUTE_NAME,
		WAIT_FOR_USERSCRIPT_PROPERTY_NAME,
		preProcessDoc,
		serialize: serialize$1,
		postProcessDoc,
		getShadowRoot
	};

	const FRAMES_CSS_SELECTOR = "iframe, frame, object[type=\"text/html\"][data]";
	const ALL_ELEMENTS_CSS_SELECTOR = "*";
	const INIT_REQUEST_MESSAGE = "singlefile.frameTree.initRequest";
	const ACK_INIT_REQUEST_MESSAGE = "singlefile.frameTree.ackInitRequest";
	const CLEANUP_REQUEST_MESSAGE = "singlefile.frameTree.cleanupRequest";
	const INIT_RESPONSE_MESSAGE = "singlefile.frameTree.initResponse";
	const TARGET_ORIGIN = "*";
	const TIMEOUT_INIT_REQUEST_MESSAGE = 5000;
	const TIMEOUT_INIT_RESPONSE_MESSAGE = 10000;
	const TOP_WINDOW_ID = "0";
	const WINDOW_ID_SEPARATOR = ".";
	const TOP_WINDOW = globalThis.window == globalThis.top;

	const browser = globalThis.browser;
	const top = globalThis.top;
	const MessageChannel = globalThis.MessageChannel;
	const document = globalThis.document;
	const JSON = globalThis.JSON;
	const MutationObserver = globalThis.MutationObserver;
	const DOMParser = globalThis.DOMParser;

	let sessions = globalThis.sessions;
	if (!sessions) {
		sessions = globalThis.sessions = new Map();
	}
	let windowId;
	if (TOP_WINDOW) {
		windowId = TOP_WINDOW_ID;
		if (browser && browser.runtime && browser.runtime.onMessage && browser.runtime.onMessage.addListener) {
			browser.runtime.onMessage.addListener(message => {
				if (message.method == INIT_RESPONSE_MESSAGE) {
					initResponse(message);
					return Promise.resolve({});
				} else if (message.method == ACK_INIT_REQUEST_MESSAGE) {
					clearFrameTimeout("requestTimeouts", message.sessionId, message.windowId);
					createFrameResponseTimeout(message.sessionId, message.windowId);
					return Promise.resolve({});
				}
			});
		}
	}
	init();
	new MutationObserver(init).observe(document, { childList: true });

	function init() {
		globalThis.addEventListener("message", async event => {
			if (typeof event.data == "string" && event.data.startsWith(MESSAGE_PREFIX)) {
				event.preventDefault();
				event.stopPropagation();
				const message = JSON.parse(event.data.substring(MESSAGE_PREFIX.length));
				if (message.method == INIT_REQUEST_MESSAGE) {
					if (event.source) {
						sendMessage(event.source, { method: ACK_INIT_REQUEST_MESSAGE, windowId: message.windowId, sessionId: message.sessionId });
					}
					if (!TOP_WINDOW) {
						globalThis.stop();
						if (message.options.loadDeferredImages) {
							process$1(message.options);
						}
						await initRequestAsync(message);
					}
				} else if (message.method == ACK_INIT_REQUEST_MESSAGE) {
					clearFrameTimeout("requestTimeouts", message.sessionId, message.windowId);
					createFrameResponseTimeout(message.sessionId, message.windowId);
				} else if (message.method == CLEANUP_REQUEST_MESSAGE) {
					cleanupRequest(message);
				} else if (message.method == INIT_RESPONSE_MESSAGE && sessions.get(message.sessionId)) {
					const port = event.ports[0];
					port.onmessage = event => initResponse(event.data);
				}
			}
		}, true);
	}

	function getAsync(options) {
		const sessionId = getNewSessionId();
		options = JSON.parse(JSON.stringify(options));
		return new Promise(resolve => {
			sessions.set(sessionId, {
				frames: [],
				requestTimeouts: {},
				responseTimeouts: {},
				resolve: frames => {
					frames.sessionId = sessionId;
					resolve(frames);
				}
			});
			initRequestAsync({ windowId, sessionId, options });
		});
	}

	function getSync(options) {
		const sessionId = getNewSessionId();
		options = JSON.parse(JSON.stringify(options));
		sessions.set(sessionId, {
			frames: [],
			requestTimeouts: {},
			responseTimeouts: {}
		});
		initRequestSync({ windowId, sessionId, options });
		const frames = sessions.get(sessionId).frames;
		frames.sessionId = sessionId;
		return frames;
	}

	function cleanup(sessionId) {
		sessions.delete(sessionId);
		cleanupRequest({ windowId, sessionId, options: { sessionId } });
	}

	function getNewSessionId() {
		return globalThis.crypto.getRandomValues(new Uint32Array(32)).join("");
	}

	function initRequestSync(message) {
		const sessionId = message.sessionId;
		const waitForUserScript = globalThis[helper$1.WAIT_FOR_USERSCRIPT_PROPERTY_NAME];
		delete globalThis._singleFile_cleaningUp;
		if (!TOP_WINDOW) {
			windowId = globalThis.frameId = message.windowId;
		}
		processFrames(document, message.options, windowId, sessionId);
		if (!TOP_WINDOW) {
			if (message.options.userScriptEnabled && waitForUserScript) {
				waitForUserScript(helper$1.ON_BEFORE_CAPTURE_EVENT_NAME, message.options);
			}
			sendInitResponse({ frames: [getFrameData(document, globalThis, windowId, message.options, message.scrolling)], sessionId, requestedFrameId: document.documentElement.dataset.requestedFrameId && windowId });
			if (message.options.userScriptEnabled && waitForUserScript) {
				waitForUserScript(helper$1.ON_AFTER_CAPTURE_EVENT_NAME, message.options);
			}
			delete document.documentElement.dataset.requestedFrameId;
		}
	}

	async function initRequestAsync(message) {
		const sessionId = message.sessionId;
		const waitForUserScript = globalThis[helper$1.WAIT_FOR_USERSCRIPT_PROPERTY_NAME];
		delete globalThis._singleFile_cleaningUp;
		if (!TOP_WINDOW) {
			windowId = globalThis.frameId = message.windowId;
		}
		processFrames(document, message.options, windowId, sessionId);
		if (!TOP_WINDOW) {
			if (message.options.userScriptEnabled && waitForUserScript) {
				await waitForUserScript(helper$1.ON_BEFORE_CAPTURE_EVENT_NAME, message.options);
			}
			sendInitResponse({ frames: [getFrameData(document, globalThis, windowId, message.options, message.scrolling)], sessionId, requestedFrameId: document.documentElement.dataset.requestedFrameId && windowId });
			if (message.options.userScriptEnabled && waitForUserScript) {
				await waitForUserScript(helper$1.ON_AFTER_CAPTURE_EVENT_NAME, message.options);
			}
			delete document.documentElement.dataset.requestedFrameId;
		}
	}

	function cleanupRequest(message) {
		if (!globalThis._singleFile_cleaningUp) {
			globalThis._singleFile_cleaningUp = true;
			const sessionId = message.sessionId;
			cleanupFrames(getFrames(document), message.windowId, sessionId);
		}
	}

	function initResponse(message) {
		message.frames.forEach(frameData => clearFrameTimeout("responseTimeouts", message.sessionId, frameData.windowId));
		const windowData = sessions.get(message.sessionId);
		if (windowData) {
			if (message.requestedFrameId) {
				windowData.requestedFrameId = message.requestedFrameId;
			}
			message.frames.forEach(messageFrameData => {
				let frameData = windowData.frames.find(frameData => messageFrameData.windowId == frameData.windowId);
				if (!frameData) {
					frameData = { windowId: messageFrameData.windowId };
					windowData.frames.push(frameData);
				}
				if (!frameData.processed) {
					frameData.content = messageFrameData.content;
					frameData.baseURI = messageFrameData.baseURI;
					frameData.title = messageFrameData.title;
					frameData.url = messageFrameData.url;
					frameData.canvases = messageFrameData.canvases;
					frameData.fonts = messageFrameData.fonts;
					frameData.worklets = messageFrameData.worklets;
					frameData.stylesheets = messageFrameData.stylesheets;
					frameData.images = messageFrameData.images;
					frameData.posters = messageFrameData.posters;
					frameData.videos = messageFrameData.videos;
					frameData.usedFonts = messageFrameData.usedFonts;
					frameData.shadowRoots = messageFrameData.shadowRoots;
					frameData.processed = messageFrameData.processed;
					frameData.scrollPosition = messageFrameData.scrollPosition;
					frameData.scrolling = messageFrameData.scrolling;
					frameData.adoptedStyleSheets = messageFrameData.adoptedStyleSheets;
				}
			});
			const remainingFrames = windowData.frames.filter(frameData => !frameData.processed).length;
			if (!remainingFrames) {
				windowData.frames = windowData.frames.sort((frame1, frame2) => frame2.windowId.split(WINDOW_ID_SEPARATOR).length - frame1.windowId.split(WINDOW_ID_SEPARATOR).length);
				if (windowData.resolve) {
					if (windowData.requestedFrameId) {
						windowData.frames.forEach(frameData => {
							if (frameData.windowId == windowData.requestedFrameId) {
								frameData.requestedFrame = true;
							}
						});
					}
					windowData.resolve(windowData.frames);
				}
			}
		}
	}
	function processFrames(doc, options, parentWindowId, sessionId) {
		const frameElements = getFrames(doc);
		processFramesAsync(doc, frameElements, options, parentWindowId, sessionId);
		if (frameElements.length) {
			processFramesSync(doc, frameElements, options, parentWindowId, sessionId);
		}
	}

	function processFramesAsync(doc, frameElements, options, parentWindowId, sessionId) {
		const frames = [];
		let requestTimeouts;
		if (sessions.get(sessionId)) {
			requestTimeouts = sessions.get(sessionId).requestTimeouts;
		} else {
			requestTimeouts = {};
			sessions.set(sessionId, { requestTimeouts });
		}
		frameElements.forEach((frameElement, frameIndex) => {
			const windowId = parentWindowId + WINDOW_ID_SEPARATOR + frameIndex;
			frameElement.setAttribute(helper$1.WIN_ID_ATTRIBUTE_NAME, windowId);
			frames.push({ windowId });
		});
		sendInitResponse({ frames, sessionId, requestedFrameId: doc.documentElement.dataset.requestedFrameId && parentWindowId });
		frameElements.forEach((frameElement, frameIndex) => {
			const windowId = parentWindowId + WINDOW_ID_SEPARATOR + frameIndex;
			try {
				sendMessage(frameElement.contentWindow, { method: INIT_REQUEST_MESSAGE, windowId, sessionId, options, scrolling: frameElement.scrolling });
			} catch (error) {
				// ignored
			}
			requestTimeouts[windowId] = globalThis.setTimeout(() => sendInitResponse({ frames: [{ windowId, processed: true }], sessionId }), TIMEOUT_INIT_REQUEST_MESSAGE);
		});
		delete doc.documentElement.dataset.requestedFrameId;
	}

	function processFramesSync(doc, frameElements, options, parentWindowId, sessionId) {
		const frames = [];
		frameElements.forEach((frameElement, frameIndex) => {
			const windowId = parentWindowId + WINDOW_ID_SEPARATOR + frameIndex;
			let frameDoc, frameWindow;
			try {
				frameDoc = frameElement.contentDocument;
				frameWindow = frameElement.contentWindow;
				frameWindow.stop();
			} catch (error) {
				// ignored
			}
			const srcdoc = frameElement.getAttribute("srcdoc");
			if (!frameDoc && srcdoc) {
				const doc = new DOMParser().parseFromString(srcdoc, "text/html");
				frameDoc = doc;
				frameWindow = globalThis;
			}
			if (frameDoc) {
				try {
					clearFrameTimeout("requestTimeouts", sessionId, windowId);
					processFrames(frameDoc, options, windowId, sessionId);
					frames.push(getFrameData(frameDoc, frameWindow, windowId, options, frameElement.scrolling));
				} catch (error) {
					frames.push({ windowId, processed: true });
				}
			}
		});
		sendInitResponse({ frames, sessionId, requestedFrameId: doc.documentElement.dataset.requestedFrameId && parentWindowId });
		delete doc.documentElement.dataset.requestedFrameId;
	}

	function clearFrameTimeout(type, sessionId, windowId) {
		const session = sessions.get(sessionId);
		if (session && session[type]) {
			const timeout = session[type][windowId];
			if (timeout) {
				globalThis.clearTimeout(timeout);
				delete session[type][windowId];
			}
		}
	}

	function createFrameResponseTimeout(sessionId, windowId) {
		const session = sessions.get(sessionId);
		if (session && session.responseTimeouts) {
			session.responseTimeouts[windowId] = globalThis.setTimeout(() => sendInitResponse({ frames: [{ windowId: windowId, processed: true }], sessionId: sessionId }), TIMEOUT_INIT_RESPONSE_MESSAGE);
		}
	}

	function cleanupFrames(frameElements, parentWindowId, sessionId) {
		frameElements.forEach((frameElement, frameIndex) => {
			const windowId = parentWindowId + WINDOW_ID_SEPARATOR + frameIndex;
			frameElement.removeAttribute(helper$1.WIN_ID_ATTRIBUTE_NAME);
			try {
				sendMessage(frameElement.contentWindow, { method: CLEANUP_REQUEST_MESSAGE, windowId, sessionId });
			} catch (error) {
				// ignored
			}
		});
		frameElements.forEach((frameElement, frameIndex) => {
			const windowId = parentWindowId + WINDOW_ID_SEPARATOR + frameIndex;
			let frameDoc;
			try {
				frameDoc = frameElement.contentDocument;
			} catch (error) {
				// ignored
			}
			if (frameDoc) {
				try {
					cleanupFrames(getFrames(frameDoc), windowId, sessionId);
				} catch (error) {
					// ignored
				}
			}
		});
	}

	function sendInitResponse(message) {
		message.method = INIT_RESPONSE_MESSAGE;
		try {
			top.singlefile.processors.frameTree.initResponse(message);
		} catch (error) {
			sendMessage(top, message, true);
		}
	}

	function sendMessage(targetWindow, message, useChannel) {
		if (targetWindow == top && browser && browser.runtime && browser.runtime.sendMessage) {
			browser.runtime.sendMessage(message);
		} else {
			if (useChannel) {
				const channel = new MessageChannel();
				targetWindow.postMessage(MESSAGE_PREFIX + JSON.stringify({ method: message.method, sessionId: message.sessionId }), TARGET_ORIGIN, [channel.port2]);
				channel.port1.postMessage(message);
			} else {
				targetWindow.postMessage(MESSAGE_PREFIX + JSON.stringify(message), TARGET_ORIGIN);
			}
		}
	}

	function getFrameData(document, globalThis, windowId, options, scrolling) {
		const docData = helper$1.preProcessDoc(document, globalThis, options);
		const content = helper$1.serialize(document);
		helper$1.postProcessDoc(document, docData.markedElements, docData.invalidElements);
		const baseURI = document.baseURI.split("#")[0];
		return {
			windowId,
			content,
			baseURI,
			url: document.documentURI,
			title: document.title,
			canvases: docData.canvases,
			fonts: docData.fonts,
			worklets: docData.worklets,
			stylesheets: docData.stylesheets,
			images: docData.images,
			posters: docData.posters,
			videos: docData.videos,
			usedFonts: docData.usedFonts,
			shadowRoots: docData.shadowRoots,
			scrollPosition: docData.scrollPosition,
			scrolling,
			adoptedStyleSheets: docData.adoptedStyleSheets,
			processed: true
		};
	}

	function getFrames(document) {
		let frames = Array.from(document.querySelectorAll(FRAMES_CSS_SELECTOR));
		document.querySelectorAll(ALL_ELEMENTS_CSS_SELECTOR).forEach(element => {
			const shadowRoot = helper$1.getShadowRoot(element);
			if (shadowRoot) {
				frames = frames.concat(...shadowRoot.querySelectorAll(FRAMES_CSS_SELECTOR));
			}
		});
		return frames;
	}

	var frameTree = /*#__PURE__*/Object.freeze({
		__proto__: null,
		TIMEOUT_INIT_REQUEST_MESSAGE: TIMEOUT_INIT_REQUEST_MESSAGE,
		cleanup: cleanup,
		getAsync: getAsync,
		getSync: getSync,
		initResponse: initResponse
	});

	/*
	 * Copyright 2010-2022 Gildas Lormeau
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

	const SELF_CLOSED_TAG_NAMES = ["AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR"];

	const Node_ELEMENT_NODE = 1;
	const Node_TEXT_NODE = 3;
	const Node_COMMENT_NODE = 8;

	// see https://www.w3.org/TR/html5/syntax.html#optional-tags
	const OMITTED_START_TAGS = [
		{ tagName: "HEAD", accept: element => !element.childNodes.length || element.childNodes[0].nodeType == Node_ELEMENT_NODE },
		{ tagName: "BODY", accept: element => !element.childNodes.length }
	];
	const OMITTED_END_TAGS = [
		{ tagName: "HTML", accept: next => !next || next.nodeType != Node_COMMENT_NODE },
		{ tagName: "HEAD", accept: next => !next || (next.nodeType != Node_COMMENT_NODE && (next.nodeType != Node_TEXT_NODE || !startsWithSpaceChar(next.textContent))) },
		{ tagName: "BODY", accept: next => !next || next.nodeType != Node_COMMENT_NODE },
		{ tagName: "LI", accept: (next, element) => (!next && element.parentElement && (getTagName(element.parentElement) == "UL" || getTagName(element.parentElement) == "OL")) || (next && ["LI"].includes(getTagName(next))) },
		{ tagName: "DT", accept: next => !next || ["DT", "DD"].includes(getTagName(next)) },
		{ tagName: "P", accept: next => next && ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DETAILS", "DIV", "DL", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "MAIN", "NAV", "OL", "P", "PRE", "SECTION", "TABLE", "UL"].includes(getTagName(next)) },
		{ tagName: "DD", accept: next => !next || ["DT", "DD"].includes(getTagName(next)) },
		{ tagName: "RT", accept: next => !next || ["RT", "RP"].includes(getTagName(next)) },
		{ tagName: "RP", accept: next => !next || ["RT", "RP"].includes(getTagName(next)) },
		{ tagName: "OPTGROUP", accept: next => !next || ["OPTGROUP"].includes(getTagName(next)) },
		{ tagName: "OPTION", accept: next => !next || ["OPTION", "OPTGROUP"].includes(getTagName(next)) },
		{ tagName: "COLGROUP", accept: next => !next || (next.nodeType != Node_COMMENT_NODE && (next.nodeType != Node_TEXT_NODE || !startsWithSpaceChar(next.textContent))) },
		{ tagName: "CAPTION", accept: next => !next || (next.nodeType != Node_COMMENT_NODE && (next.nodeType != Node_TEXT_NODE || !startsWithSpaceChar(next.textContent))) },
		{ tagName: "THEAD", accept: next => !next || ["TBODY", "TFOOT"].includes(getTagName(next)) },
		{ tagName: "TBODY", accept: next => !next || ["TBODY", "TFOOT"].includes(getTagName(next)) },
		{ tagName: "TFOOT", accept: next => !next },
		{ tagName: "TR", accept: next => !next || ["TR"].includes(getTagName(next)) },
		{ tagName: "TD", accept: next => !next || ["TD", "TH"].includes(getTagName(next)) },
		{ tagName: "TH", accept: next => !next || ["TD", "TH"].includes(getTagName(next)) }
	];
	const TEXT_NODE_TAGS = ["STYLE", "SCRIPT", "XMP", "IFRAME", "NOEMBED", "NOFRAMES", "PLAINTEXT", "NOSCRIPT"];

	function process(doc, compressHTML) {
		const docType = doc.doctype;
		let docTypeString = "";
		if (docType) {
			docTypeString = "<!DOCTYPE " + docType.nodeName;
			if (docType.publicId) {
				docTypeString += " PUBLIC \"" + docType.publicId + "\"";
				if (docType.systemId)
					docTypeString += " \"" + docType.systemId + "\"";
			} else if (docType.systemId)
				docTypeString += " SYSTEM \"" + docType.systemId + "\"";
			if (docType.internalSubset)
				docTypeString += " [" + docType.internalSubset + "]";
			docTypeString += "> ";
		}
		return docTypeString + serialize(doc.documentElement, compressHTML);
	}

	function serialize(node, compressHTML, isSVG) {
		if (node.nodeType == Node_TEXT_NODE) {
			return serializeTextNode(node);
		} else if (node.nodeType == Node_COMMENT_NODE) {
			return serializeCommentNode(node);
		} else if (node.nodeType == Node_ELEMENT_NODE) {
			return serializeElement(node, compressHTML, isSVG);
		}
	}

	function serializeTextNode(textNode) {
		const parentNode = textNode.parentNode;
		let parentTagName;
		if (parentNode && parentNode.nodeType == Node_ELEMENT_NODE) {
			parentTagName = getTagName(parentNode);
		}
		if (!parentTagName || TEXT_NODE_TAGS.includes(parentTagName)) {
			if ((parentTagName == "SCRIPT" && (!parentNode.type || parentNode.type == "text/javascript")) || parentTagName == "STYLE") {
				return textNode.textContent.replace(/<\//gi, "<\\/").replace(/\/>/gi, "\\/>");
			}
			return textNode.textContent;
		} else {
			return textNode.textContent.replace(/&/g, "&amp;").replace(/\u00a0/g, "&nbsp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		}
	}

	function serializeCommentNode(commentNode) {
		return "<!--" + commentNode.textContent + "-->";
	}

	function serializeElement(element, compressHTML, isSVG) {
		const tagName = getTagName(element);
		const omittedStartTag = compressHTML && OMITTED_START_TAGS.find(omittedStartTag => tagName == getTagName(omittedStartTag) && omittedStartTag.accept(element));
		let content = "";
		if (!omittedStartTag || element.attributes.length) {
			content = "<" + tagName.toLowerCase();
			Array.from(element.attributes).forEach(attribute => content += serializeAttribute(attribute, element, compressHTML));
			content += ">";
		}
		if (tagName == "TEMPLATE" && !element.childNodes.length) {
			content += element.innerHTML;
		} else {
			Array.from(element.childNodes).forEach(childNode => content += serialize(childNode, compressHTML, isSVG || tagName == "svg"));
		}
		const omittedEndTag = compressHTML && OMITTED_END_TAGS.find(omittedEndTag => tagName == getTagName(omittedEndTag) && omittedEndTag.accept(element.nextSibling, element));
		if (isSVG || (!omittedEndTag && !SELF_CLOSED_TAG_NAMES.includes(tagName))) {
			content += "</" + tagName.toLowerCase() + ">";
		}
		return content;
	}

	function serializeAttribute(attribute, element, compressHTML) {
		const name = attribute.name;
		let content = "";
		if (!name.match(/["'>/=]/)) {
			let value = attribute.value;
			if (compressHTML && name == "class") {
				value = Array.from(element.classList).map(className => className.trim()).join(" ");
			}
			let simpleQuotesValue;
			value = value.replace(/&/g, "&amp;").replace(/\u00a0/g, "&nbsp;");
			if (value.includes("\"")) {
				if (value.includes("'") || !compressHTML) {
					value = value.replace(/"/g, "&quot;");
				} else {
					simpleQuotesValue = true;
				}
			}
			const invalidUnquotedValue = !compressHTML || value.match(/[ \t\n\f\r'"`=<>]/);
			content += " ";
			if (!attribute.namespace) {
				content += name;
			} else if (attribute.namespaceURI == "http://www.w3.org/XML/1998/namespace") {
				content += "xml:" + name;
			} else if (attribute.namespaceURI == "http://www.w3.org/2000/xmlns/") {
				if (name !== "xmlns") {
					content += "xmlns:";
				}
				content += name;
			} else if (attribute.namespaceURI == "http://www.w3.org/1999/xlink") {
				content += "xlink:" + name;
			} else {
				content += name;
			}
			if (value != "") {
				content += "=";
				if (invalidUnquotedValue) {
					content += simpleQuotesValue ? "'" : "\"";
				}
				content += value;
				if (invalidUnquotedValue) {
					content += simpleQuotesValue ? "'" : "\"";
				}
			}
		}
		return content;
	}

	function startsWithSpaceChar(textContent) {
		return Boolean(textContent.match(/^[ \t\n\f\r]/));
	}

	function getTagName(element) {
		return element.tagName && element.tagName.toUpperCase();
	}

	/*
	 * Copyright 2010-2022 Gildas Lormeau
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


	const processors = { frameTree };
	const helper = {
		COMMENT_HEADER,
		COMMENT_HEADER_LEGACY,
		ON_BEFORE_CAPTURE_EVENT_NAME,
		ON_AFTER_CAPTURE_EVENT_NAME,
		WAIT_FOR_USERSCRIPT_PROPERTY_NAME,
		preProcessDoc,
		postProcessDoc,
		serialize(doc, compressHTML) {
			return process(doc, compressHTML);
		},
		getShadowRoot
	};

	initUserScriptHandler();

	exports.helper = helper;
	exports.processors = processors;

}));
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

	/* global browser, globalThis, document, location, setTimeout, XMLHttpRequest, Node, DOMParser, Blob, URL, Image, OffscreenCanvas */

	const MAX_CONTENT_SIZE = 32 * (1024 * 1024);

	const singlefile = globalThis.singlefileBootstrap;
	const pendingResponses = new Map();

	let unloadListenerAdded, optionsAutoSave, tabId, tabIndex, autoSaveEnabled, autoSaveTimeout, autoSavingPage, pageAutoSaved, previousLocationHref, savedPageDetected, compressContent, extractDataFromPageTags, insertTextBody, insertMetaCSP;
	singlefile.pageInfo = {
		updatedResources: {},
		visitDate: new Date()
	};
	browser.runtime.sendMessage({ method: "bootstrap.init" }).then(message => {
		optionsAutoSave = message.optionsAutoSave;
		const options = message.options;
		tabId = message.tabId;
		tabIndex = message.tabIndex;
		autoSaveEnabled = message.autoSaveEnabled;
		if (options && options.autoOpenEditor && detectSavedPage(document)) {
			if (document.readyState == "loading") {
				document.addEventListener("DOMContentLoaded", () => openEditor(document));
			} else {
				openEditor(document);
			}
		} else {
			if (document.readyState == "loading") {
				document.addEventListener("DOMContentLoaded", refresh);
			} else {
				refresh();
			}
		}
	});
	browser.runtime.onMessage.addListener(message => {
		if ((autoSaveEnabled && message.method == "content.autosave") ||
			message.method == "content.maybeInit" ||
			message.method == "content.init" ||
			message.method == "content.openEditor" ||
			message.method == "devtools.resourceCommitted" ||
			message.method == "singlefile.fetchResponse") {
			return onMessage(message);
		}
	});
	document.addEventListener("DOMContentLoaded", init, false);
	if (globalThis.window == globalThis.top && location && location.href && (location.href.startsWith("file://") || location.href.startsWith("content://"))) {
		if (document.readyState == "loading") {
			document.addEventListener("DOMContentLoaded", extractFile, false);
		} else {
			extractFile();
		}
	}

	async function extractFile() {
		if (document.documentElement.dataset && document.documentElement.dataset.sfz !== undefined) {
			const data = await getContent();
			document.querySelectorAll("#sfz-error-message").forEach(element => element.remove());
			executeBootstrap(data);
		} else {
			if ((document.body && document.body.childNodes.length == 1 && document.body.childNodes[0].tagName == "PRE" && /<html[^>]* data-sfz[^>]*>/i.test(document.body.childNodes[0].textContent))) {
				const doc = (new DOMParser()).parseFromString(document.body.childNodes[0].textContent, "text/html");
				document.replaceChild(doc.documentElement, document.documentElement);
				document.querySelectorAll("script").forEach(element => {
					const scriptElement = document.createElement("script");
					scriptElement.textContent = element.textContent;
					element.parentElement.replaceChild(scriptElement, element);
				});
				await extractFile();
			}
		}
	}

	function getContent() {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open("GET", location.href);
			xhr.send();
			xhr.responseType = "arraybuffer";
			xhr.onload = () => resolve(new Uint8Array(xhr.response));
			xhr.onerror = () => {
				const errorMessageElement = document.getElementById("sfz-error-message");
				if (errorMessageElement) {
					errorMessageElement.remove();
				}
				const requestId = pendingResponses.size;
				pendingResponses.set(requestId, { resolve, reject });
				browser.runtime.sendMessage({ method: "singlefile.fetch", requestId, url: location.href });
			};
		});
	}

	function executeBootstrap(data) {
		document.dispatchEvent(new CustomEvent("single-file-bootstrap", { detail: { data } }));
	}

	async function onMessage(message) {
		if (autoSaveEnabled && message.method == "content.autosave") {
			initAutoSavePage(message);
			return {};
		}
		if (message.method == "content.maybeInit") {
			init();
			return {};
		}
		if (message.method == "content.init") {
			optionsAutoSave = message.options;
			autoSaveEnabled = message.autoSaveEnabled;
			refresh();
			return {};
		}
		if (message.method == "content.openEditor") {
			if (detectSavedPage(document)) {
				openEditor(document);
			} else {
				refresh();
			}
			return {};
		}
		if (message.method == "devtools.resourceCommitted") {
			singlefile.pageInfo.updatedResources[message.url] = { content: message.content, type: message.type, encoding: message.encoding };
			return {};
		}
		if (message.method == "singlefile.fetchResponse") {
			return await onFetchResponse(message);
		}
	}

	async function onFetchResponse(message) {
		const pendingResponse = pendingResponses.get(message.requestId);
		if (pendingResponse) {
			if (message.error) {
				pendingResponse.reject(new Error(message.error));
				pendingResponses.delete(message.requestId);
			} else {
				if (message.truncated) {
					if (pendingResponse.array) {
						pendingResponse.array = pendingResponse.array.concat(message.array);
					} else {
						pendingResponse.array = message.array;
						pendingResponses.set(message.requestId, pendingResponse);
					}
					if (message.finished) {
						message.array = pendingResponse.array;
					}
				}
				if (!message.truncated || message.finished) {
					pendingResponse.resolve(message.array);
					pendingResponses.delete(message.requestId);
				}
			}
			return {};
		}
	}

	function init() {
		const legacyInfobarElement = document.querySelector("singlefile-infobar");
		if (legacyInfobarElement) {
			legacyInfobarElement.remove();
		}
		if (previousLocationHref != location.href && !singlefile.pageInfo.processing) {
			pageAutoSaved = false;
			previousLocationHref = location.href;
			browser.runtime.sendMessage({ method: "tabs.init", savedPageDetected: detectSavedPage(document) }).catch(() => { });
			browser.runtime.sendMessage({ method: "ui.processInit" }).catch(() => { });
		}
	}

	async function initAutoSavePage(message) {
		optionsAutoSave = message.options;
		if (document.readyState != "complete") {
			await new Promise(resolve => globalThis.addEventListener("load", resolve));
		}
		await autoSavePage();
		if (optionsAutoSave.autoSaveRepeat) {
			setTimeout(() => {
				if (autoSaveEnabled && !autoSavingPage) {
					pageAutoSaved = false;
					optionsAutoSave.autoSaveDelay = 0;
					onMessage(message);
				}
			}, optionsAutoSave.autoSaveRepeatDelay * 1000);
		}
	}

	async function autoSavePage() {
		const helper = singlefile.helper;
		if ((!autoSavingPage || autoSaveTimeout) && !pageAutoSaved) {
			autoSavingPage = true;
			if (optionsAutoSave.autoSaveDelay && !autoSaveTimeout) {
				await new Promise(resolve => autoSaveTimeout = setTimeout(resolve, optionsAutoSave.autoSaveDelay * 1000));
				await autoSavePage();
			} else {
				const waitForUserScript = globalThis[helper.WAIT_FOR_USERSCRIPT_PROPERTY_NAME];
				let frames = [];
				let framesSessionId;
				autoSaveTimeout = null;
				if (!optionsAutoSave.removeFrames && globalThis.frames && globalThis.frames.length) {
					frames = await singlefile.processors.frameTree.getAsync(optionsAutoSave);
				}
				framesSessionId = frames && frames.sessionId;
				if (optionsAutoSave.userScriptEnabled && waitForUserScript) {
					await waitForUserScript(helper.ON_BEFORE_CAPTURE_EVENT_NAME);
				}
				const docData = helper.preProcessDoc(document, globalThis, optionsAutoSave);
				savePage(docData, frames);
				if (framesSessionId) {
					singlefile.processors.frameTree.cleanup(framesSessionId);
				}
				helper.postProcessDoc(document, docData.markedElements, docData.invalidElements);
				if (optionsAutoSave.userScriptEnabled && waitForUserScript) {
					await waitForUserScript(helper.ON_AFTER_CAPTURE_EVENT_NAME);
				}
				pageAutoSaved = true;
				autoSavingPage = false;
			}
		}
	}

	function refresh() {
		if (autoSaveEnabled && optionsAutoSave && (optionsAutoSave.autoSaveUnload || optionsAutoSave.autoSaveLoadOrUnload || optionsAutoSave.autoSaveDiscard || optionsAutoSave.autoSaveRemove)) {
			if (!unloadListenerAdded) {
				globalThis.addEventListener("unload", onUnload);
				document.addEventListener("visibilitychange", onVisibilityChange);
				unloadListenerAdded = true;
			}
		} else {
			globalThis.removeEventListener("unload", onUnload);
			document.removeEventListener("visibilitychange", onVisibilityChange);
			unloadListenerAdded = false;
		}
	}

	function onVisibilityChange() {
		if (document.visibilityState == "hidden" && optionsAutoSave.autoSaveDiscard) {
			autoSaveUnloadedPage({ autoSaveDiscard: optionsAutoSave.autoSaveDiscard });
		}
	}

	function onUnload() {
		if (!pageAutoSaved && (optionsAutoSave.autoSaveUnload || optionsAutoSave.autoSaveLoadOrUnload || optionsAutoSave.autoSaveRemove)) {
			autoSaveUnloadedPage({ autoSaveUnload: optionsAutoSave.autoSaveUnload, autoSaveRemove: optionsAutoSave.autoSaveRemove });
		}
	}

	function autoSaveUnloadedPage({ autoSaveUnload, autoSaveDiscard, autoSaveRemove }) {
		const helper = singlefile.helper;
		const waitForUserScript = globalThis[helper.WAIT_FOR_USERSCRIPT_PROPERTY_NAME];
		let frames = [];
		if (!optionsAutoSave.removeFrames && globalThis.frames && globalThis.frames.length) {
			frames = singlefile.processors.frameTree.getSync(optionsAutoSave);
		}
		if (optionsAutoSave.userScriptEnabled && waitForUserScript) {
			waitForUserScript(helper.ON_BEFORE_CAPTURE_EVENT_NAME);
		}
		const docData = helper.preProcessDoc(document, globalThis, optionsAutoSave);
		savePage(docData, frames, { autoSaveUnload, autoSaveDiscard, autoSaveRemove });
	}

	function savePage(docData, frames, { autoSaveUnload, autoSaveDiscard, autoSaveRemove } = {}) {
		const helper = singlefile.helper;
		const updatedResources = singlefile.pageInfo.updatedResources;
		const visitDate = singlefile.pageInfo.visitDate.getTime();
		Object.keys(updatedResources).forEach(url => updatedResources[url].retrieved = false);
		browser.runtime.sendMessage({
			method: "autosave.save",
			tabId,
			tabIndex,
			taskId: optionsAutoSave.taskId,
			content: helper.serialize(document),
			canvases: docData.canvases,
			fonts: docData.fonts,
			stylesheets: docData.stylesheets,
			images: docData.images,
			posters: docData.posters,
			usedFonts: docData.usedFonts,
			shadowRoots: docData.shadowRoots,
			videos: docData.videos,
			referrer: docData.referrer,
			adoptedStyleSheets: docData.adoptedStyleSheets,
			worklets: docData.worklets,
			frames: frames,
			url: location.href,
			updatedResources,
			visitDate,
			autoSaveUnload,
			autoSaveDiscard,
			autoSaveRemove
		});
	}

	async function openEditor(document) {
		let content;
		if (compressContent) {
			content = await getContent();
		} else {
			serializeShadowRoots(document);
			content = singlefile.helper.serialize(document);
		}
		for (let blockIndex = 0; blockIndex * MAX_CONTENT_SIZE < content.length; blockIndex++) {
			const message = {
				method: "editor.open",
				filename: decodeURIComponent(location.href.match(/^.*\/(.*)$/)[1]),
				compressContent,
				extractDataFromPageTags,
				insertTextBody,
				insertMetaCSP,
				selfExtractingArchive: compressContent
			};
			message.truncated = content.length > MAX_CONTENT_SIZE;
			if (message.truncated) {
				message.finished = (blockIndex + 1) * MAX_CONTENT_SIZE > content.length;
				if (content instanceof Uint8Array) {
					message.content = Array.from(content.subarray(blockIndex * MAX_CONTENT_SIZE, (blockIndex + 1) * MAX_CONTENT_SIZE));
				} else {
					message.content = content.substring(blockIndex * MAX_CONTENT_SIZE, (blockIndex + 1) * MAX_CONTENT_SIZE);
				}
			} else {
				message.embeddedImage = await extractEmbeddedImage(content);
				message.content = content instanceof Uint8Array ? Array.from(content) : content;
			}
			await browser.runtime.sendMessage(message);
		}
	}

	async function extractEmbeddedImage(content) {
		if (content[0] == 0x89 && content[1] == 0x50 && content[2] == 0x4E && content[3] == 0x47) {
			let blob = new Blob([new Uint8Array(content)], { type: "image/png" });
			const blobURI = URL.createObjectURL(blob);
			const image = new Image();
			image.src = blobURI;
			await new Promise((resolve, reject) => {
				image.onload = resolve;
				image.onerror = reject;
			});
			const canvas = new OffscreenCanvas(image.width, image.height);
			const context = canvas.getContext("2d");
			context.drawImage(image, 0, 0);
			blob = await canvas.convertToBlob({ type: "image/png" });
			const arrayBuffer = await blob.arrayBuffer();
			return Array.from(new Uint8Array(arrayBuffer));
		}
	}

	function detectSavedPage(document) {
		if (savedPageDetected === undefined) {
			const helper = singlefile.helper;
			const firstDocumentChild = document.documentElement.firstChild;
			compressContent = document.documentElement.dataset && document.documentElement.dataset.sfz == "";
			extractDataFromPageTags = Boolean(document.querySelector("sfz-extra-data"));
			insertTextBody = Boolean(document.querySelector("body > main[hidden]"));
			insertMetaCSP = Boolean(document.querySelector("meta[http-equiv=content-security-policy]"));
			savedPageDetected = compressContent || (
				firstDocumentChild.nodeType == Node.COMMENT_NODE &&
				(firstDocumentChild.textContent.includes(helper.COMMENT_HEADER) || firstDocumentChild.textContent.includes(helper.COMMENT_HEADER_LEGACY)));
		}
		return savedPageDetected;
	}

	function serializeShadowRoots(node) {
		const SHADOWROOT_ATTRIBUTE_NAME = "shadowrootmode";
		node.querySelectorAll("*").forEach(element => {
			const shadowRoot = singlefile.helper.getShadowRoot(element);
			if (shadowRoot) {
				serializeShadowRoots(shadowRoot);
				const templateElement = document.createElement("template");
				templateElement.setAttribute(SHADOWROOT_ATTRIBUTE_NAME, "open");
				Array.from(shadowRoot.childNodes).forEach(childNode => templateElement.appendChild(childNode));
				element.appendChild(templateElement);
			}
		});
	}

})();
!function(){"use strict";const n="single-file-infobar",o="\n.infobar,\n.infobar .infobar-icon,\n.infobar .infobar-link-icon {\n  min-inline-size: 28px;\n  min-block-size: 28px;\n  box-sizing: border-box;\n}\n\n.infobar,\n.infobar .infobar-close-icon,\n.infobar .infobar-link-icon {\n  opacity: 0.7;\n  transition: opacity 250ms;\n}\n\n.infobar:hover,\n.infobar .infobar-close-icon:hover,\n.infobar .infobar-link-icon:hover {\n  opacity: 1;\n}\n\n.infobar,\n.infobar-content {\n  display: flex;\n}\n\n.infobar {\n  position: fixed;\n  max-height: calc(100% - 32px);\n  top: 16px;\n  right: 16px;\n  margin-inline-start: 16px;\n  margin-block-end: 16px;\n  color: #2d2d2d;\n  background-color: #737373;\n  border: 2px solid;\n  border-color: #eee;\n  border-radius: 16px;\n  z-index: 2147483647;\n  animation-name: flash;\n  animation-duration: .5s;\n  animation-timing-function: cubic-bezier(0.39, 0.58, 0.57, 1);\n  animation-delay: 1s;\n  animation-iteration-count: 2;\n}\n\n.infobar:valid, .infobar:not(:focus-within):not(.infobar-focus) .infobar-content {\n  display: none;\n}\n\n.infobar:focus-within, .infobar.infobar-focus {\n  background-color: #f9f9f9;\n  border-color: #878787;\n  border-radius: 8px;\n  opacity: 1;\n  transition-property: opacity, background-color, border-color, border-radius, color;\n}\n\n.infobar-content {\n  border: 2px solid;\n  border-color: #f9f9f9;\n  border-radius: 6px;\n  background-color: #f9f9f9;\n  overflow: auto;\n}\n\n.infobar-content span {\n  font-family: Arial, Helvetica, sans-serif;\n  font-size: 14px;\n  line-height: 18px;\n  word-break: break-word;\n  white-space: pre-wrap;\n  margin-inline: 4px;\n  margin-block: 4px;\n  padding-inline: 24px;\n}\n\n.infobar .infobar-icon,\n.infobar .infobar-close-icon,\n.infobar .infobar-link-icon {\n  cursor: pointer;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n\n.infobar .infobar-close-icon,\n.infobar .infobar-link-icon {\n  position: fixed;\n  align-self: flex-start;\n}\n\n.infobar .infobar-icon {\n  position: absolute;\n  min-inline-size: 24px;\n  min-block-size: 24px;\n}\n\n@keyframes flash {\n  0%, 100% {\n\tbackground-color: #737373;\n  }\n  50% {\n\tbackground-color: #dd6a00;\n  }\n}\n\n.infobar:focus-within .infobar-icon, .infobar.infobar-focus .infobar-icon {\n  z-index: -1;\n  background-image: none;\n  margin: 4px;\n}\n\n.infobar .infobar-close-icon {\n  min-inline-size: 22px;\n  min-block-size: 22px;\n}\n\n.infobar .infobar-icon {\n  background-color: transparent;\n  background-size: 70%;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAABhmlDQ1BJQ0MgcHJvZmlsZQAAKJF9kj1Iw0AYht+mSkUrDnYQcchQnSyIijqWKhbBQmkrtOpgcukfNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfEydFJ0UVK/C4ptIjx4LiH9+59+e67A4RGhalm1wSgapaRisfEbG5VDLyiDwEAvZiVmKkn0osZeI6ve/j4ehfhWd7n/hz9St5kgE8kjjLdsIg3iGc2LZ3zPnGIlSSF+Jx43KACiR+5Lrv8xrnosMAzQ0YmNU8cIhaLHSx3MCsZKvE0cVhRNcoXsi4rnLc4q5Uaa9XJbxjMaytprtMcQRxLSCAJETJqKKMCCxFaNVJMpGg/5uEfdvxJcsnkKoORYwFVqJAcP/gb/O6tWZiadJOCMaD7xbY/RoHALtCs2/b3sW03TwD/M3Cltf3VBjD3SXq9rYWPgIFt4OK6rcl7wOUOMPSkS4bkSH6aQqEAvJ/RM+WAwVv6EGtu31r7OH0AMtSr5Rvg4BAYK1L2use9ezr79u+ZVv9+AFlNcp0UUpiqAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AsHADIRLMaOHwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAPUExURQAAAIqKioyNjY2OjvDw8L2y1DEAAAABdFJOUwBA5thmAAAAAWJLR0QB/wIt3gAAAGNJREFUSMdjYCAJsLi4OBCQx6/CBQwIGIDPCBcXAkYQUsACU+AwlBVQHg6Eg5pgZBGOboIJZugDFwRwoJECJCUOhJI1wZwzqmBUwagCuipgIqTABG9h7YIKaKGAURAFEF/6AQAO4HqSoDP8bgAAAABJRU5ErkJggg==);\n}\n\n.infobar .infobar-link-icon {\n  right: 20px;\n  background-size: 60%;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAABhmlDQ1BJQ0MgcHJvZmlsZQAAKJF9kj1Iw0AYht+mSkUrDnYQcchQnSyIijqWKhbBQmkrtOpgcukfNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfEydFJ0UVK/C4ptIjx4LiH9+59+e67A4RGhalm1wSgapaRisfEbG5VDLyiDwEAvZiVmKkn0osZeI6ve/j4ehfhWd7n/hz9St5kgE8kjjLdsIg3iGc2LZ3zPnGIlSSF+Jx43KACiR+5Lrv8xrnosMAzQ0YmNU8cIhaLHSx3MCsZKvE0cVhRNcoXsi4rnLc4q5Uaa9XJbxjMaytprtMcQRxLSCAJETJqKKMCCxFaNVJMpGg/5uEfdvxJcsnkKoORYwFVqJAcP/gb/O6tWZiadJOCMaD7xbY/RoHALtCs2/b3sW03TwD/M3Cltf3VBjD3SXq9rYWPgIFt4OK6rcl7wOUOMPSkS4bkSH6aQqEAvJ/RM+WAwVv6EGtu31r7OH0AMtSr5Rvg4BAYK1L2use9ezr79u+ZVv9+AFlNcp0UUpiqAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AsHAB8H+DhhoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAJUExURQAAAICHi4qKioTuJAkAAAABdFJOUwBA5thmAAAAAWJLR0QCZgt8ZAAAAJJJREFUOI3t070NRCEMA2CnYAOyDyPwpHj/Va7hJ3FzV7zy3ET5JIwoAF6Jk4wzAJAkzxAYG9YRTgB+24wBgKmfrGAKTcEfAY4KRlRoIeBTgKOCERVaCPgU4Khge2GqKOBTgKOCERVaAEC/4PNcnyoSWHpjqkhwKxbcig0Q6AorXYF/+A6eIYD1lVbwG/jdA6/kA2THRAURVubcAAAAAElFTkSuQmCC);\n}\n\n.infobar .infobar-close-icon {\n  appearance: none;\n  background-size: 80%;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAAgMAAADXB5lNAAABhmlDQ1BJQ0MgcHJvZmlsZQAAKJF9kj1Iw0AYht+mSkUrDnYQcchQnSyIijqWKhbBQmkrtOpgcukfNGlIUlwcBdeCgz+LVQcXZ10dXAVB8AfEydFJ0UVK/C4ptIjx4LiH9+59+e67A4RGhalm1wSgapaRisfEbG5VDLyiDwEAvZiVmKkn0osZeI6ve/j4ehfhWd7n/hz9St5kgE8kjjLdsIg3iGc2LZ3zPnGIlSSF+Jx43KACiR+5Lrv8xrnosMAzQ0YmNU8cIhaLHSx3MCsZKvE0cVhRNcoXsi4rnLc4q5Uaa9XJbxjMaytprtMcQRxLSCAJETJqKKMCCxFaNVJMpGg/5uEfdvxJcsnkKoORYwFVqJAcP/gb/O6tWZiadJOCMaD7xbY/RoHALtCs2/b3sW03TwD/M3Cltf3VBjD3SXq9rYWPgIFt4OK6rcl7wOUOMPSkS4bkSH6aQqEAvJ/RM+WAwVv6EGtu31r7OH0AMtSr5Rvg4BAYK1L2use9ezr79u+ZVv9+AFlNcp0UUpiqAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5AsHAB8VC4EQ6QAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAJUExURQAAAICHi4qKioTuJAkAAAABdFJOUwBA5thmAAAAAWJLR0QCZgt8ZAAAAJtJREFUOI3NkrsBgCAMRLFwBPdxBArcfxXFkO8rbKWAAJfHJ9faf9vuYX/749T5NmShm3bEwbe2SxeuM4+2oxDL1cDoKtVUjRy+tH78Cv2CS+wIiQNC1AEhk4AQeUTMWUJMfUJMSEJMSEY8kIx4IONroaYAimNxsXp1PA7PxwfVL8QnowwoVC0lig07wDDVUjAdbAnjwtow/z/bDW7eI4M2KruJAAAAAElFTkSuQmCC);\n}\n";function e(e,i,a){if(!e.querySelector(n)){let a;i.infobarContent?a=i.infobarContent.replace(/\\n/g,"\n").replace(/\\t/g,"\t"):i.saveDate&&(a=i.saveDate),a=a||"No info";const t="BODY"==e.body.tagName?e.body:e.documentElement,r=function(n,o,e){const i=n.createElement(o);return e.appendChild(i),Array.from(getComputedStyle(i)).forEach((n=>i.style.setProperty(n,"initial","important"))),i}(e,n,t);let A;A=r.attachShadow({mode:"open"});const c=e.createElement("div"),l=e.createElement("style");l.textContent=o.replace(/ {2}/g,"").replace(/\n/g,"").replace(/: /g,":").replace(/, /g,","),c.appendChild(l);const s=e.createElement("form");s.classList.add("infobar"),i.openInfobar&&s.classList.add("infobar-focus"),c.appendChild(s);const d=e.createElement("span");d.tabIndex=-1,d.classList.add("infobar-icon"),s.appendChild(d);const b=e.createElement("span");b.tabIndex=-1,b.classList.add("infobar-content");const f=e.createElement("input");f.type="checkbox",f.required=!0,f.classList.add("infobar-close-icon"),f.title="Close",b.appendChild(f);const p=e.createElement("span");p.textContent=a,b.appendChild(p);const g=e.createElement("a");g.classList.add("infobar-link-icon"),g.target="_blank",g.rel="noopener noreferrer",g.title="Open source URL: "+i.saveUrl,g.href=i.saveUrl,b.appendChild(g),s.appendChild(b),A.appendChild(c)}}(n=>{const o=n.browser,i=n.MutationObserver;async function a(){let n={displayInfobar:!0};const i=function(n){const o=n.evaluate("//comment()",n,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null);let e=o&&o.singleNodeValue;if(e&&e.nodeType==Node.COMMENT_NODE&&e.textContent.includes("SingleFile")){const n=e.textContent.split("\n"),[,,o,...i]=n,a=o.match(/^ url: (.*) ?$/),t=a&&a[1];if(t){let n,o;if(i.length&&(o=i[0].split("saved date: ")[1],o&&i.shift(),i.length>1)){let o=i[0].split("info: ")[1].trim();for(let n=1;n<i.length-1;n++)o+="\n"+i[n].trim();n=o.trim()}return{saveUrl:t,infobarContent:n,saveDate:o}}}}(document);if(i&&i.saveUrl){if(o&&o.runtime&&o.runtime.sendMessage)try{n=await o.runtime.sendMessage({method:"tabs.getOptions",url:i.saveUrl})}catch(n){}n.displayInfobar&&(i.openInfobar=n.openInfobar,e(document,i),function(n,{saveUrl:o,infobarContent:e,saveDate:i}){if(o){const a=n.querySelector("single-file-infobar").shadowRoot;a.querySelector(".infobar-content span").textContent=e||i;const t=a.querySelector(".infobar-content .infobar-link-icon");t.href=o,t.title="Open source URL: "+o}}(document,i))}}!function o(){n.window==n.top&&("loading"==document.readyState?document.addEventListener("DOMContentLoaded",a,!1):a(),document.addEventListener("single-file-display-infobar",a,!1),new i(o).observe(document,{childList:!0}));n.singlefile&&(n.singlefile.infobar={displayIcon:a})}()})("object"==typeof globalThis?globalThis:window)}();
