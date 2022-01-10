(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.singlefile = {}));
})(this, (function (exports) { 'use strict';

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

	const LOAD_DEFERRED_IMAGES_START_EVENT = "single-file-load-deferred-images-start";
	const LOAD_DEFERRED_IMAGES_END_EVENT = "single-file-load-deferred-images-end";
	const LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_START_EVENT = "single-file-load-deferred-images-keep-zoom-level-start";
	const LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_END_EVENT = "single-file-load-deferred-images-keep-zoom-level-end";
	const LOAD_DEFERRED_IMAGES_RESET_ZOOM_LEVEL_EVENT = "single-file-load-deferred-images-keep-zoom-level-reset";
	const LOAD_DEFERRED_IMAGES_RESET_EVENT = "single-file-load-deferred-images-reset";
	const BLOCK_COOKIES_START_EVENT = "single-file-block-cookies-start";
	const BLOCK_COOKIES_END_EVENT = "single-file-block-cookies-end";
	const BLOCK_STORAGE_START_EVENT = "single-file-block-storage-start";
	const BLOCK_STORAGE_END_EVENT = "single-file-block-storage-end";
	const LOAD_IMAGE_EVENT = "single-file-load-image";
	const IMAGE_LOADED_EVENT = "single-file-image-loaded";
	const NEW_FONT_FACE_EVENT = "single-file-new-font-face";
	const DELETE_FONT_EVENT = "single-file-delete-font";
	const CLEAR_FONTS_EVENT = "single-file-clear-fonts";

	const browser$3 = globalThis.browser;
	const addEventListener$3 = (type, listener, options) => globalThis.addEventListener(type, listener, options);
	const dispatchEvent$1 = event => globalThis.dispatchEvent(event);
	const CustomEvent$1 = globalThis.CustomEvent;
	const document$3 = globalThis.document;
	const Document$1 = globalThis.Document;

	let fontFaces;
	if (window._singleFile_fontFaces) {
		fontFaces = window._singleFile_fontFaces;
	} else {
		fontFaces = window._singleFile_fontFaces = new Map();
	}

	if (document$3 instanceof Document$1) {
		if (browser$3 && browser$3.runtime && browser$3.runtime.getURL) {
			addEventListener$3(NEW_FONT_FACE_EVENT, event => {
				const detail = event.detail;
				const key = Object.assign({}, detail);
				delete key.src;
				fontFaces.set(JSON.stringify(key), detail);
			});
			addEventListener$3(DELETE_FONT_EVENT, event => {
				const detail = event.detail;
				const key = Object.assign({}, detail);
				delete key.src;
				fontFaces.delete(JSON.stringify(key));
			});
			addEventListener$3(CLEAR_FONTS_EVENT, () => fontFaces = new Map());
			const scriptElement = document$3.createElement("script");
			scriptElement.src = browser$3.runtime.getURL("/dist/web/hooks/hooks-frames-web.js");
			scriptElement.async = false;
			(document$3.documentElement || document$3).appendChild(scriptElement);
			scriptElement.remove();
		}
	}

	function getFontsData$1() {
		return Array.from(fontFaces.values());
	}

	function loadDeferredImagesStart(options) {
		if (options.loadDeferredImagesBlockCookies) {
			dispatchEvent$1(new CustomEvent$1(BLOCK_COOKIES_START_EVENT));
		}
		if (options.loadDeferredImagesBlockStorage) {
			dispatchEvent$1(new CustomEvent$1(BLOCK_STORAGE_START_EVENT));
		}
		if (options.loadDeferredImagesKeepZoomLevel) {
			dispatchEvent$1(new CustomEvent$1(LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_START_EVENT));
		} else {
			dispatchEvent$1(new CustomEvent$1(LOAD_DEFERRED_IMAGES_START_EVENT));
		}
	}

	function loadDeferredImagesEnd(options) {
		if (options.loadDeferredImagesBlockCookies) {
			dispatchEvent$1(new CustomEvent$1(BLOCK_COOKIES_END_EVENT));
		}
		if (options.loadDeferredImagesBlockStorage) {
			dispatchEvent$1(new CustomEvent$1(BLOCK_STORAGE_END_EVENT));
		}
		if (options.loadDeferredImagesKeepZoomLevel) {
			dispatchEvent$1(new CustomEvent$1(LOAD_DEFERRED_IMAGES_KEEP_ZOOM_LEVEL_END_EVENT));
		} else {
			dispatchEvent$1(new CustomEvent$1(LOAD_DEFERRED_IMAGES_END_EVENT));
		}
	}

	function loadDeferredImagesResetZoomLevel(options) {
		if (options.loadDeferredImagesKeepZoomLevel) {
			dispatchEvent$1(new CustomEvent$1(LOAD_DEFERRED_IMAGES_RESET_ZOOM_LEVEL_EVENT));
		} else {
			dispatchEvent$1(new CustomEvent$1(LOAD_DEFERRED_IMAGES_RESET_EVENT));
		}
	}

	var contentHooksFrames = /*#__PURE__*/Object.freeze({
		__proto__: null,
		getFontsData: getFontsData$1,
		loadDeferredImagesStart: loadDeferredImagesStart,
		loadDeferredImagesEnd: loadDeferredImagesEnd,
		loadDeferredImagesResetZoomLevel: loadDeferredImagesResetZoomLevel,
		LOAD_IMAGE_EVENT: LOAD_IMAGE_EVENT,
		IMAGE_LOADED_EVENT: IMAGE_LOADED_EVENT
	});

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

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

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

	function process$9(str) {
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

	var cssUnescape = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$9
	});

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

	const ON_BEFORE_CAPTURE_EVENT_NAME = "single-file-on-before-capture";
	const ON_AFTER_CAPTURE_EVENT_NAME = "single-file-on-after-capture";
	const REMOVED_CONTENT_ATTRIBUTE_NAME = "data-single-file-removed-content";
	const HIDDEN_CONTENT_ATTRIBUTE_NAME = "data-single-file-hidden-content";
	const KEPT_CONTENT_ATTRIBUTE_NAME = "data-single-file-kept-content";
	const HIDDEN_FRAME_ATTRIBUTE_NAME = "data-single-file-hidden-frame";
	const PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME = "data-single-file-preserved-space-element";
	const SHADOW_ROOT_ATTRIBUTE_NAME = "data-single-file-shadow-root-element";
	const WIN_ID_ATTRIBUTE_NAME = "data-single-file-win-id";
	const IMAGE_ATTRIBUTE_NAME = "data-single-file-image";
	const POSTER_ATTRIBUTE_NAME = "data-single-file-poster";
	const CANVAS_ATTRIBUTE_NAME = "data-single-file-canvas";
	const HTML_IMPORT_ATTRIBUTE_NAME = "data-single-file-import";
	const STYLE_ATTRIBUTE_NAME = "data-single-file-movable-style";
	const INPUT_VALUE_ATTRIBUTE_NAME = "data-single-file-input-value";
	const LAZY_SRC_ATTRIBUTE_NAME = "data-single-file-lazy-loaded-src";
	const STYLESHEET_ATTRIBUTE_NAME = "data-single-file-stylesheet";
	const DISABLED_NOSCRIPT_ATTRIBUTE_NAME = "data-single-file-disabled-noscript";
	const SELECTED_CONTENT_ATTRIBUTE_NAME = "data-single-file-selected-content";
	const ASYNC_SCRIPT_ATTRIBUTE_NAME = "data-single-file-async-script";
	const FLOW_ELEMENTS_SELECTOR = "*:not(base):not(link):not(meta):not(noscript):not(script):not(style):not(template):not(title)";
	const KEPT_TAG_NAMES = ["NOSCRIPT", "DISABLED-NOSCRIPT", "META", "LINK", "STYLE", "TITLE", "TEMPLATE", "SOURCE", "OBJECT", "SCRIPT", "HEAD"];
	const REGEXP_SIMPLE_QUOTES_STRING$2 = /^'(.*?)'$/;
	const REGEXP_DOUBLE_QUOTES_STRING$2 = /^"(.*?)"$/;
	const FONT_WEIGHTS = {
		regular: "400",
		normal: "400",
		bold: "700",
		bolder: "700",
		lighter: "100"
	};
	const COMMENT_HEADER = "Page saved with SingleFile";
	const COMMENT_HEADER_LEGACY = "Archive processed by SingleFile";
	const SINGLE_FILE_UI_ELEMENT_CLASS = "single-file-ui-element";
	const addEventListener$2 = (type, listener, options) => globalThis.addEventListener(type, listener, options);
	const dispatchEvent = event => globalThis.dispatchEvent(event);

	function initUserScriptHandler() {
		addEventListener$2("single-file-user-script-init", () => globalThis._singleFile_waitForUserScript = async eventPrefixName => {
			const event = new CustomEvent(eventPrefixName + "-request", { cancelable: true });
			const promiseResponse = new Promise(resolve => addEventListener$2(eventPrefixName + "-response", resolve));
			dispatchEvent(event);
			if (event.defaultPrevented) {
				await promiseResponse;
			}
		});
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
		let elementsInfo;
		if (win && doc.documentElement) {
			elementsInfo = getElementsInfo(win, doc, doc.documentElement, options);
			if (options.moveStylesInHead) {
				doc.querySelectorAll("body style, body ~ style").forEach(element => {
					const computedStyle = win.getComputedStyle(element);
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
				usedFonts: [],
				shadowRoots: [],
				imports: [],
				markedElements: []
			};
		}
		return {
			canvases: elementsInfo.canvases,
			fonts: getFontsData(),
			stylesheets: getStylesheetsData(doc),
			images: elementsInfo.images,
			posters: elementsInfo.posters,
			usedFonts: Array.from(elementsInfo.usedFonts.values()),
			shadowRoots: elementsInfo.shadowRoots,
			imports: elementsInfo.imports,
			referrer: doc.referrer,
			markedElements: elementsInfo.markedElements
		};
	}

	function getElementsInfo(win, doc, element, options, data = { usedFonts: new Map(), canvases: [], images: [], posters: [], shadowRoots: [], imports: [], markedElements: [] }, ascendantHidden) {
		const elements = Array.from(element.childNodes).filter(node => (node instanceof win.HTMLElement) || (node instanceof win.SVGElement));
		elements.forEach(element => {
			let elementHidden, elementKept, computedStyle;
			if (options.removeHiddenElements || options.removeUnusedFonts || options.compressHTML) {
				computedStyle = win.getComputedStyle(element);
				if (element instanceof win.HTMLElement) {
					if (options.removeHiddenElements) {
						elementKept = ((ascendantHidden || element.closest("html > head")) && KEPT_TAG_NAMES.includes(element.tagName)) || element.closest("details");
						if (!elementKept) {
							elementHidden = ascendantHidden || testHiddenElement(element, computedStyle);
							if (elementHidden) {
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
						getUsedFont(win.getComputedStyle(element, ":first-letter"), options, data.usedFonts);
						getUsedFont(win.getComputedStyle(element, ":before"), options, data.usedFonts);
						getUsedFont(win.getComputedStyle(element, ":after"), options, data.usedFonts);
					}
				}
			}
			getResourcesInfo(win, doc, element, options, data, elementHidden, computedStyle);
			const shadowRoot = !(element instanceof win.SVGElement) && getShadowRoot(element);
			if (shadowRoot && !element.classList.contains(SINGLE_FILE_UI_ELEMENT_CLASS)) {
				const shadowRootInfo = {};
				element.setAttribute(SHADOW_ROOT_ATTRIBUTE_NAME, data.shadowRoots.length);
				data.markedElements.push(element);
				data.shadowRoots.push(shadowRootInfo);
				getElementsInfo(win, doc, shadowRoot, options, data, elementHidden);
				shadowRootInfo.content = shadowRoot.innerHTML;
				shadowRootInfo.delegatesFocus = shadowRoot.delegatesFocus;
				shadowRootInfo.mode = shadowRoot.mode;
				if (shadowRoot.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length) {
					shadowRootInfo.adoptedStyleSheets = Array.from(shadowRoot.adoptedStyleSheets).map(stylesheet => Array.from(stylesheet.cssRules).map(cssRule => cssRule.cssText).join("\n"));
				}
			}
			getElementsInfo(win, doc, element, options, data, elementHidden);
			if (options.removeHiddenElements && ascendantHidden) {
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
		return data;
	}

	function getResourcesInfo(win, doc, element, options, data, elementHidden, computedStyle) {
		if (element.tagName == "CANVAS") {
			try {
				data.canvases.push({ dataURI: element.toDataURL("image/png", "") });
				element.setAttribute(CANVAS_ATTRIBUTE_NAME, data.canvases.length - 1);
				data.markedElements.push(element);
			} catch (error) {
				// ignored
			}
		}
		if (element.tagName == "IMG") {
			const imageData = {
				currentSrc: elementHidden ?
					"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" :
					(options.loadDeferredImages && element.getAttribute(LAZY_SRC_ATTRIBUTE_NAME)) || element.currentSrc
			};
			data.images.push(imageData);
			element.setAttribute(IMAGE_ATTRIBUTE_NAME, data.images.length - 1);
			data.markedElements.push(element);
			element.removeAttribute(LAZY_SRC_ATTRIBUTE_NAME);
			computedStyle = computedStyle || win.getComputedStyle(element);
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
		if (element.tagName == "VIDEO") {
			if (!element.poster) {
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
		if (element.tagName == "IFRAME") {
			if (elementHidden && options.removeHiddenElements) {
				element.setAttribute(HIDDEN_FRAME_ATTRIBUTE_NAME, "");
				data.markedElements.push(element);
			}
		}
		if (element.tagName == "LINK") {
			if (element.import && element.import.documentElement) {
				data.imports.push({ content: serialize$1(element.import) });
				element.setAttribute(HTML_IMPORT_ATTRIBUTE_NAME, data.imports.length - 1);
				data.markedElements.push(element);
			}
		}
		if (element.tagName == "INPUT") {
			if (element.type != "password") {
				element.setAttribute(INPUT_VALUE_ATTRIBUTE_NAME, element.value);
				data.markedElements.push(element);
			}
			if (element.type == "radio" || element.type == "checkbox") {
				element.setAttribute(INPUT_VALUE_ATTRIBUTE_NAME, element.checked);
				data.markedElements.push(element);
			}
		}
		if (element.tagName == "TEXTAREA") {
			element.setAttribute(INPUT_VALUE_ATTRIBUTE_NAME, element.value);
			data.markedElements.push(element);
		}
		if (element.tagName == "SELECT") {
			element.querySelectorAll("option").forEach(option => {
				if (option.selected) {
					option.setAttribute(INPUT_VALUE_ATTRIBUTE_NAME, "");
					data.markedElements.push(option);
				}
			});
		}
		if (element.tagName == "SCRIPT") {
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
					usedFonts.set(JSON.stringify(value), [fontFamilyName, fontWeight, fontStyle, fontVariant]);
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
		return removeQuotes$1(process$9(fontFamilyName.trim())).toLowerCase();
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

	function postProcessDoc(doc, markedElements) {
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
			const singleFileAttributes = [REMOVED_CONTENT_ATTRIBUTE_NAME, HIDDEN_FRAME_ATTRIBUTE_NAME, HIDDEN_CONTENT_ATTRIBUTE_NAME, PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME, IMAGE_ATTRIBUTE_NAME, POSTER_ATTRIBUTE_NAME, CANVAS_ATTRIBUTE_NAME, INPUT_VALUE_ATTRIBUTE_NAME, SHADOW_ROOT_ATTRIBUTE_NAME, HTML_IMPORT_ATTRIBUTE_NAME, STYLESHEET_ATTRIBUTE_NAME, ASYNC_SCRIPT_ATTRIBUTE_NAME];
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
			element.removeAttribute(CANVAS_ATTRIBUTE_NAME);
			element.removeAttribute(INPUT_VALUE_ATTRIBUTE_NAME);
			element.removeAttribute(SHADOW_ROOT_ATTRIBUTE_NAME);
			element.removeAttribute(HTML_IMPORT_ATTRIBUTE_NAME);
			element.removeAttribute(STYLESHEET_ATTRIBUTE_NAME);
			element.removeAttribute(ASYNC_SCRIPT_ATTRIBUTE_NAME);
			element.removeAttribute(STYLE_ATTRIBUTE_NAME);
		});
	}

	function getStylesheetsData(doc) {
		if (doc) {
			const contents = [];
			doc.querySelectorAll("style").forEach((styleElement, styleIndex) => {
				try {
					const tempStyleElement = doc.createElement("style");
					tempStyleElement.textContent = styleElement.textContent;
					doc.body.appendChild(tempStyleElement);
					const stylesheet = tempStyleElement.sheet;
					tempStyleElement.remove();
					if (!stylesheet || stylesheet.cssRules.length != styleElement.sheet.cssRules.length) {
						styleElement.setAttribute(STYLESHEET_ATTRIBUTE_NAME, styleIndex);
						contents[styleIndex] = Array.from(styleElement.sheet.cssRules).map(cssRule => cssRule.cssText).join("\n");
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
			computedStyle = computedStyle || win.getComputedStyle(imageElement);
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

	function removeQuotes$1(string) {
		if (string.match(REGEXP_SIMPLE_QUOTES_STRING$2)) {
			string = string.replace(REGEXP_SIMPLE_QUOTES_STRING$2, "$1");
		} else {
			string = string.replace(REGEXP_DOUBLE_QUOTES_STRING$2, "$1");
		}
		return string.trim();
	}

	function getFontWeight(weight) {
		return FONT_WEIGHTS[weight.toLowerCase().trim()] || weight;
	}

	function flatten(array) {
		return array.flat ? array.flat() : array.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
	}

	var singleFileHelper = /*#__PURE__*/Object.freeze({
		__proto__: null,
		initUserScriptHandler: initUserScriptHandler,
		initDoc: initDoc,
		preProcessDoc: preProcessDoc,
		postProcessDoc: postProcessDoc,
		serialize: serialize$1,
		removeQuotes: removeQuotes$1,
		flatten: flatten,
		getFontWeight: getFontWeight,
		normalizeFontFamily: normalizeFontFamily,
		getShadowRoot: getShadowRoot,
		ON_BEFORE_CAPTURE_EVENT_NAME: ON_BEFORE_CAPTURE_EVENT_NAME,
		ON_AFTER_CAPTURE_EVENT_NAME: ON_AFTER_CAPTURE_EVENT_NAME,
		WIN_ID_ATTRIBUTE_NAME: WIN_ID_ATTRIBUTE_NAME,
		PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME: PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME,
		REMOVED_CONTENT_ATTRIBUTE_NAME: REMOVED_CONTENT_ATTRIBUTE_NAME,
		HIDDEN_CONTENT_ATTRIBUTE_NAME: HIDDEN_CONTENT_ATTRIBUTE_NAME,
		HIDDEN_FRAME_ATTRIBUTE_NAME: HIDDEN_FRAME_ATTRIBUTE_NAME,
		IMAGE_ATTRIBUTE_NAME: IMAGE_ATTRIBUTE_NAME,
		POSTER_ATTRIBUTE_NAME: POSTER_ATTRIBUTE_NAME,
		CANVAS_ATTRIBUTE_NAME: CANVAS_ATTRIBUTE_NAME,
		INPUT_VALUE_ATTRIBUTE_NAME: INPUT_VALUE_ATTRIBUTE_NAME,
		SHADOW_ROOT_ATTRIBUTE_NAME: SHADOW_ROOT_ATTRIBUTE_NAME,
		HTML_IMPORT_ATTRIBUTE_NAME: HTML_IMPORT_ATTRIBUTE_NAME,
		STYLE_ATTRIBUTE_NAME: STYLE_ATTRIBUTE_NAME,
		LAZY_SRC_ATTRIBUTE_NAME: LAZY_SRC_ATTRIBUTE_NAME,
		STYLESHEET_ATTRIBUTE_NAME: STYLESHEET_ATTRIBUTE_NAME,
		SELECTED_CONTENT_ATTRIBUTE_NAME: SELECTED_CONTENT_ATTRIBUTE_NAME,
		ASYNC_SCRIPT_ATTRIBUTE_NAME: ASYNC_SCRIPT_ATTRIBUTE_NAME,
		COMMENT_HEADER: COMMENT_HEADER,
		COMMENT_HEADER_LEGACY: COMMENT_HEADER_LEGACY,
		SINGLE_FILE_UI_ELEMENT_CLASS: SINGLE_FILE_UI_ELEMENT_CLASS
	});

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
	const helper$4 = {
		LAZY_SRC_ATTRIBUTE_NAME,
		SINGLE_FILE_UI_ELEMENT_CLASS
	};

	const MAX_IDLE_TIMEOUT_CALLS = 10;
	const ATTRIBUTES_MUTATION_TYPE = "attributes";

	const browser$2 = globalThis.browser;
	const document$2 = globalThis.document;
	const MutationObserver = globalThis.MutationObserver;
	const addEventListener$1 = (type, listener, options) => globalThis.addEventListener(type, listener, options);
	const removeEventListener = (type, listener, options) => globalThis.removeEventListener(type, listener, options);
	const timeouts = new Map();

	let idleTimeoutCalls;

	if (browser$2 && browser$2.runtime && browser$2.runtime.onMessage && browser$2.runtime.onMessage.addListener) {
		browser$2.runtime.onMessage.addListener(message => {
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

	async function process$8(options) {
		if (document$2.documentElement) {
			timeouts.clear();
			const maxScrollY = Math.max(document$2.documentElement.scrollHeight - (document$2.documentElement.clientHeight * 1.5), 0);
			const maxScrollX = Math.max(document$2.documentElement.scrollWidth - (document$2.documentElement.clientWidth * 1.5), 0);
			if (globalThis.scrollY <= maxScrollY && globalThis.scrollX <= maxScrollX) {
				return triggerLazyLoading(options);
			}
		}
	}

	function resetZoomLevel(options) {
		loadDeferredImagesResetZoomLevel(options);
	}

	function triggerLazyLoading(options) {
		idleTimeoutCalls = 0;
		return new Promise(async resolve => { // eslint-disable-line  no-async-promise-executor
			let loadingImages;
			const pendingImages = new Set();
			const observer = new MutationObserver(async mutations => {
				mutations = mutations.filter(mutation => mutation.type == ATTRIBUTES_MUTATION_TYPE);
				if (mutations.length) {
					const updated = mutations.filter(mutation => {
						if (mutation.attributeName == "src") {
							mutation.target.setAttribute(helper$4.LAZY_SRC_ATTRIBUTE_NAME, mutation.target.src);
							mutation.target.addEventListener("load", onResourceLoad);
						}
						if (mutation.attributeName == "src" || mutation.attributeName == "srcset" || mutation.target.tagName == "SOURCE") {
							return !mutation.target.classList || !mutation.target.classList.contains(helper$4.SINGLE_FILE_UI_ELEMENT_CLASS);
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
			observer.observe(document$2, { subtree: true, childList: true, attributes: true });
			addEventListener$1(LOAD_IMAGE_EVENT, onImageLoadEvent);
			addEventListener$1(IMAGE_LOADED_EVENT, onImageLoadedEvent);
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
				}, delay);
			}

			function onResourceLoad(event) {
				const element = event.target;
				element.removeAttribute(helper$4.LAZY_SRC_ATTRIBUTE_NAME);
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
				removeEventListener(LOAD_IMAGE_EVENT, onImageLoadEvent);
				removeEventListener(IMAGE_LOADED_EVENT, onImageLoadedEvent);
				resolve(value);
			}
		});
	}

	async function deferLazyLoadEnd(observer, options, resolve) {
		await setAsyncTimeout("loadTimeout", () => lazyLoadEnd(observer, options, resolve), options.loadDeferredImagesMaxIdleTime);
	}

	async function deferForceLazyLoadEnd(observer, options, resolve) {
		await setAsyncTimeout("maxTimeout", async () => {
			await clearAsyncTimeout("loadTimeout");
			await lazyLoadEnd(observer, options, resolve);
		}, options.loadDeferredImagesMaxIdleTime * 10);
	}

	async function lazyLoadEnd(observer, options, resolve) {
		await clearAsyncTimeout("idleTimeout");
		loadDeferredImagesEnd(options);
		await setAsyncTimeout("endTimeout", async () => {
			await clearAsyncTimeout("maxTimeout");
			resolve();
		}, options.loadDeferredImagesMaxIdleTime / 2);
		observer.disconnect();
	}

	async function setAsyncTimeout(type, callback, delay) {
		if (browser$2 && browser$2.runtime && browser$2.runtime.sendMessage) {
			if (!timeouts.get(type) || !timeouts.get(type).pending) {
				const timeoutData = { callback, pending: true };
				timeouts.set(type, timeoutData);
				try {
					await browser$2.runtime.sendMessage({ method: "singlefile.lazyTimeout.setTimeout", type, delay });
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
		if (browser$2 && browser$2.runtime && browser$2.runtime.sendMessage) {
			try {
				await browser$2.runtime.sendMessage({ method: "singlefile.lazyTimeout.clearTimeout", type });
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

	var contentLazyLoader = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$8,
		resetZoomLevel: resetZoomLevel
	});

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

	const helper$3 = {
		ON_BEFORE_CAPTURE_EVENT_NAME,
		ON_AFTER_CAPTURE_EVENT_NAME,
		WIN_ID_ATTRIBUTE_NAME,
		preProcessDoc,
		serialize: serialize$1,
		postProcessDoc,
		getShadowRoot
	};

	const MESSAGE_PREFIX = "__frameTree__::";
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

	const browser$1 = globalThis.browser;
	const addEventListener = (type, listener, options) => globalThis.addEventListener(type, listener, options);
	const top = globalThis.top;
	const MessageChannel = globalThis.MessageChannel;
	const document$1 = globalThis.document;

	const sessions = new Map();
	let windowId;
	if (TOP_WINDOW) {
		windowId = TOP_WINDOW_ID;
		if (browser$1 && browser$1.runtime && browser$1.runtime.onMessage && browser$1.runtime.onMessage.addListener) {
			browser$1.runtime.onMessage.addListener(message => {
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
	addEventListener("message", async event => {
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
						process$8(message.options);
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
		const waitForUserScript = globalThis._singleFile_waitForUserScript;
		if (!TOP_WINDOW) {
			windowId = globalThis.frameId = message.windowId;
		}
		processFrames(document$1, message.options, windowId, sessionId);
		if (!TOP_WINDOW) {
			if (message.options.userScriptEnabled && waitForUserScript) {
				waitForUserScript(helper$3.ON_BEFORE_CAPTURE_EVENT_NAME);
			}
			sendInitResponse({ frames: [getFrameData(document$1, globalThis, windowId, message.options)], sessionId, requestedFrameId: document$1.documentElement.dataset.requestedFrameId && windowId });
			if (message.options.userScriptEnabled && waitForUserScript) {
				waitForUserScript(helper$3.ON_AFTER_CAPTURE_EVENT_NAME);
			}
			delete document$1.documentElement.dataset.requestedFrameId;
		}
	}

	async function initRequestAsync(message) {
		const sessionId = message.sessionId;
		const waitForUserScript = globalThis._singleFile_waitForUserScript;
		if (!TOP_WINDOW) {
			windowId = globalThis.frameId = message.windowId;
		}
		processFrames(document$1, message.options, windowId, sessionId);
		if (!TOP_WINDOW) {
			if (message.options.userScriptEnabled && waitForUserScript) {
				await waitForUserScript(helper$3.ON_BEFORE_CAPTURE_EVENT_NAME);
			}
			sendInitResponse({ frames: [getFrameData(document$1, globalThis, windowId, message.options)], sessionId, requestedFrameId: document$1.documentElement.dataset.requestedFrameId && windowId });
			if (message.options.userScriptEnabled && waitForUserScript) {
				await waitForUserScript(helper$3.ON_AFTER_CAPTURE_EVENT_NAME);
			}
			delete document$1.documentElement.dataset.requestedFrameId;
		}
	}

	function cleanupRequest(message) {
		const sessionId = message.sessionId;
		cleanupFrames(getFrames(document$1), message.windowId, sessionId);
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
					frameData.canvases = messageFrameData.canvases;
					frameData.fonts = messageFrameData.fonts;
					frameData.stylesheets = messageFrameData.stylesheets;
					frameData.images = messageFrameData.images;
					frameData.posters = messageFrameData.posters;
					frameData.usedFonts = messageFrameData.usedFonts;
					frameData.shadowRoots = messageFrameData.shadowRoots;
					frameData.imports = messageFrameData.imports;
					frameData.processed = messageFrameData.processed;
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
			frameElement.setAttribute(helper$3.WIN_ID_ATTRIBUTE_NAME, windowId);
			frames.push({ windowId });
		});
		sendInitResponse({ frames, sessionId, requestedFrameId: doc.documentElement.dataset.requestedFrameId && parentWindowId });
		frameElements.forEach((frameElement, frameIndex) => {
			const windowId = parentWindowId + WINDOW_ID_SEPARATOR + frameIndex;
			try {
				sendMessage(frameElement.contentWindow, { method: INIT_REQUEST_MESSAGE, windowId, sessionId, options });
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
			let frameDoc;
			try {
				frameDoc = frameElement.contentDocument;
			} catch (error) {
				// ignored
			}
			if (frameDoc) {
				try {
					const frameWindow = frameElement.contentWindow;
					frameWindow.stop();
					clearFrameTimeout("requestTimeouts", sessionId, windowId);
					processFrames(frameDoc, options, windowId, sessionId);
					frames.push(getFrameData(frameDoc, frameWindow, windowId, options));
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
			frameElement.removeAttribute(helper$3.WIN_ID_ATTRIBUTE_NAME);
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
		if (targetWindow == top && browser$1 && browser$1.runtime && browser$1.runtime.sendMessage) {
			browser$1.runtime.sendMessage(message);
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

	function getFrameData(document, globalThis, windowId, options) {
		const docData = helper$3.preProcessDoc(document, globalThis, options);
		const content = helper$3.serialize(document);
		helper$3.postProcessDoc(document, docData.markedElements);
		const baseURI = document.baseURI.split("#")[0];
		return {
			windowId,
			content,
			baseURI,
			title: document.title,
			canvases: docData.canvases,
			fonts: docData.fonts,
			stylesheets: docData.stylesheets,
			images: docData.images,
			posters: docData.posters,
			usedFonts: docData.usedFonts,
			shadowRoots: docData.shadowRoots,
			imports: docData.imports,
			processed: true
		};
	}

	function getFrames(document) {
		let frames = Array.from(document.querySelectorAll(FRAMES_CSS_SELECTOR));
		document.querySelectorAll(ALL_ELEMENTS_CSS_SELECTOR).forEach(element => {
			const shadowRoot = helper$3.getShadowRoot(element);
			if (shadowRoot) {
				frames = frames.concat(...shadowRoot.querySelectorAll(FRAMES_CSS_SELECTOR));
			}
		});
		return frames;
	}

	var contentFrameTree = /*#__PURE__*/Object.freeze({
		__proto__: null,
		getAsync: getAsync,
		getSync: getSync,
		cleanup: cleanup,
		initResponse: initResponse,
		TIMEOUT_INIT_REQUEST_MESSAGE: TIMEOUT_INIT_REQUEST_MESSAGE
	});

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

	/* global globalThis */

	const browser = globalThis.browser;
	const document = globalThis.document;
	const Document = globalThis.Document;

	if (document instanceof Document) {
		const scriptElement = document.createElement("script");
		scriptElement.async = false;
		if (browser && browser.runtime && browser.runtime.getURL) {
			scriptElement.src = browser.runtime.getURL("/dist/web/hooks/hooks-web.js");
			scriptElement.async = false;
		}
		(document.documentElement || document).appendChild(scriptElement);
		scriptElement.remove();
	}

	var contentHooks = /*#__PURE__*/Object.freeze({
		__proto__: null
	});

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

	var index$2 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		frameTree: contentFrameTree,
		hooks: contentHooks,
		hooksFrames: contentHooksFrames,
		lazy: contentLazyLoader
	});

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

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	// derived from https://github.com/jedmao/parse-css-font/

	/*
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2015 Jed Mao
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	const REGEXP_SIMPLE_QUOTES_STRING$1 = /^'(.*?)'$/;
	const REGEXP_DOUBLE_QUOTES_STRING$1 = /^"(.*?)"$/;

	const globalKeywords = [
		"inherit",
		"initial",
		"unset"
	];

	const systemFontKeywords = [
		"caption",
		"icon",
		"menu",
		"message-box",
		"small-caption",
		"status-bar"
	];

	const fontWeightKeywords = [
		"normal",
		"bold",
		"bolder",
		"lighter",
		"100",
		"200",
		"300",
		"400",
		"500",
		"600",
		"700",
		"800",
		"900"
	];

	const fontStyleKeywords = [
		"normal",
		"italic",
		"oblique"
	];

	const fontStretchKeywords = [
		"normal",
		"condensed",
		"semi-condensed",
		"extra-condensed",
		"ultra-condensed",
		"expanded",
		"semi-expanded",
		"extra-expanded",
		"ultra-expanded"
	];

	const cssFontSizeKeywords = [
		"xx-small",
		"x-small",
		"small",
		"medium",
		"large",
		"x-large",
		"xx-large",
		"larger",
		"smaller"
	];

	const cssListHelpers = {
		splitBySpaces,
		split,
		splitByCommas
	};

	const helpers = {
		isSize
	};

	const errorPrefix = "[parse-css-font] ";

	function parse$1(value) {
		if (typeof value !== "string") {
			throw new TypeError(errorPrefix + "Expected a string.");
		}
		if (value === "") {
			throw error$1("Cannot parse an empty string.");
		}
		if (systemFontKeywords.indexOf(value) !== -1) {
			return { system: value };
		}

		const font = {
			lineHeight: "normal",
			stretch: "normal",
			style: "normal",
			variant: "normal",
			weight: "normal",
		};

		let isLocked = false;
		const tokens = cssListHelpers.splitBySpaces(value);
		let token = tokens.shift();
		for (; token; token = tokens.shift()) {

			if (token === "normal" || globalKeywords.indexOf(token) !== -1) {
				["style", "variant", "weight", "stretch"].forEach((prop) => {
					font[prop] = token;
				});
				isLocked = true;
				continue;
			}

			if (fontWeightKeywords.indexOf(token) !== -1) {
				if (isLocked) {
					continue;
				}
				font.weight = token;
				continue;
			}

			if (fontStyleKeywords.indexOf(token) !== -1) {
				if (isLocked) {
					continue;
				}
				font.style = token;
				continue;
			}

			if (fontStretchKeywords.indexOf(token) !== -1) {
				if (isLocked) {
					continue;
				}
				font.stretch = token;
				continue;
			}

			if (helpers.isSize(token)) {
				const parts = cssListHelpers.split(token, ["/"]);
				font.size = parts[0];
				if (parts[1]) {
					font.lineHeight = parseLineHeight(parts[1]);
				} else if (tokens[0] === "/") {
					tokens.shift();
					font.lineHeight = parseLineHeight(tokens.shift());
				}
				if (!tokens.length) {
					throw error$1("Missing required font-family.");
				}
				font.family = cssListHelpers.splitByCommas(tokens.join(" ")).map(removeQuotes);
				return font;
			}

			if (font.variant !== "normal") {
				throw error$1("Unknown or unsupported font token: " + font.variant);
			}

			if (isLocked) {
				continue;
			}
			font.variant = token;
		}

		throw error$1("Missing required font-size.");
	}

	function error$1(message) {
		return new Error(errorPrefix + message);
	}

	function parseLineHeight(value) {
		const parsed = parseFloat(value);
		if (parsed.toString() === value) {
			return parsed;
		}
		return value;
	}

	/**
	 * Splits a CSS declaration value (shorthand) using provided separators
	 * as the delimiters.
	 */
	function split(
		/**
		 * A CSS declaration value (shorthand).
		 */
		value,
		/**
		 * Any number of separator characters used for splitting.
		 */
		separators,
		{
			last = false,
		} = {},
	) {
		if (typeof value !== "string") {
			throw new TypeError("expected a string");
		}
		if (!Array.isArray(separators)) {
			throw new TypeError("expected a string array of separators");
		}
		if (typeof last !== "boolean") {
			throw new TypeError("expected a Boolean value for options.last");
		}
		const array = [];
		let current = "";
		let splitMe = false;

		let func = 0;
		let quote = false;
		let escape = false;

		for (const char of value) {

			if (quote) {
				if (escape) {
					escape = false;
				} else if (char === "\\") {
					escape = true;
				} else if (char === quote) {
					quote = false;
				}
			} else if (char === "\"" || char === "'") {
				quote = char;
			} else if (char === "(") {
				func += 1;
			} else if (char === ")") {
				if (func > 0) {
					func -= 1;
				}
			} else if (func === 0) {
				if (separators.indexOf(char) !== -1) {
					splitMe = true;
				}
			}

			if (splitMe) {
				if (current !== "") {
					array.push(current.trim());
				}
				current = "";
				splitMe = false;
			} else {
				current += char;
			}
		}

		if (last || current !== "") {
			array.push(current.trim());
		}
		return array;
	}

	/**
	 * Splits a CSS declaration value (shorthand) using whitespace characters
	 * as the delimiters.
	 */
	function splitBySpaces(
		/**
		 * A CSS declaration value (shorthand).
		 */
		value,
	) {
		const spaces = [" ", "\n", "\t"];
		return split(value, spaces);
	}

	/**
	 * Splits a CSS declaration value (shorthand) using commas as the delimiters.
	 */
	function splitByCommas(
		/**
		 * A CSS declaration value (shorthand).
		 */
		value,
	) {
		const comma = ",";
		return split(value, [comma], { last: true });
	}

	function isSize(value) {
		return !isNaN(parseFloat(value))
			|| value.indexOf("/") !== -1
			|| cssFontSizeKeywords.indexOf(value) !== -1;
	}

	function removeQuotes(string) {
		if (string.match(REGEXP_SIMPLE_QUOTES_STRING$1)) {
			string = string.replace(REGEXP_SIMPLE_QUOTES_STRING$1, "$1");
		} else {
			string = string.replace(REGEXP_DOUBLE_QUOTES_STRING$1, "$1");
		}
		return string.trim();
	}

	var cssFontPropertyParser = /*#__PURE__*/Object.freeze({
		__proto__: null,
		parse: parse$1
	});

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

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	// derived from https://github.com/dryoma/postcss-media-query-parser

	/*
	 * The MIT License (MIT)
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

	/**
	 * Parses a media feature expression, e.g. `max-width: 10px`, `(color)`
	 *
	 * @param {string} string - the source expression string, can be inside parens
	 * @param {Number} index - the index of `string` in the overall input
	 *
	 * @return {Array} an array of Nodes, the first element being a media feature,
	 *    the second - its value (may be missing)
	 */

	function parseMediaFeature(string, index = 0) {
		const modesEntered = [{
			mode: "normal",
			character: null,
		}];
		const result = [];
		let lastModeIndex = 0, mediaFeature = "", colon = null, mediaFeatureValue = null, indexLocal = index;

		let stringNormalized = string;
		// Strip trailing parens (if any), and correct the starting index
		if (string[0] === "(" && string[string.length - 1] === ")") {
			stringNormalized = string.substring(1, string.length - 1);
			indexLocal++;
		}

		for (let i = 0; i < stringNormalized.length; i++) {
			const character = stringNormalized[i];

			// If entering/exiting a string
			if (character === "'" || character === "\"") {
				if (modesEntered[lastModeIndex].isCalculationEnabled === true) {
					modesEntered.push({
						mode: "string",
						isCalculationEnabled: false,
						character,
					});
					lastModeIndex++;
				} else if (modesEntered[lastModeIndex].mode === "string" &&
					modesEntered[lastModeIndex].character === character &&
					stringNormalized[i - 1] !== "\\"
				) {
					modesEntered.pop();
					lastModeIndex--;
				}
			}

			// If entering/exiting interpolation
			if (character === "{") {
				modesEntered.push({
					mode: "interpolation",
					isCalculationEnabled: true,
				});
				lastModeIndex++;
			} else if (character === "}") {
				modesEntered.pop();
				lastModeIndex--;
			}

			// If a : is met outside of a string, function call or interpolation, than
			// this : separates a media feature and a value
			if (modesEntered[lastModeIndex].mode === "normal" && character === ":") {
				const mediaFeatureValueStr = stringNormalized.substring(i + 1);
				mediaFeatureValue = {
					type: "value",
					before: /^(\s*)/.exec(mediaFeatureValueStr)[1],
					after: /(\s*)$/.exec(mediaFeatureValueStr)[1],
					value: mediaFeatureValueStr.trim(),
				};
				// +1 for the colon
				mediaFeatureValue.sourceIndex =
					mediaFeatureValue.before.length + i + 1 + indexLocal;
				colon = {
					type: "colon",
					sourceIndex: i + indexLocal,
					after: mediaFeatureValue.before,
					value: ":", // for consistency only
				};
				break;
			}

			mediaFeature += character;
		}

		// Forming a media feature node
		mediaFeature = {
			type: "media-feature",
			before: /^(\s*)/.exec(mediaFeature)[1],
			after: /(\s*)$/.exec(mediaFeature)[1],
			value: mediaFeature.trim(),
		};
		mediaFeature.sourceIndex = mediaFeature.before.length + indexLocal;
		result.push(mediaFeature);

		if (colon !== null) {
			colon.before = mediaFeature.after;
			result.push(colon);
		}

		if (mediaFeatureValue !== null) {
			result.push(mediaFeatureValue);
		}

		return result;
	}

	/**
	 * Parses a media query, e.g. `screen and (color)`, `only tv`
	 *
	 * @param {string} string - the source media query string
	 * @param {Number} index - the index of `string` in the overall input
	 *
	 * @return {Array} an array of Nodes and Containers
	 */

	function parseMediaQuery(string, index = 0) {
		const result = [];

		// How many times the parser entered parens/curly braces
		let localLevel = 0;
		// Has any keyword, media type, media feature expression or interpolation
		// ('element' hereafter) started
		let insideSomeValue = false, node;

		function resetNode() {
			return {
				before: "",
				after: "",
				value: "",
			};
		}

		node = resetNode();

		for (let i = 0; i < string.length; i++) {
			const character = string[i];
			// If not yet entered any element
			if (!insideSomeValue) {
				if (character.search(/\s/) !== -1) {
					// A whitespace
					// Don't form 'after' yet; will do it later
					node.before += character;
				} else {
					// Not a whitespace - entering an element
					// Expression start
					if (character === "(") {
						node.type = "media-feature-expression";
						localLevel++;
					}
					node.value = character;
					node.sourceIndex = index + i;
					insideSomeValue = true;
				}
			} else {
				// Already in the middle of some element
				node.value += character;

				// Here parens just increase localLevel and don't trigger a start of
				// a media feature expression (since they can't be nested)
				// Interpolation start
				if (character === "{" || character === "(") { localLevel++; }
				// Interpolation/function call/media feature expression end
				if (character === ")" || character === "}") { localLevel--; }
			}

			// If exited all parens/curlies and the next symbol
			if (insideSomeValue && localLevel === 0 &&
				(character === ")" || i === string.length - 1 ||
					string[i + 1].search(/\s/) !== -1)
			) {
				if (["not", "only", "and"].indexOf(node.value) !== -1) {
					node.type = "keyword";
				}
				// if it's an expression, parse its contents
				if (node.type === "media-feature-expression") {
					node.nodes = parseMediaFeature(node.value, node.sourceIndex);
				}
				result.push(Array.isArray(node.nodes) ?
					new Container(node) : new Node(node));
				node = resetNode();
				insideSomeValue = false;
			}
		}

		// Now process the result array - to specify undefined types of the nodes
		// and specify the `after` prop
		for (let i = 0; i < result.length; i++) {
			node = result[i];
			if (i > 0) { result[i - 1].after = node.before; }

			// Node types. Might not be set because contains interpolation/function
			// calls or fully consists of them
			if (node.type === undefined) {
				if (i > 0) {
					// only `and` can follow an expression
					if (result[i - 1].type === "media-feature-expression") {
						node.type = "keyword";
						continue;
					}
					// Anything after 'only|not' is a media type
					if (result[i - 1].value === "not" || result[i - 1].value === "only") {
						node.type = "media-type";
						continue;
					}
					// Anything after 'and' is an expression
					if (result[i - 1].value === "and") {
						node.type = "media-feature-expression";
						continue;
					}

					if (result[i - 1].type === "media-type") {
						// if it is the last element - it might be an expression
						// or 'and' depending on what is after it
						if (!result[i + 1]) {
							node.type = "media-feature-expression";
						} else {
							node.type = result[i + 1].type === "media-feature-expression" ?
								"keyword" : "media-feature-expression";
						}
					}
				}

				if (i === 0) {
					// `screen`, `fn( ... )`, `#{ ... }`. Not an expression, since then
					// its type would have been set by now
					if (!result[i + 1]) {
						node.type = "media-type";
						continue;
					}

					// `screen and` or `#{...} (max-width: 10px)`
					if (result[i + 1] &&
						(result[i + 1].type === "media-feature-expression" ||
							result[i + 1].type === "keyword")
					) {
						node.type = "media-type";
						continue;
					}
					if (result[i + 2]) {
						// `screen and (color) ...`
						if (result[i + 2].type === "media-feature-expression") {
							node.type = "media-type";
							result[i + 1].type = "keyword";
							continue;
						}
						// `only screen and ...`
						if (result[i + 2].type === "keyword") {
							node.type = "keyword";
							result[i + 1].type = "media-type";
							continue;
						}
					}
					if (result[i + 3]) {
						// `screen and (color) ...`
						if (result[i + 3].type === "media-feature-expression") {
							node.type = "keyword";
							result[i + 1].type = "media-type";
							result[i + 2].type = "keyword";
							continue;
						}
					}
				}
			}
		}
		return result;
	}

	/**
	 * Parses a media query list. Takes a possible `url()` at the start into
	 * account, and divides the list into media queries that are parsed separately
	 *
	 * @param {string} string - the source media query list string
	 *
	 * @return {Array} an array of Nodes/Containers
	 */

	function parseMediaList(string) {
		const result = [];
		let interimIndex = 0, levelLocal = 0;

		// Check for a `url(...)` part (if it is contents of an @import rule)
		const doesHaveUrl = /^(\s*)url\s*\(/.exec(string);
		if (doesHaveUrl !== null) {
			let i = doesHaveUrl[0].length;
			let parenthesesLv = 1;
			while (parenthesesLv > 0) {
				const character = string[i];
				if (character === "(") { parenthesesLv++; }
				if (character === ")") { parenthesesLv--; }
				i++;
			}
			result.unshift(new Node({
				type: "url",
				value: string.substring(0, i).trim(),
				sourceIndex: doesHaveUrl[1].length,
				before: doesHaveUrl[1],
				after: /^(\s*)/.exec(string.substring(i))[1],
			}));
			interimIndex = i;
		}

		// Start processing the media query list
		for (let i = interimIndex; i < string.length; i++) {
			const character = string[i];

			// Dividing the media query list into comma-separated media queries
			// Only count commas that are outside of any parens
			// (i.e., not part of function call params list, etc.)
			if (character === "(") { levelLocal++; }
			if (character === ")") { levelLocal--; }
			if (levelLocal === 0 && character === ",") {
				const mediaQueryString = string.substring(interimIndex, i);
				const spaceBefore = /^(\s*)/.exec(mediaQueryString)[1];
				result.push(new Container({
					type: "media-query",
					value: mediaQueryString.trim(),
					sourceIndex: interimIndex + spaceBefore.length,
					nodes: parseMediaQuery(mediaQueryString, interimIndex),
					before: spaceBefore,
					after: /(\s*)$/.exec(mediaQueryString)[1],
				}));
				interimIndex = i + 1;
			}
		}

		const mediaQueryString = string.substring(interimIndex);
		const spaceBefore = /^(\s*)/.exec(mediaQueryString)[1];
		result.push(new Container({
			type: "media-query",
			value: mediaQueryString.trim(),
			sourceIndex: interimIndex + spaceBefore.length,
			nodes: parseMediaQuery(mediaQueryString, interimIndex),
			before: spaceBefore,
			after: /(\s*)$/.exec(mediaQueryString)[1],
		}));

		return result;
	}

	function Container(opts) {
		this.constructor(opts);

		this.nodes = opts.nodes;

		if (this.after === undefined) {
			this.after = this.nodes.length > 0 ?
				this.nodes[this.nodes.length - 1].after : "";
		}

		if (this.before === undefined) {
			this.before = this.nodes.length > 0 ?
				this.nodes[0].before : "";
		}

		if (this.sourceIndex === undefined) {
			this.sourceIndex = this.before.length;
		}

		this.nodes.forEach(node => {
			node.parent = this; // eslint-disable-line no-param-reassign
		});
	}

	Container.prototype = Object.create(Node.prototype);
	Container.constructor = Node;

	/**
	 * Iterate over descendant nodes of the node
	 *
	 * @param {RegExp|string} filter - Optional. Only nodes with node.type that
	 *    satisfies the filter will be traversed over
	 * @param {function} cb - callback to call on each node. Takes these params:
	 *    node - the node being processed, i - it's index, nodes - the array
	 *    of all nodes
	 *    If false is returned, the iteration breaks
	 *
	 * @return (boolean) false, if the iteration was broken
	 */
	Container.prototype.walk = function walk(filter, cb) {
		const hasFilter = typeof filter === "string" || filter instanceof RegExp;
		const callback = hasFilter ? cb : filter;
		const filterReg = typeof filter === "string" ? new RegExp(filter) : filter;

		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			const filtered = hasFilter ? filterReg.test(node.type) : true;
			if (filtered && callback && callback(node, i, this.nodes) === false) {
				return false;
			}
			if (node.nodes && node.walk(filter, cb) === false) { return false; }
		}
		return true;
	};

	/**
	 * Iterate over immediate children of the node
	 *
	 * @param {function} cb - callback to call on each node. Takes these params:
	 *    node - the node being processed, i - it's index, nodes - the array
	 *    of all nodes
	 *    If false is returned, the iteration breaks
	 *
	 * @return (boolean) false, if the iteration was broken
	 */
	Container.prototype.each = function each(cb = () => { }) {
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			if (cb(node, i, this.nodes) === false) { return false; }
		}
		return true;
	};

	/**
	 * A very generic node. Pretty much any element of a media query
	 */

	function Node(opts) {
		this.after = opts.after;
		this.before = opts.before;
		this.type = opts.type;
		this.value = opts.value;
		this.sourceIndex = opts.sourceIndex;
	}

	var cssMediaQueryParser = /*#__PURE__*/Object.freeze({
		__proto__: null,
		parseMediaList: parseMediaList
	});

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

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */


	// derived from https://github.com/fmarcia/UglifyCSS

	/**
	 * UglifyCSS
	 * Port of YUI CSS Compressor to NodeJS
	 * Author: Franck Marcia - https://github.com/fmarcia
	 * MIT licenced
	 */

	/**
	 * cssmin.js
	 * Author: Stoyan Stefanov - http://phpied.com/
	 * This is a JavaScript port of the CSS minification tool
	 * distributed with YUICompressor, itself a port
	 * of the cssmin utility by Isaac Schlueter - http://foohack.com/
	 * Permission is hereby granted to use the JavaScript version under the same
	 * conditions as the YUICompressor (original YUICompressor note below).
	 */

	/**
	 * YUI Compressor
	 * http://developer.yahoo.com/yui/compressor/
	 * Author: Julien Lecomte - http://www.julienlecomte.net/
	 * Copyright (c) 2011 Yahoo! Inc. All rights reserved.
	 * The copyrights embodied in the content of this file are licensed
	 * by Yahoo! Inc. under the BSD (revised) open source license.
	 */

	/**
	 * @type {string} - placeholder prefix
	 */

	const ___PRESERVED_TOKEN_ = "___PRESERVED_TOKEN_";

	/**
	 * @typedef {object} options - UglifyCSS options
	 * @property {number} [maxLineLen=0] - Maximum line length of uglified CSS
	 * @property {boolean} [expandVars=false] - Expand variables
	 * @property {boolean} [uglyComments=false] - Removes newlines within preserved comments
	 * @property {boolean} [cuteComments=false] - Preserves newlines within and around preserved comments
	 * @property {boolean} [debug=false] - Prints full error stack on error
	 * @property {string} [output=''] - Output file name
	 */

	/**
	 * @type {options} - UglifyCSS options
	 */

	const defaultOptions = {
		maxLineLen: 0,
		expandVars: false,
		uglyComments: false,
		cuteComments: false,
		debug: false,
		output: ""
	};

	const REGEXP_DATA_URI = /url\(\s*(["']?)data:/g;
	const REGEXP_WHITE_SPACES = /\s+/g;
	const REGEXP_NEW_LINE = /\n/g;

	/**
	 * extractDataUrls replaces all data urls with tokens before we start
	 * compressing, to avoid performance issues running some of the subsequent
	 * regexes against large strings chunks.
	 *
	 * @param {string} css - CSS content
	 * @param {string[]} preservedTokens - Global array of tokens to preserve
	 *
	 * @return {string} Processed CSS
	 */

	function extractDataUrls(css, preservedTokens) {

		// Leave data urls alone to increase parse performance.
		const pattern = REGEXP_DATA_URI;
		const maxIndex = css.length - 1;
		const sb = [];

		let appendIndex = 0, match;

		// Since we need to account for non-base64 data urls, we need to handle
		// ' and ) being part of the data string. Hence switching to indexOf,
		// to determine whether or not we have matching string terminators and
		// handling sb appends directly, instead of using matcher.append* methods.

		while ((match = pattern.exec(css)) !== null) {

			const startIndex = match.index + 4;  // 'url('.length()
			let terminator = match[1];         // ', " or empty (not quoted)

			if (terminator.length === 0) {
				terminator = ")";
			}

			let foundTerminator = false, endIndex = pattern.lastIndex - 1;

			while (foundTerminator === false && endIndex + 1 <= maxIndex && endIndex != -1) {
				endIndex = css.indexOf(terminator, endIndex + 1);

				// endIndex == 0 doesn't really apply here
				if ((endIndex > 0) && (css.charAt(endIndex - 1) !== "\\")) {
					foundTerminator = true;
					if (")" != terminator) {
						endIndex = css.indexOf(")", endIndex);
					}
				}
			}

			// Enough searching, start moving stuff over to the buffer
			sb.push(css.substring(appendIndex, match.index));

			if (foundTerminator) {

				let token = css.substring(startIndex, endIndex);
				const parts = token.split(",");
				if (parts.length > 1 && parts[0].slice(-7) == ";base64") {
					token = token.replace(REGEXP_WHITE_SPACES, "");
				} else {
					token = token.replace(REGEXP_NEW_LINE, " ");
					token = token.replace(REGEXP_WHITE_SPACES, " ");
					token = token.replace(REGEXP_PRESERVE_HSLA1, "");
				}

				preservedTokens.push(token);

				const preserver = "url(" + ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___)";
				sb.push(preserver);

				appendIndex = endIndex + 1;
			} else {
				// No end terminator found, re-add the whole match. Should we throw/warn here?
				sb.push(css.substring(match.index, pattern.lastIndex));
				appendIndex = pattern.lastIndex;
			}
		}

		sb.push(css.substring(appendIndex));

		return sb.join("");
	}

	const REGEXP_HEX_COLORS = /(=\s*?["']?)?#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])(\}|[^0-9a-f{][^{]*?\})/gi;

	/**
	 * compressHexColors compresses hex color values of the form #AABBCC to #ABC.
	 *
	 * DOES NOT compress CSS ID selectors which match the above pattern (which would
	 * break things), like #AddressForm { ... }
	 *
	 * DOES NOT compress IE filters, which have hex color values (which would break
	 * things), like chroma(color='#FFFFFF');
	 *
	 * DOES NOT compress invalid hex values, like background-color: #aabbccdd
	 *
	 * @param {string} css - CSS content
	 *
	 * @return {string} Processed CSS
	 */

	function compressHexColors(css) {

		// Look for hex colors inside { ... } (to avoid IDs) and which don't have a =, or a " in front of them (to avoid filters)

		const pattern = REGEXP_HEX_COLORS;
		const sb = [];

		let index = 0, match;

		while ((match = pattern.exec(css)) !== null) {

			sb.push(css.substring(index, match.index));

			const isFilter = match[1];

			if (isFilter) {
				// Restore, maintain case, otherwise filter will break
				sb.push(match[1] + "#" + (match[2] + match[3] + match[4] + match[5] + match[6] + match[7]));
			} else {
				if (match[2].toLowerCase() == match[3].toLowerCase() &&
					match[4].toLowerCase() == match[5].toLowerCase() &&
					match[6].toLowerCase() == match[7].toLowerCase()) {

					// Compress.
					sb.push("#" + (match[3] + match[5] + match[7]).toLowerCase());
				} else {
					// Non compressible color, restore but lower case.
					sb.push("#" + (match[2] + match[3] + match[4] + match[5] + match[6] + match[7]).toLowerCase());
				}
			}

			index = pattern.lastIndex = pattern.lastIndex - match[8].length;
		}

		sb.push(css.substring(index));

		return sb.join("");
	}

	const REGEXP_KEYFRAMES = /@[a-z0-9-_]*keyframes\s+[a-z0-9-_]+\s*{/gi;
	const REGEXP_WHITE_SPACE = /(^\s|\s$)/g;

	/** keyframes preserves 0 followed by unit in keyframes steps
	 *
	 * @param {string} content - CSS content
	 * @param {string[]} preservedTokens - Global array of tokens to preserve
	 *
	 * @return {string} Processed CSS
	 */

	function keyframes(content, preservedTokens) {

		const pattern = REGEXP_KEYFRAMES;

		let index = 0, buffer;

		const preserve = (part, i) => {
			part = part.replace(REGEXP_WHITE_SPACE, "");
			if (part.charAt(0) === "0") {
				preservedTokens.push(part);
				buffer[i] = ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___";
			}
		};

		while (true) { // eslint-disable-line no-constant-condition

			let level = 0;
			buffer = "";

			let startIndex = content.slice(index).search(pattern);
			if (startIndex < 0) {
				break;
			}

			index += startIndex;
			startIndex = index;

			const len = content.length;
			const buffers = [];

			for (; index < len; ++index) {

				const ch = content.charAt(index);

				if (ch === "{") {

					if (level === 0) {
						buffers.push(buffer.replace(REGEXP_WHITE_SPACE, ""));

					} else if (level === 1) {

						buffer = buffer.split(",");

						buffer.forEach(preserve);

						buffers.push(buffer.join(",").replace(REGEXP_WHITE_SPACE, ""));
					}

					buffer = "";
					level += 1;

				} else if (ch === "}") {

					if (level === 2) {
						buffers.push("{" + buffer.replace(REGEXP_WHITE_SPACE, "") + "}");
						buffer = "";

					} else if (level === 1) {
						content = content.slice(0, startIndex) +
							buffers.shift() + "{" +
							buffers.join("") +
							content.slice(index);
						break;
					}

					level -= 1;
				}

				if (level < 0) {
					break;

				} else if (ch !== "{" && ch !== "}") {
					buffer += ch;
				}
			}
		}

		return content;
	}

	/**
	 * collectComments collects all comment blocks and return new content with comment placeholders
	 *
	 * @param {string} content - CSS content
	 * @param {string[]} comments - Global array of extracted comments
	 *
	 * @return {string} Processed CSS
	 */

	function collectComments(content, comments) {

		const table = [];

		let from = 0, end;

		while (true) { // eslint-disable-line no-constant-condition

			const start = content.indexOf("/*", from);

			if (start > -1) {

				end = content.indexOf("*/", start + 2);

				if (end > -1) {
					comments.push(content.slice(start + 2, end));
					table.push(content.slice(from, start));
					table.push("/*___PRESERVE_CANDIDATE_COMMENT_" + (comments.length - 1) + "___*/");
					from = end + 2;

				} else {
					// unterminated comment
					end = -2;
					break;
				}

			} else {
				break;
			}
		}

		table.push(content.slice(end + 2));

		return table.join("");
	}

	/**
	 * processString uglifies a CSS string
	 *
	 * @param {string} content - CSS string
	 * @param {options} options - UglifyCSS options
	 *
	 * @return {string} Uglified result
	 */

	// const REGEXP_EMPTY_RULES = /[^};{/]+\{\}/g;
	const REGEXP_PRESERVE_STRING = /"([^\\"]|\\.|\\)*"/g;
	const REGEXP_PRESERVE_STRING2 = /'([^\\']|\\.|\\)*'/g;
	const REGEXP_MINIFY_ALPHA = /progid:DXImageTransform.Microsoft.Alpha\(Opacity=/gi;
	const REGEXP_PRESERVE_TOKEN1 = /\r\n/g;
	const REGEXP_PRESERVE_TOKEN2 = /[\r\n]/g;
	const REGEXP_VARIABLES = /@variables\s*\{\s*([^}]+)\s*\}/g;
	const REGEXP_VARIABLE = /\s*([a-z0-9-]+)\s*:\s*([^;}]+)\s*/gi;
	const REGEXP_VARIABLE_VALUE = /var\s*\(\s*([^)]+)\s*\)/g;
	const REGEXP_PRESERVE_CALC = /calc\(([^;}]*)\)/g;
	const REGEXP_TRIM = /(^\s*|\s*$)/g;
	const REGEXP_PRESERVE_CALC2 = /\( /g;
	const REGEXP_PRESERVE_CALC3 = / \)/g;
	const REGEXP_PRESERVE_MATRIX = /\s*filter:\s*progid:DXImageTransform.Microsoft.Matrix\(([^)]+)\);/g;
	const REGEXP_REMOVE_SPACES = /(^|\})(([^{:])+:)+([^{]*{)/g;
	const REGEXP_REMOVE_SPACES2 = /\s+([!{;:>+()\],])/g;
	const REGEXP_REMOVE_SPACES2_BIS = /([^\\])\s+([}])/g;
	const REGEXP_RESTORE_SPACE_IMPORTANT = /!important/g;
	const REGEXP_PSEUDOCLASSCOLON = /___PSEUDOCLASSCOLON___/g;
	const REGEXP_COLUMN = /:/g;
	const REGEXP_PRESERVE_ZERO_UNIT = /\s*(animation|animation-delay|animation-duration|transition|transition-delay|transition-duration):\s*([^;}]+)/gi;
	const REGEXP_PRESERVE_ZERO_UNIT1 = /(^|\D)0?\.?0(m?s)/gi;
	const REGEXP_PRESERVE_FLEX = /\s*(flex|flex-basis):\s*([^;}]+)/gi;
	const REGEXP_SPACES = /\s+/;
	const REGEXP_PRESERVE_HSLA = /(hsla?)\(([^)]+)\)/g;
	const REGEXP_PRESERVE_HSLA1 = /(^\s+|\s+$)/g;
	const REGEXP_RETAIN_SPACE_IE6 = /:first-(line|letter)(\{|,)/gi;
	const REGEXP_CHARSET = /^(.*)(@charset)( "[^"]*";)/gi;
	const REGEXP_REMOVE_SECOND_CHARSET = /^((\s*)(@charset)( [^;]+;\s*))+/gi;
	const REGEXP_LOWERCASE_DIRECTIVES = /@(font-face|import|(?:-(?:atsc|khtml|moz|ms|o|wap|webkit)-)?keyframe|media|page|namespace)/gi;
	const REGEXP_LOWERCASE_PSEUDO_ELEMENTS = /:(active|after|before|checked|disabled|empty|enabled|first-(?:child|of-type)|focus|hover|last-(?:child|of-type)|link|only-(?:child|of-type)|root|:selection|target|visited)/gi;
	const REGEXP_CHARSET2 = /^(.*)(@charset "[^"]*";)/g;
	const REGEXP_CHARSET3 = /^(\s*@charset [^;]+;\s*)+/g;
	const REGEXP_LOWERCASE_FUNCTIONS = /:(lang|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|(?:-(?:atsc|khtml|moz|ms|o|wap|webkit)-)?any)\(/gi;
	const REGEXP_LOWERCASE_FUNCTIONS2 = /([:,( ]\s*)(attr|color-stop|from|rgba|to|url|(?:-(?:atsc|khtml|moz|ms|o|wap|webkit)-)?(?:calc|max|min|(?:repeating-)?(?:linear|radial)-gradient)|-webkit-gradient)/gi;
	const REGEXP_NEWLINE1 = /\s*\/\*/g;
	const REGEXP_NEWLINE2 = /\*\/\s*/g;
	const REGEXP_RESTORE_SPACE1 = /\band\(/gi;
	const REGEXP_RESTORE_SPACE2 = /([^:])not\(/gi;
	const REGEXP_RESTORE_SPACE3 = /\bor\(/gi;
	const REGEXP_REMOVE_SPACES3 = /([!{}:;>+([,])\s+/g;
	const REGEXP_REMOVE_SEMI_COLUMNS = /;+\}/g;
	// const REGEXP_REPLACE_ZERO = /(^|[^.0-9\\])(?:0?\.)?0(?:ex|ch|r?em|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|g?rad|turn|ms|k?Hz|dpi|dpcm|dppx|%)(?![a-z0-9])/gi;
	const REGEXP_REPLACE_ZERO_DOT = /([0-9])\.0(ex|ch|r?em|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|g?rad|turn|m?s|k?Hz|dpi|dpcm|dppx|%| |;)/gi;
	const REGEXP_REPLACE_4_ZEROS = /:0 0 0 0(;|\})/g;
	const REGEXP_REPLACE_3_ZEROS = /:0 0 0(;|\})/g;
	// const REGEXP_REPLACE_2_ZEROS = /:0 0(;|\})/g;
	const REGEXP_REPLACE_1_ZERO = /(transform-origin|webkit-transform-origin|moz-transform-origin|o-transform-origin|ms-transform-origin|box-shadow):0(;|\})/gi;
	const REGEXP_REPLACE_ZERO_DOT_DECIMAL = /(:|\s)0+\.(\d+)/g;
	const REGEXP_REPLACE_RGB = /rgb\s*\(\s*([0-9,\s]+)\s*\)/gi;
	const REGEXP_REPLACE_BORDER_ZERO = /(border|border-top|border-right|border-bottom|border-left|outline|background):none(;|\})/gi;
	const REGEXP_REPLACE_IE_OPACITY = /progid:DXImageTransform\.Microsoft\.Alpha\(Opacity=/gi;
	const REGEXP_REPLACE_QUERY_FRACTION = /\(([-A-Za-z]+):([0-9]+)\/([0-9]+)\)/g;
	const REGEXP_QUERY_FRACTION = /___QUERY_FRACTION___/g;
	const REGEXP_REPLACE_SEMI_COLUMNS = /;;+/g;
	const REGEXP_REPLACE_HASH_COLOR = /(:|\s)(#f00)(;|})/g;
	const REGEXP_PRESERVED_NEWLINE = /___PRESERVED_NEWLINE___/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT1 = /(:|\s)(#000080)(;|})/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT2 = /(:|\s)(#808080)(;|})/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT3 = /(:|\s)(#808000)(;|})/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT4 = /(:|\s)(#800080)(;|})/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT5 = /(:|\s)(#c0c0c0)(;|})/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT6 = /(:|\s)(#008080)(;|})/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT7 = /(:|\s)(#ffa500)(;|})/g;
	const REGEXP_REPLACE_HASH_COLOR_SHORT8 = /(:|\s)(#800000)(;|})/g;

	function processString(content = "", options = defaultOptions) {

		const comments = [];
		const preservedTokens = [];

		let pattern;

		const originalContent = content;
		content = extractDataUrls(content, preservedTokens);
		content = collectComments(content, comments);

		// preserve strings so their content doesn't get accidentally minified
		preserveString(REGEXP_PRESERVE_STRING);
		preserveString(REGEXP_PRESERVE_STRING2);

		function preserveString(pattern) {
			content = content.replace(pattern, token => {
				const quote = token.substring(0, 1);
				token = token.slice(1, -1);
				// maybe the string contains a comment-like substring or more? put'em back then
				if (token.indexOf("___PRESERVE_CANDIDATE_COMMENT_") >= 0) {
					for (let i = 0, len = comments.length; i < len; i += 1) {
						token = token.replace("___PRESERVE_CANDIDATE_COMMENT_" + i + "___", comments[i]);
					}
				}
				// minify alpha opacity in filter strings
				token = token.replace(REGEXP_MINIFY_ALPHA, "alpha(opacity=");
				preservedTokens.push(token);
				return quote + ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___" + quote;
			});
		}

		// strings are safe, now wrestle the comments
		for (let i = 0, len = comments.length; i < len; i += 1) {

			const token = comments[i];
			const placeholder = "___PRESERVE_CANDIDATE_COMMENT_" + i + "___";

			// ! in the first position of the comment means preserve
			// so push to the preserved tokens keeping the !
			if (token.charAt(0) === "!") {
				if (options.cuteComments) {
					preservedTokens.push(token.substring(1).replace(REGEXP_PRESERVE_TOKEN1, "\n"));
				} else if (options.uglyComments) {
					preservedTokens.push(token.substring(1).replace(REGEXP_PRESERVE_TOKEN2, ""));
				} else {
					preservedTokens.push(token);
				}
				content = content.replace(placeholder, ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___");
				continue;
			}

			// \ in the last position looks like hack for Mac/IE5
			// shorten that to /*\*/ and the next one to /**/
			if (token.charAt(token.length - 1) === "\\") {
				preservedTokens.push("\\");
				content = content.replace(placeholder, ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___");
				i = i + 1; // attn: advancing the loop
				preservedTokens.push("");
				content = content.replace(
					"___PRESERVE_CANDIDATE_COMMENT_" + i + "___",
					___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___"
				);
				continue;
			}

			// keep empty comments after child selectors (IE7 hack)
			// e.g. html >/**/ body
			if (token.length === 0) {
				const startIndex = content.indexOf(placeholder);
				if (startIndex > 2) {
					if (content.charAt(startIndex - 3) === ">") {
						preservedTokens.push("");
						content = content.replace(placeholder, ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___");
					}
				}
			}

			// in all other cases kill the comment
			content = content.replace(`/*${placeholder}*/`, "");
		}

		// parse simple @variables blocks and remove them
		if (options.expandVars) {
			const vars = {};
			pattern = REGEXP_VARIABLES;
			content = content.replace(pattern, (_, f1) => {
				pattern = REGEXP_VARIABLE;
				f1.replace(pattern, (_, f1, f2) => {
					if (f1 && f2) {
						vars[f1] = f2;
					}
					return "";
				});
				return "";
			});

			// replace var(x) with the value of x
			pattern = REGEXP_VARIABLE_VALUE;
			content = content.replace(pattern, (_, f1) => {
				return vars[f1] || "none";
			});
		}

		// normalize all whitespace strings to single spaces. Easier to work with that way.
		content = content.replace(REGEXP_WHITE_SPACES, " ");

		// preserve formulas in calc() before removing spaces
		pattern = REGEXP_PRESERVE_CALC;
		content = content.replace(pattern, (_, f1) => {
			preservedTokens.push(
				"calc(" +
				f1.replace(REGEXP_TRIM, "")
					.replace(REGEXP_PRESERVE_CALC2, "(")
					.replace(REGEXP_PRESERVE_CALC3, ")") +
				")"
			);
			return ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___";
		});

		// preserve matrix
		pattern = REGEXP_PRESERVE_MATRIX;
		content = content.replace(pattern, (_, f1) => {
			preservedTokens.push(f1);
			return "filter:progid:DXImageTransform.Microsoft.Matrix(" + ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___);";
		});

		// remove the spaces before the things that should not have spaces before them.
		// but, be careful not to turn 'p :link {...}' into 'p:link{...}'
		// swap out any pseudo-class colons with the token, and then swap back.
		pattern = REGEXP_REMOVE_SPACES;
		content = content.replace(pattern, token => token.replace(REGEXP_COLUMN, "___PSEUDOCLASSCOLON___"));

		// remove spaces before the things that should not have spaces before them.
		content = content.replace(REGEXP_REMOVE_SPACES2, "$1");
		content = content.replace(REGEXP_REMOVE_SPACES2_BIS, "$1$2");

		// restore spaces for !important
		content = content.replace(REGEXP_RESTORE_SPACE_IMPORTANT, " !important");

		// bring back the colon
		content = content.replace(REGEXP_PSEUDOCLASSCOLON, ":");

		// preserve 0 followed by a time unit for properties using time units
		pattern = REGEXP_PRESERVE_ZERO_UNIT;
		content = content.replace(pattern, (_, f1, f2) => {

			f2 = f2.replace(REGEXP_PRESERVE_ZERO_UNIT1, (_, g1, g2) => {
				preservedTokens.push("0" + g2);
				return g1 + ___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___";
			});

			return f1 + ":" + f2;
		});

		// preserve unit for flex-basis within flex and flex-basis (ie10 bug)
		pattern = REGEXP_PRESERVE_FLEX;
		content = content.replace(pattern, (_, f1, f2) => {
			let f2b = f2.split(REGEXP_SPACES);
			preservedTokens.push(f2b.pop());
			f2b.push(___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___");
			f2b = f2b.join(" ");
			return `${f1}:${f2b}`;
		});

		// preserve 0% in hsl and hsla color definitions
		content = content.replace(REGEXP_PRESERVE_HSLA, (_, f1, f2) => {
			const f0 = [];
			f2.split(",").forEach(part => {
				part = part.replace(REGEXP_PRESERVE_HSLA1, "");
				if (part === "0%") {
					preservedTokens.push("0%");
					f0.push(___PRESERVED_TOKEN_ + (preservedTokens.length - 1) + "___");
				} else {
					f0.push(part);
				}
			});
			return f1 + "(" + f0.join(",") + ")";
		});

		// preserve 0 followed by unit in keyframes steps (WIP)
		content = keyframes(content, preservedTokens);

		// retain space for special IE6 cases
		content = content.replace(REGEXP_RETAIN_SPACE_IE6, (_, f1, f2) => ":first-" + f1.toLowerCase() + " " + f2);

		// newlines before and after the end of a preserved comment
		if (options.cuteComments) {
			content = content.replace(REGEXP_NEWLINE1, "___PRESERVED_NEWLINE___/*");
			content = content.replace(REGEXP_NEWLINE2, "*/___PRESERVED_NEWLINE___");
			// no space after the end of a preserved comment
		} else {
			content = content.replace(REGEXP_NEWLINE2, "*/");
		}

		// If there are multiple @charset directives, push them to the top of the file.
		pattern = REGEXP_CHARSET;
		content = content.replace(pattern, (_, f1, f2, f3) => f2.toLowerCase() + f3 + f1);

		// When all @charset are at the top, remove the second and after (as they are completely ignored).
		pattern = REGEXP_REMOVE_SECOND_CHARSET;
		content = content.replace(pattern, (_, __, f2, f3, f4) => f2 + f3.toLowerCase() + f4);

		// lowercase some popular @directives (@charset is done right above)
		pattern = REGEXP_LOWERCASE_DIRECTIVES;
		content = content.replace(pattern, (_, f1) => "@" + f1.toLowerCase());

		// lowercase some more common pseudo-elements
		pattern = REGEXP_LOWERCASE_PSEUDO_ELEMENTS;
		content = content.replace(pattern, (_, f1) => ":" + f1.toLowerCase());

		// if there is a @charset, then only allow one, and push to the top of the file.
		content = content.replace(REGEXP_CHARSET2, "$2$1");
		content = content.replace(REGEXP_CHARSET3, "$1");

		// lowercase some more common functions
		pattern = REGEXP_LOWERCASE_FUNCTIONS;
		content = content.replace(pattern, (_, f1) => ":" + f1.toLowerCase() + "(");

		// lower case some common function that can be values
		// NOTE: rgb() isn't useful as we replace with #hex later, as well as and() is already done for us right after this
		pattern = REGEXP_LOWERCASE_FUNCTIONS2;
		content = content.replace(pattern, (_, f1, f2) => f1 + f2.toLowerCase());

		// put the space back in some cases, to support stuff like
		// @media screen and (-webkit-min-device-pixel-ratio:0){
		content = content.replace(REGEXP_RESTORE_SPACE1, "and (");
		content = content.replace(REGEXP_RESTORE_SPACE2, "$1not (");
		content = content.replace(REGEXP_RESTORE_SPACE3, "or (");

		// remove the spaces after the things that should not have spaces after them.
		content = content.replace(REGEXP_REMOVE_SPACES3, "$1");

		// remove unnecessary semicolons
		content = content.replace(REGEXP_REMOVE_SEMI_COLUMNS, "}");

		// replace 0(px,em,%) with 0.
		// content = content.replace(REGEXP_REPLACE_ZERO, "$10");

		// Replace x.0(px,em,%) with x(px,em,%).
		content = content.replace(REGEXP_REPLACE_ZERO_DOT, "$1$2");

		// replace 0 0 0 0; with 0.
		content = content.replace(REGEXP_REPLACE_4_ZEROS, ":0$1");
		content = content.replace(REGEXP_REPLACE_3_ZEROS, ":0$1");
		// content = content.replace(REGEXP_REPLACE_2_ZEROS, ":0$1");

		// replace background-position:0; with background-position:0 0;
		// same for transform-origin and box-shadow
		pattern = REGEXP_REPLACE_1_ZERO;
		content = content.replace(pattern, (_, f1, f2) => f1.toLowerCase() + ":0 0" + f2);

		// replace 0.6 to .6, but only when preceded by : or a white-space
		content = content.replace(REGEXP_REPLACE_ZERO_DOT_DECIMAL, "$1.$2");

		// shorten colors from rgb(51,102,153) to #336699
		// this makes it more likely that it'll get further compressed in the next step.
		pattern = REGEXP_REPLACE_RGB;
		content = content.replace(pattern, (_, f1) => {
			const rgbcolors = f1.split(",");
			let hexcolor = "#";
			for (let i = 0; i < rgbcolors.length; i += 1) {
				let val = parseInt(rgbcolors[i], 10);
				if (val < 16) {
					hexcolor += "0";
				}
				if (val > 255) {
					val = 255;
				}
				hexcolor += val.toString(16);
			}
			return hexcolor;
		});

		// Shorten colors from #AABBCC to #ABC.
		content = compressHexColors(content);

		// Replace #f00 -> red
		content = content.replace(REGEXP_REPLACE_HASH_COLOR, "$1red$3");

		// Replace other short color keywords
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT1, "$1navy$3");
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT2, "$1gray$3");
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT3, "$1olive$3");
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT4, "$1purple$3");
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT5, "$1silver$3");
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT6, "$1teal$3");
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT7, "$1orange$3");
		content = content.replace(REGEXP_REPLACE_HASH_COLOR_SHORT8, "$1maroon$3");

		// border: none -> border:0
		pattern = REGEXP_REPLACE_BORDER_ZERO;
		content = content.replace(pattern, (_, f1, f2) => f1.toLowerCase() + ":0" + f2);

		// shorter opacity IE filter
		content = content.replace(REGEXP_REPLACE_IE_OPACITY, "alpha(opacity=");

		// Find a fraction that is used for Opera's -o-device-pixel-ratio query
		// Add token to add the '\' back in later
		content = content.replace(REGEXP_REPLACE_QUERY_FRACTION, "($1:$2___QUERY_FRACTION___$3)");

		// remove empty rules.
		// content = content.replace(REGEXP_EMPTY_RULES, "");

		// Add '\' back to fix Opera -o-device-pixel-ratio query
		content = content.replace(REGEXP_QUERY_FRACTION, "/");

		// some source control tools don't like it when files containing lines longer
		// than, say 8000 characters, are checked in. The linebreak option is used in
		// that case to split long lines after a specific column.
		if (options.maxLineLen > 0) {
			const lines = [];
			let line = [];
			for (let i = 0, len = content.length; i < len; i += 1) {
				const ch = content.charAt(i);
				line.push(ch);
				if (ch === "}" && line.length > options.maxLineLen) {
					lines.push(line.join(""));
					line = [];
				}
			}
			if (line.length) {
				lines.push(line.join(""));
			}

			content = lines.join("\n");
		}

		// replace multiple semi-colons in a row by a single one
		// see SF bug #1980989
		content = content.replace(REGEXP_REPLACE_SEMI_COLUMNS, ";");

		// trim the final string (for any leading or trailing white spaces)
		content = content.replace(REGEXP_TRIM, "");

		if (preservedTokens.length > 1000) {
			return originalContent;
		}

		// restore preserved tokens
		for (let i = preservedTokens.length - 1; i >= 0; i--) {
			content = content.replace(___PRESERVED_TOKEN_ + i + "___", preservedTokens[i], "g");
		}

		// restore preserved newlines
		content = content.replace(REGEXP_PRESERVED_NEWLINE, "\n");

		// return
		return content;
	}

	var cssMinifier = /*#__PURE__*/Object.freeze({
		__proto__: null,
		defaultOptions: defaultOptions,
		processString: processString
	});

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

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	// Derived from https://github.com/csstree/csstree

	// The minified code in the IIFE is generated by running the following command.
	//   rollup --config

	/*
	 * The MIT License (MIT)
	 * Copyright (C) 2016-2019 by Roman Dvornov
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

	//
	//                              list
	//                            ┌──────┐
	//             ┌──────────────┼─head │
	//             │              │ tail─┼──────────────┐
	//             │              └──────┘              │
	//             ▼                                    ▼
	//            item        item        item        item
	//          ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
	//  null ◀──┼─prev │◀───┼─prev │◀───┼─prev │◀───┼─prev │
	//          │ next─┼───▶│ next─┼───▶│ next─┼───▶│ next─┼──▶ null
	//          ├──────┤    ├──────┤    ├──────┤    ├──────┤
	//          │ data │    │ data │    │ data │    │ data │
	//          └──────┘    └──────┘    └──────┘    └──────┘
	//

	function createItem(data) {
	  return {
	      prev: null,
	      next: null,
	      data: data
	  };
	}

	function allocateCursor(node, prev, next) {
	  var cursor;

	  if (cursors !== null) {
	      cursor = cursors;
	      cursors = cursors.cursor;
	      cursor.prev = prev;
	      cursor.next = next;
	      cursor.cursor = node.cursor;
	  } else {
	      cursor = {
	          prev: prev,
	          next: next,
	          cursor: node.cursor
	      };
	  }

	  node.cursor = cursor;

	  return cursor;
	}

	function releaseCursor(node) {
	  var cursor = node.cursor;

	  node.cursor = cursor.cursor;
	  cursor.prev = null;
	  cursor.next = null;
	  cursor.cursor = cursors;
	  cursors = cursor;
	}

	var cursors = null;
	var List = function() {
	  this.cursor = null;
	  this.head = null;
	  this.tail = null;
	};

	List.createItem = createItem;
	List.prototype.createItem = createItem;

	List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
	  var cursor = this.cursor;

	  while (cursor !== null) {
	      if (cursor.prev === prevOld) {
	          cursor.prev = prevNew;
	      }

	      if (cursor.next === nextOld) {
	          cursor.next = nextNew;
	      }

	      cursor = cursor.cursor;
	  }
	};

	List.prototype.getSize = function() {
	  var size = 0;
	  var cursor = this.head;

	  while (cursor) {
	      size++;
	      cursor = cursor.next;
	  }

	  return size;
	};

	List.prototype.fromArray = function(array) {
	  var cursor = null;

	  this.head = null;

	  for (var i = 0; i < array.length; i++) {
	      var item = createItem(array[i]);

	      if (cursor !== null) {
	          cursor.next = item;
	      } else {
	          this.head = item;
	      }

	      item.prev = cursor;
	      cursor = item;
	  }

	  this.tail = cursor;

	  return this;
	};

	List.prototype.toArray = function() {
	  var cursor = this.head;
	  var result = [];

	  while (cursor) {
	      result.push(cursor.data);
	      cursor = cursor.next;
	  }

	  return result;
	};

	List.prototype.toJSON = List.prototype.toArray;

	List.prototype.isEmpty = function() {
	  return this.head === null;
	};

	List.prototype.first = function() {
	  return this.head && this.head.data;
	};

	List.prototype.last = function() {
	  return this.tail && this.tail.data;
	};

	List.prototype.each = function(fn, context) {
	  var item;

	  if (context === undefined) {
	      context = this;
	  }

	  // push cursor
	  var cursor = allocateCursor(this, null, this.head);

	  while (cursor.next !== null) {
	      item = cursor.next;
	      cursor.next = item.next;

	      fn.call(context, item.data, item, this);
	  }

	  // pop cursor
	  releaseCursor(this);
	};

	List.prototype.forEach = List.prototype.each;

	List.prototype.eachRight = function(fn, context) {
	  var item;

	  if (context === undefined) {
	      context = this;
	  }

	  // push cursor
	  var cursor = allocateCursor(this, this.tail, null);

	  while (cursor.prev !== null) {
	      item = cursor.prev;
	      cursor.prev = item.prev;

	      fn.call(context, item.data, item, this);
	  }

	  // pop cursor
	  releaseCursor(this);
	};

	List.prototype.forEachRight = List.prototype.eachRight;

	List.prototype.reduce = function(fn, initialValue, context) {
	  var item;

	  if (context === undefined) {
	      context = this;
	  }

	  // push cursor
	  var cursor = allocateCursor(this, null, this.head);
	  var acc = initialValue;

	  while (cursor.next !== null) {
	      item = cursor.next;
	      cursor.next = item.next;

	      acc = fn.call(context, acc, item.data, item, this);
	  }

	  // pop cursor
	  releaseCursor(this);

	  return acc;
	};

	List.prototype.reduceRight = function(fn, initialValue, context) {
	  var item;

	  if (context === undefined) {
	      context = this;
	  }

	  // push cursor
	  var cursor = allocateCursor(this, this.tail, null);
	  var acc = initialValue;

	  while (cursor.prev !== null) {
	      item = cursor.prev;
	      cursor.prev = item.prev;

	      acc = fn.call(context, acc, item.data, item, this);
	  }

	  // pop cursor
	  releaseCursor(this);

	  return acc;
	};

	List.prototype.nextUntil = function(start, fn, context) {
	  if (start === null) {
	      return;
	  }

	  var item;

	  if (context === undefined) {
	      context = this;
	  }

	  // push cursor
	  var cursor = allocateCursor(this, null, start);

	  while (cursor.next !== null) {
	      item = cursor.next;
	      cursor.next = item.next;

	      if (fn.call(context, item.data, item, this)) {
	          break;
	      }
	  }

	  // pop cursor
	  releaseCursor(this);
	};

	List.prototype.prevUntil = function(start, fn, context) {
	  if (start === null) {
	      return;
	  }

	  var item;

	  if (context === undefined) {
	      context = this;
	  }

	  // push cursor
	  var cursor = allocateCursor(this, start, null);

	  while (cursor.prev !== null) {
	      item = cursor.prev;
	      cursor.prev = item.prev;

	      if (fn.call(context, item.data, item, this)) {
	          break;
	      }
	  }

	  // pop cursor
	  releaseCursor(this);
	};

	List.prototype.some = function(fn, context) {
	  var cursor = this.head;

	  if (context === undefined) {
	      context = this;
	  }

	  while (cursor !== null) {
	      if (fn.call(context, cursor.data, cursor, this)) {
	          return true;
	      }

	      cursor = cursor.next;
	  }

	  return false;
	};

	List.prototype.map = function(fn, context) {
	  var result = new List();
	  var cursor = this.head;

	  if (context === undefined) {
	      context = this;
	  }

	  while (cursor !== null) {
	      result.appendData(fn.call(context, cursor.data, cursor, this));
	      cursor = cursor.next;
	  }

	  return result;
	};

	List.prototype.filter = function(fn, context) {
	  var result = new List();
	  var cursor = this.head;

	  if (context === undefined) {
	      context = this;
	  }

	  while (cursor !== null) {
	      if (fn.call(context, cursor.data, cursor, this)) {
	          result.appendData(cursor.data);
	      }
	      cursor = cursor.next;
	  }

	  return result;
	};

	List.prototype.clear = function() {
	  this.head = null;
	  this.tail = null;
	};

	List.prototype.copy = function() {
	  var result = new List();
	  var cursor = this.head;

	  while (cursor !== null) {
	      result.insert(createItem(cursor.data));
	      cursor = cursor.next;
	  }

	  return result;
	};

	List.prototype.prepend = function(item) {
	  //      head
	  //    ^
	  // item
	  this.updateCursors(null, item, this.head, item);

	  // insert to the beginning of the list
	  if (this.head !== null) {
	      // new item <- first item
	      this.head.prev = item;

	      // new item -> first item
	      item.next = this.head;
	  } else {
	      // if list has no head, then it also has no tail
	      // in this case tail points to the new item
	      this.tail = item;
	  }

	  // head always points to new item
	  this.head = item;

	  return this;
	};

	List.prototype.prependData = function(data) {
	  return this.prepend(createItem(data));
	};

	List.prototype.append = function(item) {
	  return this.insert(item);
	};

	List.prototype.appendData = function(data) {
	  return this.insert(createItem(data));
	};

	List.prototype.insert = function(item, before) {
	  if (before !== undefined && before !== null) {
	      // prev   before
	      //      ^
	      //     item
	      this.updateCursors(before.prev, item, before, item);

	      if (before.prev === null) {
	          // insert to the beginning of list
	          if (this.head !== before) {
	              throw new Error('before doesn\'t belong to list');
	          }

	          // since head points to before therefore list doesn't empty
	          // no need to check tail
	          this.head = item;
	          before.prev = item;
	          item.next = before;

	          this.updateCursors(null, item);
	      } else {

	          // insert between two items
	          before.prev.next = item;
	          item.prev = before.prev;

	          before.prev = item;
	          item.next = before;
	      }
	  } else {
	      // tail
	      //      ^
	      //      item
	      this.updateCursors(this.tail, item, null, item);

	      // insert to the ending of the list
	      if (this.tail !== null) {
	          // last item -> new item
	          this.tail.next = item;

	          // last item <- new item
	          item.prev = this.tail;
	      } else {
	          // if list has no tail, then it also has no head
	          // in this case head points to new item
	          this.head = item;
	      }

	      // tail always points to new item
	      this.tail = item;
	  }

	  return this;
	};

	List.prototype.insertData = function(data, before) {
	  return this.insert(createItem(data), before);
	};

	List.prototype.remove = function(item) {
	  //      item
	  //       ^
	  // prev     next
	  this.updateCursors(item, item.prev, item, item.next);

	  if (item.prev !== null) {
	      item.prev.next = item.next;
	  } else {
	      if (this.head !== item) {
	          throw new Error('item doesn\'t belong to list');
	      }

	      this.head = item.next;
	  }

	  if (item.next !== null) {
	      item.next.prev = item.prev;
	  } else {
	      if (this.tail !== item) {
	          throw new Error('item doesn\'t belong to list');
	      }

	      this.tail = item.prev;
	  }

	  item.prev = null;
	  item.next = null;

	  return item;
	};

	List.prototype.push = function(data) {
	  this.insert(createItem(data));
	};

	List.prototype.pop = function() {
	  if (this.tail !== null) {
	      return this.remove(this.tail);
	  }
	};

	List.prototype.unshift = function(data) {
	  this.prepend(createItem(data));
	};

	List.prototype.shift = function() {
	  if (this.head !== null) {
	      return this.remove(this.head);
	  }
	};

	List.prototype.prependList = function(list) {
	  return this.insertList(list, this.head);
	};

	List.prototype.appendList = function(list) {
	  return this.insertList(list);
	};

	List.prototype.insertList = function(list, before) {
	  // ignore empty lists
	  if (list.head === null) {
	      return this;
	  }

	  if (before !== undefined && before !== null) {
	      this.updateCursors(before.prev, list.tail, before, list.head);

	      // insert in the middle of dist list
	      if (before.prev !== null) {
	          // before.prev <-> list.head
	          before.prev.next = list.head;
	          list.head.prev = before.prev;
	      } else {
	          this.head = list.head;
	      }

	      before.prev = list.tail;
	      list.tail.next = before;
	  } else {
	      this.updateCursors(this.tail, list.tail, null, list.head);

	      // insert to end of the list
	      if (this.tail !== null) {
	          // if destination list has a tail, then it also has a head,
	          // but head doesn't change

	          // dest tail -> source head
	          this.tail.next = list.head;

	          // dest tail <- source head
	          list.head.prev = this.tail;
	      } else {
	          // if list has no a tail, then it also has no a head
	          // in this case points head to new item
	          this.head = list.head;
	      }

	      // tail always start point to new item
	      this.tail = list.tail;
	  }

	  list.head = null;
	  list.tail = null;

	  return this;
	};

	List.prototype.replace = function(oldItem, newItemOrList) {
	  if ('head' in newItemOrList) {
	      this.insertList(newItemOrList, oldItem);
	  } else {
	      this.insert(newItemOrList, oldItem);
	  }

	  this.remove(oldItem);
	};

	var List_1 = List;

	var createCustomError = function createCustomError(name, message) {
	  // use Object.create(), because some VMs prevent setting line/column otherwise
	  // (iOS Safari 10 even throws an exception)
	  var error = Object.create(SyntaxError.prototype);
	  var errorStack = new Error();

	  error.name = name;
	  error.message = message;

	  Object.defineProperty(error, 'stack', {
	      get: function() {
	          return (errorStack.stack || '').replace(/^(.+\n){1,3}/, name + ': ' + message + '\n');
	      }
	  });

	  return error;
	};

	var MAX_LINE_LENGTH = 100;
	var OFFSET_CORRECTION = 60;
	var TAB_REPLACEMENT = '    ';

	function sourceFragment(error, extraLines) {
	  function processLines(start, end) {
	      return lines.slice(start, end).map(function(line, idx) {
	          var num = String(start + idx + 1);

	          while (num.length < maxNumLength) {
	              num = ' ' + num;
	          }

	          return num + ' |' + line;
	      }).join('\n');
	  }

	  var lines = error.source.split(/\r\n?|\n|\f/);
	  var line = error.line;
	  var column = error.column;
	  var startLine = Math.max(1, line - extraLines) - 1;
	  var endLine = Math.min(line + extraLines, lines.length + 1);
	  var maxNumLength = Math.max(4, String(endLine).length) + 1;
	  var cutLeft = 0;

	  // column correction according to replaced tab before column
	  column += (TAB_REPLACEMENT.length - 1) * (lines[line - 1].substr(0, column - 1).match(/\t/g) || []).length;

	  if (column > MAX_LINE_LENGTH) {
	      cutLeft = column - OFFSET_CORRECTION + 3;
	      column = OFFSET_CORRECTION - 2;
	  }

	  for (var i = startLine; i <= endLine; i++) {
	      if (i >= 0 && i < lines.length) {
	          lines[i] = lines[i].replace(/\t/g, TAB_REPLACEMENT);
	          lines[i] =
	              (cutLeft > 0 && lines[i].length > cutLeft ? '\u2026' : '') +
	              lines[i].substr(cutLeft, MAX_LINE_LENGTH - 2) +
	              (lines[i].length > cutLeft + MAX_LINE_LENGTH - 1 ? '\u2026' : '');
	      }
	  }

	  return [
	      processLines(startLine, line),
	      new Array(column + maxNumLength + 2).join('-') + '^',
	      processLines(line, endLine)
	  ].filter(Boolean).join('\n');
	}

	var SyntaxError$1 = function(message, source, offset, line, column) {
	  var error = createCustomError('SyntaxError', message);

	  error.source = source;
	  error.offset = offset;
	  error.line = line;
	  error.column = column;

	  error.sourceFragment = function(extraLines) {
	      return sourceFragment(error, isNaN(extraLines) ? 0 : extraLines);
	  };
	  Object.defineProperty(error, 'formattedMessage', {
	      get: function() {
	          return (
	              'Parse error: ' + error.message + '\n' +
	              sourceFragment(error, 2)
	          );
	      }
	  });

	  // for backward capability
	  error.parseError = {
	      offset: offset,
	      line: line,
	      column: column
	  };

	  return error;
	};

	var _SyntaxError = SyntaxError$1;

	// CSS Syntax Module Level 3
	// https://www.w3.org/TR/css-syntax-3/
	var TYPE = {
	  EOF: 0,                 // <EOF-token>
	  Ident: 1,               // <ident-token>
	  Function: 2,            // <function-token>
	  AtKeyword: 3,           // <at-keyword-token>
	  Hash: 4,                // <hash-token>
	  String: 5,              // <string-token>
	  BadString: 6,           // <bad-string-token>
	  Url: 7,                 // <url-token>
	  BadUrl: 8,              // <bad-url-token>
	  Delim: 9,               // <delim-token>
	  Number: 10,             // <number-token>
	  Percentage: 11,         // <percentage-token>
	  Dimension: 12,          // <dimension-token>
	  WhiteSpace: 13,         // <whitespace-token>
	  CDO: 14,                // <CDO-token>
	  CDC: 15,                // <CDC-token>
	  Colon: 16,              // <colon-token>     :
	  Semicolon: 17,          // <semicolon-token> ;
	  Comma: 18,              // <comma-token>     ,
	  LeftSquareBracket: 19,  // <[-token>
	  RightSquareBracket: 20, // <]-token>
	  LeftParenthesis: 21,    // <(-token>
	  RightParenthesis: 22,   // <)-token>
	  LeftCurlyBracket: 23,   // <{-token>
	  RightCurlyBracket: 24,  // <}-token>
	  Comment: 25
	};

	var NAME = Object.keys(TYPE).reduce(function(result, key) {
	  result[TYPE[key]] = key;
	  return result;
	}, {});

	var _const = {
	  TYPE: TYPE,
	  NAME: NAME
	};

	var EOF = 0;

	// https://drafts.csswg.org/css-syntax-3/
	// § 4.2. Definitions

	// digit
	// A code point between U+0030 DIGIT ZERO (0) and U+0039 DIGIT NINE (9).
	function isDigit(code) {
	  return code >= 0x0030 && code <= 0x0039;
	}

	// hex digit
	// A digit, or a code point between U+0041 LATIN CAPITAL LETTER A (A) and U+0046 LATIN CAPITAL LETTER F (F),
	// or a code point between U+0061 LATIN SMALL LETTER A (a) and U+0066 LATIN SMALL LETTER F (f).
	function isHexDigit(code) {
	  return (
	      isDigit(code) || // 0 .. 9
	      (code >= 0x0041 && code <= 0x0046) || // A .. F
	      (code >= 0x0061 && code <= 0x0066)    // a .. f
	  );
	}

	// uppercase letter
	// A code point between U+0041 LATIN CAPITAL LETTER A (A) and U+005A LATIN CAPITAL LETTER Z (Z).
	function isUppercaseLetter(code) {
	  return code >= 0x0041 && code <= 0x005A;
	}

	// lowercase letter
	// A code point between U+0061 LATIN SMALL LETTER A (a) and U+007A LATIN SMALL LETTER Z (z).
	function isLowercaseLetter(code) {
	  return code >= 0x0061 && code <= 0x007A;
	}

	// letter
	// An uppercase letter or a lowercase letter.
	function isLetter(code) {
	  return isUppercaseLetter(code) || isLowercaseLetter(code);
	}

	// non-ASCII code point
	// A code point with a value equal to or greater than U+0080 <control>.
	function isNonAscii(code) {
	  return code >= 0x0080;
	}

	// name-start code point
	// A letter, a non-ASCII code point, or U+005F LOW LINE (_).
	function isNameStart(code) {
	  return isLetter(code) || isNonAscii(code) || code === 0x005F;
	}

	// name code point
	// A name-start code point, a digit, or U+002D HYPHEN-MINUS (-).
	function isName(code) {
	  return isNameStart(code) || isDigit(code) || code === 0x002D;
	}

	// non-printable code point
	// A code point between U+0000 NULL and U+0008 BACKSPACE, or U+000B LINE TABULATION,
	// or a code point between U+000E SHIFT OUT and U+001F INFORMATION SEPARATOR ONE, or U+007F DELETE.
	function isNonPrintable(code) {
	  return (
	      (code >= 0x0000 && code <= 0x0008) ||
	      (code === 0x000B) ||
	      (code >= 0x000E && code <= 0x001F) ||
	      (code === 0x007F)
	  );
	}

	// newline
	// U+000A LINE FEED. Note that U+000D CARRIAGE RETURN and U+000C FORM FEED are not included in this definition,
	// as they are converted to U+000A LINE FEED during preprocessing.
	// TODO: we doesn't do a preprocessing, so check a code point for U+000D CARRIAGE RETURN and U+000C FORM FEED
	function isNewline(code) {
	  return code === 0x000A || code === 0x000D || code === 0x000C;
	}

	// whitespace
	// A newline, U+0009 CHARACTER TABULATION, or U+0020 SPACE.
	function isWhiteSpace(code) {
	  return isNewline(code) || code === 0x0020 || code === 0x0009;
	}

	// § 4.3.8. Check if two code points are a valid escape
	function isValidEscape(first, second) {
	  // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
	  if (first !== 0x005C) {
	      return false;
	  }

	  // Otherwise, if the second code point is a newline or EOF, return false.
	  if (isNewline(second) || second === EOF) {
	      return false;
	  }

	  // Otherwise, return true.
	  return true;
	}

	// § 4.3.9. Check if three code points would start an identifier
	function isIdentifierStart(first, second, third) {
	  // Look at the first code point:

	  // U+002D HYPHEN-MINUS
	  if (first === 0x002D) {
	      // If the second code point is a name-start code point or a U+002D HYPHEN-MINUS,
	      // or the second and third code points are a valid escape, return true. Otherwise, return false.
	      return (
	          isNameStart(second) ||
	          second === 0x002D ||
	          isValidEscape(second, third)
	      );
	  }

	  // name-start code point
	  if (isNameStart(first)) {
	      // Return true.
	      return true;
	  }

	  // U+005C REVERSE SOLIDUS (\)
	  if (first === 0x005C) {
	      // If the first and second code points are a valid escape, return true. Otherwise, return false.
	      return isValidEscape(first, second);
	  }

	  // anything else
	  // Return false.
	  return false;
	}

	// § 4.3.10. Check if three code points would start a number
	function isNumberStart(first, second, third) {
	  // Look at the first code point:

	  // U+002B PLUS SIGN (+)
	  // U+002D HYPHEN-MINUS (-)
	  if (first === 0x002B || first === 0x002D) {
	      // If the second code point is a digit, return true.
	      if (isDigit(second)) {
	          return 2;
	      }

	      // Otherwise, if the second code point is a U+002E FULL STOP (.)
	      // and the third code point is a digit, return true.
	      // Otherwise, return false.
	      return second === 0x002E && isDigit(third) ? 3 : 0;
	  }

	  // U+002E FULL STOP (.)
	  if (first === 0x002E) {
	      // If the second code point is a digit, return true. Otherwise, return false.
	      return isDigit(second) ? 2 : 0;
	  }

	  // digit
	  if (isDigit(first)) {
	      // Return true.
	      return 1;
	  }

	  // anything else
	  // Return false.
	  return 0;
	}

	//
	// Misc
	//

	// detect BOM (https://en.wikipedia.org/wiki/Byte_order_mark)
	function isBOM(code) {
	  // UTF-16BE
	  if (code === 0xFEFF) {
	      return 1;
	  }

	  // UTF-16LE
	  if (code === 0xFFFE) {
	      return 1;
	  }

	  return 0;
	}

	// Fast code category
	//
	// https://drafts.csswg.org/css-syntax/#tokenizer-definitions
	// > non-ASCII code point
	// >   A code point with a value equal to or greater than U+0080 <control>
	// > name-start code point
	// >   A letter, a non-ASCII code point, or U+005F LOW LINE (_).
	// > name code point
	// >   A name-start code point, a digit, or U+002D HYPHEN-MINUS (-)
	// That means only ASCII code points has a special meaning and we define a maps for 0..127 codes only
	var CATEGORY = new Array(0x80);
	charCodeCategory.Eof = 0x80;
	charCodeCategory.WhiteSpace = 0x82;
	charCodeCategory.Digit = 0x83;
	charCodeCategory.NameStart = 0x84;
	charCodeCategory.NonPrintable = 0x85;

	for (var i = 0; i < CATEGORY.length; i++) {
	  switch (true) {
	      case isWhiteSpace(i):
	          CATEGORY[i] = charCodeCategory.WhiteSpace;
	          break;

	      case isDigit(i):
	          CATEGORY[i] = charCodeCategory.Digit;
	          break;

	      case isNameStart(i):
	          CATEGORY[i] = charCodeCategory.NameStart;
	          break;

	      case isNonPrintable(i):
	          CATEGORY[i] = charCodeCategory.NonPrintable;
	          break;

	      default:
	          CATEGORY[i] = i || charCodeCategory.Eof;
	  }
	}

	function charCodeCategory(code) {
	  return code < 0x80 ? CATEGORY[code] : charCodeCategory.NameStart;
	}
	var charCodeDefinitions = {
	  isDigit: isDigit,
	  isHexDigit: isHexDigit,
	  isUppercaseLetter: isUppercaseLetter,
	  isLowercaseLetter: isLowercaseLetter,
	  isLetter: isLetter,
	  isNonAscii: isNonAscii,
	  isNameStart: isNameStart,
	  isName: isName,
	  isNonPrintable: isNonPrintable,
	  isNewline: isNewline,
	  isWhiteSpace: isWhiteSpace,
	  isValidEscape: isValidEscape,
	  isIdentifierStart: isIdentifierStart,
	  isNumberStart: isNumberStart,

	  isBOM: isBOM,
	  charCodeCategory: charCodeCategory
	};

	var isDigit$1 = charCodeDefinitions.isDigit;
	var isHexDigit$1 = charCodeDefinitions.isHexDigit;
	var isUppercaseLetter$1 = charCodeDefinitions.isUppercaseLetter;
	var isName$1 = charCodeDefinitions.isName;
	var isWhiteSpace$1 = charCodeDefinitions.isWhiteSpace;
	var isValidEscape$1 = charCodeDefinitions.isValidEscape;

	function getCharCode(source, offset) {
	  return offset < source.length ? source.charCodeAt(offset) : 0;
	}

	function getNewlineLength(source, offset, code) {
	  if (code === 13 /* \r */ && getCharCode(source, offset + 1) === 10 /* \n */) {
	      return 2;
	  }

	  return 1;
	}

	function cmpChar(testStr, offset, referenceCode) {
	  var code = testStr.charCodeAt(offset);

	  // code.toLowerCase() for A..Z
	  if (isUppercaseLetter$1(code)) {
	      code = code | 32;
	  }

	  return code === referenceCode;
	}

	function cmpStr(testStr, start, end, referenceStr) {
	  if (end - start !== referenceStr.length) {
	      return false;
	  }

	  if (start < 0 || end > testStr.length) {
	      return false;
	  }

	  for (var i = start; i < end; i++) {
	      var testCode = testStr.charCodeAt(i);
	      var referenceCode = referenceStr.charCodeAt(i - start);

	      // testCode.toLowerCase() for A..Z
	      if (isUppercaseLetter$1(testCode)) {
	          testCode = testCode | 32;
	      }

	      if (testCode !== referenceCode) {
	          return false;
	      }
	  }

	  return true;
	}

	function findWhiteSpaceStart(source, offset) {
	  for (; offset >= 0; offset--) {
	      if (!isWhiteSpace$1(source.charCodeAt(offset))) {
	          break;
	      }
	  }

	  return offset + 1;
	}

	function findWhiteSpaceEnd(source, offset) {
	  for (; offset < source.length; offset++) {
	      if (!isWhiteSpace$1(source.charCodeAt(offset))) {
	          break;
	      }
	  }

	  return offset;
	}

	function findDecimalNumberEnd(source, offset) {
	  for (; offset < source.length; offset++) {
	      if (!isDigit$1(source.charCodeAt(offset))) {
	          break;
	      }
	  }

	  return offset;
	}

	// § 4.3.7. Consume an escaped code point
	function consumeEscaped(source, offset) {
	  // It assumes that the U+005C REVERSE SOLIDUS (\) has already been consumed and
	  // that the next input code point has already been verified to be part of a valid escape.
	  offset += 2;

	  // hex digit
	  if (isHexDigit$1(getCharCode(source, offset - 1))) {
	      // Consume as many hex digits as possible, but no more than 5.
	      // Note that this means 1-6 hex digits have been consumed in total.
	      for (var maxOffset = Math.min(source.length, offset + 5); offset < maxOffset; offset++) {
	          if (!isHexDigit$1(getCharCode(source, offset))) {
	              break;
	          }
	      }

	      // If the next input code point is whitespace, consume it as well.
	      var code = getCharCode(source, offset);
	      if (isWhiteSpace$1(code)) {
	          offset += getNewlineLength(source, offset, code);
	      }
	  }

	  return offset;
	}

	// §4.3.11. Consume a name
	// Note: This algorithm does not do the verification of the first few code points that are necessary
	// to ensure the returned code points would constitute an <ident-token>. If that is the intended use,
	// ensure that the stream starts with an identifier before calling this algorithm.
	function consumeName(source, offset) {
	  // Let result initially be an empty string.
	  // Repeatedly consume the next input code point from the stream:
	  for (; offset < source.length; offset++) {
	      var code = source.charCodeAt(offset);

	      // name code point
	      if (isName$1(code)) {
	          // Append the code point to result.
	          continue;
	      }

	      // the stream starts with a valid escape
	      if (isValidEscape$1(code, getCharCode(source, offset + 1))) {
	          // Consume an escaped code point. Append the returned code point to result.
	          offset = consumeEscaped(source, offset) - 1;
	          continue;
	      }

	      // anything else
	      // Reconsume the current input code point. Return result.
	      break;
	  }

	  return offset;
	}

	// §4.3.12. Consume a number
	function consumeNumber(source, offset) {
	  var code = source.charCodeAt(offset);

	  // 2. If the next input code point is U+002B PLUS SIGN (+) or U+002D HYPHEN-MINUS (-),
	  // consume it and append it to repr.
	  if (code === 0x002B || code === 0x002D) {
	      code = source.charCodeAt(offset += 1);
	  }

	  // 3. While the next input code point is a digit, consume it and append it to repr.
	  if (isDigit$1(code)) {
	      offset = findDecimalNumberEnd(source, offset + 1);
	      code = source.charCodeAt(offset);
	  }

	  // 4. If the next 2 input code points are U+002E FULL STOP (.) followed by a digit, then:
	  if (code === 0x002E && isDigit$1(source.charCodeAt(offset + 1))) {
	      // 4.1 Consume them.
	      // 4.2 Append them to repr.
	      code = source.charCodeAt(offset += 2);

	      // 4.3 Set type to "number".
	      // TODO

	      // 4.4 While the next input code point is a digit, consume it and append it to repr.

	      offset = findDecimalNumberEnd(source, offset);
	  }

	  // 5. If the next 2 or 3 input code points are U+0045 LATIN CAPITAL LETTER E (E)
	  // or U+0065 LATIN SMALL LETTER E (e), ... , followed by a digit, then:
	  if (cmpChar(source, offset, 101 /* e */)) {
	      var sign = 0;
	      code = source.charCodeAt(offset + 1);

	      // ... optionally followed by U+002D HYPHEN-MINUS (-) or U+002B PLUS SIGN (+) ...
	      if (code === 0x002D || code === 0x002B) {
	          sign = 1;
	          code = source.charCodeAt(offset + 2);
	      }

	      // ... followed by a digit
	      if (isDigit$1(code)) {
	          // 5.1 Consume them.
	          // 5.2 Append them to repr.

	          // 5.3 Set type to "number".
	          // TODO

	          // 5.4 While the next input code point is a digit, consume it and append it to repr.
	          offset = findDecimalNumberEnd(source, offset + 1 + sign + 1);
	      }
	  }

	  return offset;
	}

	// § 4.3.14. Consume the remnants of a bad url
	// ... its sole use is to consume enough of the input stream to reach a recovery point
	// where normal tokenizing can resume.
	function consumeBadUrlRemnants(source, offset) {
	  // Repeatedly consume the next input code point from the stream:
	  for (; offset < source.length; offset++) {
	      var code = source.charCodeAt(offset);

	      // U+0029 RIGHT PARENTHESIS ())
	      // EOF
	      if (code === 0x0029) {
	          // Return.
	          offset++;
	          break;
	      }

	      if (isValidEscape$1(code, getCharCode(source, offset + 1))) {
	          // Consume an escaped code point.
	          // Note: This allows an escaped right parenthesis ("\)") to be encountered
	          // without ending the <bad-url-token>. This is otherwise identical to
	          // the "anything else" clause.
	          offset = consumeEscaped(source, offset);
	      }
	  }

	  return offset;
	}

	var utils$1 = {
	  consumeEscaped: consumeEscaped,
	  consumeName: consumeName,
	  consumeNumber: consumeNumber,
	  consumeBadUrlRemnants: consumeBadUrlRemnants,

	  cmpChar: cmpChar,
	  cmpStr: cmpStr,

	  getNewlineLength: getNewlineLength,
	  findWhiteSpaceStart: findWhiteSpaceStart,
	  findWhiteSpaceEnd: findWhiteSpaceEnd
	};

	var TYPE$1 = _const.TYPE;
	var NAME$1 = _const.NAME;


	var cmpStr$1 = utils$1.cmpStr;

	var EOF$1 = TYPE$1.EOF;
	var WHITESPACE = TYPE$1.WhiteSpace;
	var COMMENT = TYPE$1.Comment;

	var OFFSET_MASK = 0x00FFFFFF;
	var TYPE_SHIFT = 24;

	var TokenStream = function() {
	  this.offsetAndType = null;
	  this.balance = null;

	  this.reset();
	};

	TokenStream.prototype = {
	  reset: function() {
	      this.eof = false;
	      this.tokenIndex = -1;
	      this.tokenType = 0;
	      this.tokenStart = this.firstCharOffset;
	      this.tokenEnd = this.firstCharOffset;
	  },

	  lookupType: function(offset) {
	      offset += this.tokenIndex;

	      if (offset < this.tokenCount) {
	          return this.offsetAndType[offset] >> TYPE_SHIFT;
	      }

	      return EOF$1;
	  },
	  lookupOffset: function(offset) {
	      offset += this.tokenIndex;

	      if (offset < this.tokenCount) {
	          return this.offsetAndType[offset - 1] & OFFSET_MASK;
	      }

	      return this.source.length;
	  },
	  lookupValue: function(offset, referenceStr) {
	      offset += this.tokenIndex;

	      if (offset < this.tokenCount) {
	          return cmpStr$1(
	              this.source,
	              this.offsetAndType[offset - 1] & OFFSET_MASK,
	              this.offsetAndType[offset] & OFFSET_MASK,
	              referenceStr
	          );
	      }

	      return false;
	  },
	  getTokenStart: function(tokenIndex) {
	      if (tokenIndex === this.tokenIndex) {
	          return this.tokenStart;
	      }

	      if (tokenIndex > 0) {
	          return tokenIndex < this.tokenCount
	              ? this.offsetAndType[tokenIndex - 1] & OFFSET_MASK
	              : this.offsetAndType[this.tokenCount] & OFFSET_MASK;
	      }

	      return this.firstCharOffset;
	  },

	  // TODO: -> skipUntilBalanced
	  getRawLength: function(startToken, mode) {
	      var cursor = startToken;
	      var balanceEnd;
	      var offset = this.offsetAndType[Math.max(cursor - 1, 0)] & OFFSET_MASK;
	      var type;

	      loop:
	      for (; cursor < this.tokenCount; cursor++) {
	          balanceEnd = this.balance[cursor];

	          // stop scanning on balance edge that points to offset before start token
	          if (balanceEnd < startToken) {
	              break loop;
	          }

	          type = this.offsetAndType[cursor] >> TYPE_SHIFT;

	          // check token is stop type
	          switch (mode(type, this.source, offset)) {
	              case 1:
	                  break loop;

	              case 2:
	                  cursor++;
	                  break loop;

	              default:
	                  // fast forward to the end of balanced block
	                  if (this.balance[balanceEnd] === cursor) {
	                      cursor = balanceEnd;
	                  }

	                  offset = this.offsetAndType[cursor] & OFFSET_MASK;
	          }
	      }

	      return cursor - this.tokenIndex;
	  },
	  isBalanceEdge: function(pos) {
	      return this.balance[this.tokenIndex] < pos;
	  },
	  isDelim: function(code, offset) {
	      if (offset) {
	          return (
	              this.lookupType(offset) === TYPE$1.Delim &&
	              this.source.charCodeAt(this.lookupOffset(offset)) === code
	          );
	      }

	      return (
	          this.tokenType === TYPE$1.Delim &&
	          this.source.charCodeAt(this.tokenStart) === code
	      );
	  },

	  getTokenValue: function() {
	      return this.source.substring(this.tokenStart, this.tokenEnd);
	  },
	  getTokenLength: function() {
	      return this.tokenEnd - this.tokenStart;
	  },
	  substrToCursor: function(start) {
	      return this.source.substring(start, this.tokenStart);
	  },

	  skipWS: function() {
	      for (var i = this.tokenIndex, skipTokenCount = 0; i < this.tokenCount; i++, skipTokenCount++) {
	          if ((this.offsetAndType[i] >> TYPE_SHIFT) !== WHITESPACE) {
	              break;
	          }
	      }

	      if (skipTokenCount > 0) {
	          this.skip(skipTokenCount);
	      }
	  },
	  skipSC: function() {
	      while (this.tokenType === WHITESPACE || this.tokenType === COMMENT) {
	          this.next();
	      }
	  },
	  skip: function(tokenCount) {
	      var next = this.tokenIndex + tokenCount;

	      if (next < this.tokenCount) {
	          this.tokenIndex = next;
	          this.tokenStart = this.offsetAndType[next - 1] & OFFSET_MASK;
	          next = this.offsetAndType[next];
	          this.tokenType = next >> TYPE_SHIFT;
	          this.tokenEnd = next & OFFSET_MASK;
	      } else {
	          this.tokenIndex = this.tokenCount;
	          this.next();
	      }
	  },
	  next: function() {
	      var next = this.tokenIndex + 1;

	      if (next < this.tokenCount) {
	          this.tokenIndex = next;
	          this.tokenStart = this.tokenEnd;
	          next = this.offsetAndType[next];
	          this.tokenType = next >> TYPE_SHIFT;
	          this.tokenEnd = next & OFFSET_MASK;
	      } else {
	          this.tokenIndex = this.tokenCount;
	          this.eof = true;
	          this.tokenType = EOF$1;
	          this.tokenStart = this.tokenEnd = this.source.length;
	      }
	  },

	  forEachToken(fn) {
	      for (var i = 0, offset = this.firstCharOffset; i < this.tokenCount; i++) {
	          var start = offset;
	          var item = this.offsetAndType[i];
	          var end = item & OFFSET_MASK;
	          var type = item >> TYPE_SHIFT;

	          offset = end;

	          fn(type, start, end, i);
	      }
	  },

	  dump() {
	      var tokens = new Array(this.tokenCount);

	      this.forEachToken((type, start, end, index) => {
	          tokens[index] = {
	              idx: index,
	              type: NAME$1[type],
	              chunk: this.source.substring(start, end),
	              balance: this.balance[index]
	          };
	      });

	      return tokens;
	  }
	};

	var TokenStream_1 = TokenStream;

	function noop(value) {
	  return value;
	}

	function generateMultiplier(multiplier) {
	  if (multiplier.min === 0 && multiplier.max === 0) {
	      return '*';
	  }

	  if (multiplier.min === 0 && multiplier.max === 1) {
	      return '?';
	  }

	  if (multiplier.min === 1 && multiplier.max === 0) {
	      return multiplier.comma ? '#' : '+';
	  }

	  if (multiplier.min === 1 && multiplier.max === 1) {
	      return '';
	  }

	  return (
	      (multiplier.comma ? '#' : '') +
	      (multiplier.min === multiplier.max
	          ? '{' + multiplier.min + '}'
	          : '{' + multiplier.min + ',' + (multiplier.max !== 0 ? multiplier.max : '') + '}'
	      )
	  );
	}

	function generateTypeOpts(node) {
	  switch (node.type) {
	      case 'Range':
	          return (
	              ' [' +
	              (node.min === null ? '-∞' : node.min) +
	              ',' +
	              (node.max === null ? '∞' : node.max) +
	              ']'
	          );

	      default:
	          throw new Error('Unknown node type `' + node.type + '`');
	  }
	}

	function generateSequence(node, decorate, forceBraces, compact) {
	  var combinator = node.combinator === ' ' || compact ? node.combinator : ' ' + node.combinator + ' ';
	  var result = node.terms.map(function(term) {
	      return generate(term, decorate, forceBraces, compact);
	  }).join(combinator);

	  if (node.explicit || forceBraces) {
	      result = (compact || result[0] === ',' ? '[' : '[ ') + result + (compact ? ']' : ' ]');
	  }

	  return result;
	}

	function generate(node, decorate, forceBraces, compact) {
	  var result;

	  switch (node.type) {
	      case 'Group':
	          result =
	              generateSequence(node, decorate, forceBraces, compact) +
	              (node.disallowEmpty ? '!' : '');
	          break;

	      case 'Multiplier':
	          // return since node is a composition
	          return (
	              generate(node.term, decorate, forceBraces, compact) +
	              decorate(generateMultiplier(node), node)
	          );

	      case 'Type':
	          result = '<' + node.name + (node.opts ? decorate(generateTypeOpts(node.opts), node.opts) : '') + '>';
	          break;

	      case 'Property':
	          result = '<\'' + node.name + '\'>';
	          break;

	      case 'Keyword':
	          result = node.name;
	          break;

	      case 'AtKeyword':
	          result = '@' + node.name;
	          break;

	      case 'Function':
	          result = node.name + '(';
	          break;

	      case 'String':
	      case 'Token':
	          result = node.value;
	          break;

	      case 'Comma':
	          result = ',';
	          break;

	      default:
	          throw new Error('Unknown node type `' + node.type + '`');
	  }

	  return decorate(result, node);
	}

	var generate_1 = function(node, options) {
	  var decorate = noop;
	  var forceBraces = false;
	  var compact = false;

	  if (typeof options === 'function') {
	      decorate = options;
	  } else if (options) {
	      forceBraces = Boolean(options.forceBraces);
	      compact = Boolean(options.compact);
	      if (typeof options.decorate === 'function') {
	          decorate = options.decorate;
	      }
	  }

	  return generate(node, decorate, forceBraces, compact);
	};

	const defaultLoc = { offset: 0, line: 1, column: 1 };

	function locateMismatch(matchResult, node) {
	  const tokens = matchResult.tokens;
	  const longestMatch = matchResult.longestMatch;
	  const mismatchNode = longestMatch < tokens.length ? tokens[longestMatch].node || null : null;
	  const badNode = mismatchNode !== node ? mismatchNode : null;
	  let mismatchOffset = 0;
	  let mismatchLength = 0;
	  let entries = 0;
	  let css = '';
	  let start;
	  let end;

	  for (let i = 0; i < tokens.length; i++) {
	      const token = tokens[i].value;

	      if (i === longestMatch) {
	          mismatchLength = token.length;
	          mismatchOffset = css.length;
	      }

	      if (badNode !== null && tokens[i].node === badNode) {
	          if (i <= longestMatch) {
	              entries++;
	          } else {
	              entries = 0;
	          }
	      }

	      css += token;
	  }

	  if (longestMatch === tokens.length || entries > 1) { // last
	      start = fromLoc(badNode || node, 'end') || buildLoc(defaultLoc, css);
	      end = buildLoc(start);
	  } else {
	      start = fromLoc(badNode, 'start') ||
	          buildLoc(fromLoc(node, 'start') || defaultLoc, css.slice(0, mismatchOffset));
	      end = fromLoc(badNode, 'end') ||
	          buildLoc(start, css.substr(mismatchOffset, mismatchLength));
	  }

	  return {
	      css,
	      mismatchOffset,
	      mismatchLength,
	      start,
	      end
	  };
	}

	function fromLoc(node, point) {
	  const value = node && node.loc && node.loc[point];

	  if (value) {
	      return 'line' in value ? buildLoc(value) : value;
	  }

	  return null;
	}

	function buildLoc({ offset, line, column }, extra) {
	  const loc = {
	      offset,
	      line,
	      column
	  };

	  if (extra) {
	      const lines = extra.split(/\n|\r\n?|\f/);

	      loc.offset += extra.length;
	      loc.line += lines.length - 1;
	      loc.column = lines.length === 1 ? loc.column + extra.length : lines.pop().length + 1;
	  }

	  return loc;
	}

	const SyntaxReferenceError = function(type, referenceName) {
	  const error = createCustomError(
	      'SyntaxReferenceError',
	      type + (referenceName ? ' `' + referenceName + '`' : '')
	  );

	  error.reference = referenceName;

	  return error;
	};

	const SyntaxMatchError = function(message, syntax, node, matchResult) {
	  const error = createCustomError('SyntaxMatchError', message);
	  const {
	      css,
	      mismatchOffset,
	      mismatchLength,
	      start,
	      end
	  } = locateMismatch(matchResult, node);

	  error.rawMessage = message;
	  error.syntax = syntax ? generate_1(syntax) : '<generic>';
	  error.css = css;
	  error.mismatchOffset = mismatchOffset;
	  error.mismatchLength = mismatchLength;
	  error.message = message + '\n' +
	      '  syntax: ' + error.syntax + '\n' +
	      '   value: ' + (css || '<empty string>') + '\n' +
	      '  --------' + new Array(error.mismatchOffset + 1).join('-') + '^';

	  Object.assign(error, start);
	  error.loc = {
	      source: (node && node.loc && node.loc.source) || '<unknown>',
	      start,
	      end
	  };

	  return error;
	};

	var error = {
	  SyntaxReferenceError,
	  SyntaxMatchError
	};

	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var keywords = Object.create(null);
	var properties = Object.create(null);
	var HYPHENMINUS = 45; // '-'.charCodeAt()

	function isCustomProperty(str, offset) {
	  offset = offset || 0;

	  return str.length - offset >= 2 &&
	         str.charCodeAt(offset) === HYPHENMINUS &&
	         str.charCodeAt(offset + 1) === HYPHENMINUS;
	}

	function getVendorPrefix(str, offset) {
	  offset = offset || 0;

	  // verdor prefix should be at least 3 chars length
	  if (str.length - offset >= 3) {
	      // vendor prefix starts with hyper minus following non-hyper minus
	      if (str.charCodeAt(offset) === HYPHENMINUS &&
	          str.charCodeAt(offset + 1) !== HYPHENMINUS) {
	          // vendor prefix should contain a hyper minus at the ending
	          var secondDashIndex = str.indexOf('-', offset + 2);

	          if (secondDashIndex !== -1) {
	              return str.substring(offset, secondDashIndex + 1);
	          }
	      }
	  }

	  return '';
	}

	function getKeywordDescriptor(keyword) {
	  if (hasOwnProperty.call(keywords, keyword)) {
	      return keywords[keyword];
	  }

	  var name = keyword.toLowerCase();

	  if (hasOwnProperty.call(keywords, name)) {
	      return keywords[keyword] = keywords[name];
	  }

	  var custom = isCustomProperty(name, 0);
	  var vendor = !custom ? getVendorPrefix(name, 0) : '';

	  return keywords[keyword] = Object.freeze({
	      basename: name.substr(vendor.length),
	      name: name,
	      vendor: vendor,
	      prefix: vendor,
	      custom: custom
	  });
	}

	function getPropertyDescriptor(property) {
	  if (hasOwnProperty.call(properties, property)) {
	      return properties[property];
	  }

	  var name = property;
	  var hack = property[0];

	  if (hack === '/') {
	      hack = property[1] === '/' ? '//' : '/';
	  } else if (hack !== '_' &&
	             hack !== '*' &&
	             hack !== '$' &&
	             hack !== '#' &&
	             hack !== '+' &&
	             hack !== '&') {
	      hack = '';
	  }

	  var custom = isCustomProperty(name, hack.length);

	  // re-use result when possible (the same as for lower case)
	  if (!custom) {
	      name = name.toLowerCase();
	      if (hasOwnProperty.call(properties, name)) {
	          return properties[property] = properties[name];
	      }
	  }

	  var vendor = !custom ? getVendorPrefix(name, hack.length) : '';
	  var prefix = name.substr(0, hack.length + vendor.length);

	  return properties[property] = Object.freeze({
	      basename: name.substr(prefix.length),
	      name: name.substr(hack.length),
	      hack: hack,
	      vendor: vendor,
	      prefix: prefix,
	      custom: custom
	  });
	}

	var names = {
	  keyword: getKeywordDescriptor,
	  property: getPropertyDescriptor,
	  isCustomProperty: isCustomProperty,
	  vendorPrefix: getVendorPrefix
	};

	var MIN_SIZE = 16 * 1024;
	var SafeUint32Array = typeof Uint32Array !== 'undefined' ? Uint32Array : Array; // fallback on Array when TypedArray is not supported

	var adoptBuffer = function adoptBuffer(buffer, size) {
	  if (buffer === null || buffer.length < size) {
	      return new SafeUint32Array(Math.max(size + 1024, MIN_SIZE));
	  }

	  return buffer;
	};

	var TYPE$2 = _const.TYPE;


	var isNewline$1 = charCodeDefinitions.isNewline;
	var isName$2 = charCodeDefinitions.isName;
	var isValidEscape$2 = charCodeDefinitions.isValidEscape;
	var isNumberStart$1 = charCodeDefinitions.isNumberStart;
	var isIdentifierStart$1 = charCodeDefinitions.isIdentifierStart;
	var charCodeCategory$1 = charCodeDefinitions.charCodeCategory;
	var isBOM$1 = charCodeDefinitions.isBOM;


	var cmpStr$2 = utils$1.cmpStr;
	var getNewlineLength$1 = utils$1.getNewlineLength;
	var findWhiteSpaceEnd$1 = utils$1.findWhiteSpaceEnd;
	var consumeEscaped$1 = utils$1.consumeEscaped;
	var consumeName$1 = utils$1.consumeName;
	var consumeNumber$1 = utils$1.consumeNumber;
	var consumeBadUrlRemnants$1 = utils$1.consumeBadUrlRemnants;

	var OFFSET_MASK$1 = 0x00FFFFFF;
	var TYPE_SHIFT$1 = 24;

	function tokenize(source, stream) {
	  function getCharCode(offset) {
	      return offset < sourceLength ? source.charCodeAt(offset) : 0;
	  }

	  // § 4.3.3. Consume a numeric token
	  function consumeNumericToken() {
	      // Consume a number and let number be the result.
	      offset = consumeNumber$1(source, offset);

	      // If the next 3 input code points would start an identifier, then:
	      if (isIdentifierStart$1(getCharCode(offset), getCharCode(offset + 1), getCharCode(offset + 2))) {
	          // Create a <dimension-token> with the same value and type flag as number, and a unit set initially to the empty string.
	          // Consume a name. Set the <dimension-token>’s unit to the returned value.
	          // Return the <dimension-token>.
	          type = TYPE$2.Dimension;
	          offset = consumeName$1(source, offset);
	          return;
	      }

	      // Otherwise, if the next input code point is U+0025 PERCENTAGE SIGN (%), consume it.
	      if (getCharCode(offset) === 0x0025) {
	          // Create a <percentage-token> with the same value as number, and return it.
	          type = TYPE$2.Percentage;
	          offset++;
	          return;
	      }

	      // Otherwise, create a <number-token> with the same value and type flag as number, and return it.
	      type = TYPE$2.Number;
	  }

	  // § 4.3.4. Consume an ident-like token
	  function consumeIdentLikeToken() {
	      const nameStartOffset = offset;

	      // Consume a name, and let string be the result.
	      offset = consumeName$1(source, offset);

	      // If string’s value is an ASCII case-insensitive match for "url",
	      // and the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
	      if (cmpStr$2(source, nameStartOffset, offset, 'url') && getCharCode(offset) === 0x0028) {
	          // While the next two input code points are whitespace, consume the next input code point.
	          offset = findWhiteSpaceEnd$1(source, offset + 1);

	          // If the next one or two input code points are U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE ('),
	          // or whitespace followed by U+0022 QUOTATION MARK (") or U+0027 APOSTROPHE ('),
	          // then create a <function-token> with its value set to string and return it.
	          if (getCharCode(offset) === 0x0022 ||
	              getCharCode(offset) === 0x0027) {
	              type = TYPE$2.Function;
	              offset = nameStartOffset + 4;
	              return;
	          }

	          // Otherwise, consume a url token, and return it.
	          consumeUrlToken();
	          return;
	      }

	      // Otherwise, if the next input code point is U+0028 LEFT PARENTHESIS ((), consume it.
	      // Create a <function-token> with its value set to string and return it.
	      if (getCharCode(offset) === 0x0028) {
	          type = TYPE$2.Function;
	          offset++;
	          return;
	      }

	      // Otherwise, create an <ident-token> with its value set to string and return it.
	      type = TYPE$2.Ident;
	  }

	  // § 4.3.5. Consume a string token
	  function consumeStringToken(endingCodePoint) {
	      // This algorithm may be called with an ending code point, which denotes the code point
	      // that ends the string. If an ending code point is not specified,
	      // the current input code point is used.
	      if (!endingCodePoint) {
	          endingCodePoint = getCharCode(offset++);
	      }

	      // Initially create a <string-token> with its value set to the empty string.
	      type = TYPE$2.String;

	      // Repeatedly consume the next input code point from the stream:
	      for (; offset < source.length; offset++) {
	          var code = source.charCodeAt(offset);

	          switch (charCodeCategory$1(code)) {
	              // ending code point
	              case endingCodePoint:
	                  // Return the <string-token>.
	                  offset++;
	                  return;

	              // EOF
	              case charCodeCategory$1.Eof:
	                  // This is a parse error. Return the <string-token>.
	                  return;

	              // newline
	              case charCodeCategory$1.WhiteSpace:
	                  if (isNewline$1(code)) {
	                      // This is a parse error. Reconsume the current input code point,
	                      // create a <bad-string-token>, and return it.
	                      offset += getNewlineLength$1(source, offset, code);
	                      type = TYPE$2.BadString;
	                      return;
	                  }
	                  break;

	              // U+005C REVERSE SOLIDUS (\)
	              case 0x005C:
	                  // If the next input code point is EOF, do nothing.
	                  if (offset === source.length - 1) {
	                      break;
	                  }

	                  var nextCode = getCharCode(offset + 1);

	                  // Otherwise, if the next input code point is a newline, consume it.
	                  if (isNewline$1(nextCode)) {
	                      offset += getNewlineLength$1(source, offset + 1, nextCode);
	                  } else if (isValidEscape$2(code, nextCode)) {
	                      // Otherwise, (the stream starts with a valid escape) consume
	                      // an escaped code point and append the returned code point to
	                      // the <string-token>’s value.
	                      offset = consumeEscaped$1(source, offset) - 1;
	                  }
	                  break;

	              // anything else
	              // Append the current input code point to the <string-token>’s value.
	          }
	      }
	  }

	  // § 4.3.6. Consume a url token
	  // Note: This algorithm assumes that the initial "url(" has already been consumed.
	  // This algorithm also assumes that it’s being called to consume an "unquoted" value, like url(foo).
	  // A quoted value, like url("foo"), is parsed as a <function-token>. Consume an ident-like token
	  // automatically handles this distinction; this algorithm shouldn’t be called directly otherwise.
	  function consumeUrlToken() {
	      // Initially create a <url-token> with its value set to the empty string.
	      type = TYPE$2.Url;

	      // Consume as much whitespace as possible.
	      offset = findWhiteSpaceEnd$1(source, offset);

	      // Repeatedly consume the next input code point from the stream:
	      for (; offset < source.length; offset++) {
	          var code = source.charCodeAt(offset);

	          switch (charCodeCategory$1(code)) {
	              // U+0029 RIGHT PARENTHESIS ())
	              case 0x0029:
	                  // Return the <url-token>.
	                  offset++;
	                  return;

	              // EOF
	              case charCodeCategory$1.Eof:
	                  // This is a parse error. Return the <url-token>.
	                  return;

	              // whitespace
	              case charCodeCategory$1.WhiteSpace:
	                  // Consume as much whitespace as possible.
	                  offset = findWhiteSpaceEnd$1(source, offset);

	                  // If the next input code point is U+0029 RIGHT PARENTHESIS ()) or EOF,
	                  // consume it and return the <url-token>
	                  // (if EOF was encountered, this is a parse error);
	                  if (getCharCode(offset) === 0x0029 || offset >= source.length) {
	                      if (offset < source.length) {
	                          offset++;
	                      }
	                      return;
	                  }

	                  // otherwise, consume the remnants of a bad url, create a <bad-url-token>,
	                  // and return it.
	                  offset = consumeBadUrlRemnants$1(source, offset);
	                  type = TYPE$2.BadUrl;
	                  return;

	              // U+0022 QUOTATION MARK (")
	              // U+0027 APOSTROPHE (')
	              // U+0028 LEFT PARENTHESIS (()
	              // non-printable code point
	              case 0x0022:
	              case 0x0027:
	              case 0x0028:
	              case charCodeCategory$1.NonPrintable:
	                  // This is a parse error. Consume the remnants of a bad url,
	                  // create a <bad-url-token>, and return it.
	                  offset = consumeBadUrlRemnants$1(source, offset);
	                  type = TYPE$2.BadUrl;
	                  return;

	              // U+005C REVERSE SOLIDUS (\)
	              case 0x005C:
	                  // If the stream starts with a valid escape, consume an escaped code point and
	                  // append the returned code point to the <url-token>’s value.
	                  if (isValidEscape$2(code, getCharCode(offset + 1))) {
	                      offset = consumeEscaped$1(source, offset) - 1;
	                      break;
	                  }

	                  // Otherwise, this is a parse error. Consume the remnants of a bad url,
	                  // create a <bad-url-token>, and return it.
	                  offset = consumeBadUrlRemnants$1(source, offset);
	                  type = TYPE$2.BadUrl;
	                  return;

	              // anything else
	              // Append the current input code point to the <url-token>’s value.
	          }
	      }
	  }

	  if (!stream) {
	      stream = new TokenStream_1();
	  }

	  // ensure source is a string
	  source = String(source || '');

	  var sourceLength = source.length;
	  var offsetAndType = adoptBuffer(stream.offsetAndType, sourceLength + 1); // +1 because of eof-token
	  var balance = adoptBuffer(stream.balance, sourceLength + 1);
	  var tokenCount = 0;
	  var start = isBOM$1(getCharCode(0));
	  var offset = start;
	  var balanceCloseType = 0;
	  var balanceStart = 0;
	  var balancePrev = 0;

	  // https://drafts.csswg.org/css-syntax-3/#consume-token
	  // § 4.3.1. Consume a token
	  while (offset < sourceLength) {
	      var code = source.charCodeAt(offset);
	      var type = 0;

	      balance[tokenCount] = sourceLength;

	      switch (charCodeCategory$1(code)) {
	          // whitespace
	          case charCodeCategory$1.WhiteSpace:
	              // Consume as much whitespace as possible. Return a <whitespace-token>.
	              type = TYPE$2.WhiteSpace;
	              offset = findWhiteSpaceEnd$1(source, offset + 1);
	              break;

	          // U+0022 QUOTATION MARK (")
	          case 0x0022:
	              // Consume a string token and return it.
	              consumeStringToken();
	              break;

	          // U+0023 NUMBER SIGN (#)
	          case 0x0023:
	              // If the next input code point is a name code point or the next two input code points are a valid escape, then:
	              if (isName$2(getCharCode(offset + 1)) || isValidEscape$2(getCharCode(offset + 1), getCharCode(offset + 2))) {
	                  // Create a <hash-token>.
	                  type = TYPE$2.Hash;

	                  // If the next 3 input code points would start an identifier, set the <hash-token>’s type flag to "id".
	                  // if (isIdentifierStart(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
	                  //     // TODO: set id flag
	                  // }

	                  // Consume a name, and set the <hash-token>’s value to the returned string.
	                  offset = consumeName$1(source, offset + 1);

	                  // Return the <hash-token>.
	              } else {
	                  // Otherwise, return a <delim-token> with its value set to the current input code point.
	                  type = TYPE$2.Delim;
	                  offset++;
	              }

	              break;

	          // U+0027 APOSTROPHE (')
	          case 0x0027:
	              // Consume a string token and return it.
	              consumeStringToken();
	              break;

	          // U+0028 LEFT PARENTHESIS (()
	          case 0x0028:
	              // Return a <(-token>.
	              type = TYPE$2.LeftParenthesis;
	              offset++;
	              break;

	          // U+0029 RIGHT PARENTHESIS ())
	          case 0x0029:
	              // Return a <)-token>.
	              type = TYPE$2.RightParenthesis;
	              offset++;
	              break;

	          // U+002B PLUS SIGN (+)
	          case 0x002B:
	              // If the input stream starts with a number, ...
	              if (isNumberStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
	                  // ... reconsume the current input code point, consume a numeric token, and return it.
	                  consumeNumericToken();
	              } else {
	                  // Otherwise, return a <delim-token> with its value set to the current input code point.
	                  type = TYPE$2.Delim;
	                  offset++;
	              }
	              break;

	          // U+002C COMMA (,)
	          case 0x002C:
	              // Return a <comma-token>.
	              type = TYPE$2.Comma;
	              offset++;
	              break;

	          // U+002D HYPHEN-MINUS (-)
	          case 0x002D:
	              // If the input stream starts with a number, reconsume the current input code point, consume a numeric token, and return it.
	              if (isNumberStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
	                  consumeNumericToken();
	              } else {
	                  // Otherwise, if the next 2 input code points are U+002D HYPHEN-MINUS U+003E GREATER-THAN SIGN (->), consume them and return a <CDC-token>.
	                  if (getCharCode(offset + 1) === 0x002D &&
	                      getCharCode(offset + 2) === 0x003E) {
	                      type = TYPE$2.CDC;
	                      offset = offset + 3;
	                  } else {
	                      // Otherwise, if the input stream starts with an identifier, ...
	                      if (isIdentifierStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
	                          // ... reconsume the current input code point, consume an ident-like token, and return it.
	                          consumeIdentLikeToken();
	                      } else {
	                          // Otherwise, return a <delim-token> with its value set to the current input code point.
	                          type = TYPE$2.Delim;
	                          offset++;
	                      }
	                  }
	              }
	              break;

	          // U+002E FULL STOP (.)
	          case 0x002E:
	              // If the input stream starts with a number, ...
	              if (isNumberStart$1(code, getCharCode(offset + 1), getCharCode(offset + 2))) {
	                  // ... reconsume the current input code point, consume a numeric token, and return it.
	                  consumeNumericToken();
	              } else {
	                  // Otherwise, return a <delim-token> with its value set to the current input code point.
	                  type = TYPE$2.Delim;
	                  offset++;
	              }

	              break;

	          // U+002F SOLIDUS (/)
	          case 0x002F:
	              // If the next two input code point are U+002F SOLIDUS (/) followed by a U+002A ASTERISK (*),
	              if (getCharCode(offset + 1) === 0x002A) {
	                  // ... consume them and all following code points up to and including the first U+002A ASTERISK (*)
	                  // followed by a U+002F SOLIDUS (/), or up to an EOF code point.
	                  type = TYPE$2.Comment;
	                  offset = source.indexOf('*/', offset + 2) + 2;
	                  if (offset === 1) {
	                      offset = source.length;
	                  }
	              } else {
	                  type = TYPE$2.Delim;
	                  offset++;
	              }
	              break;

	          // U+003A COLON (:)
	          case 0x003A:
	              // Return a <colon-token>.
	              type = TYPE$2.Colon;
	              offset++;
	              break;

	          // U+003B SEMICOLON (;)
	          case 0x003B:
	              // Return a <semicolon-token>.
	              type = TYPE$2.Semicolon;
	              offset++;
	              break;

	          // U+003C LESS-THAN SIGN (<)
	          case 0x003C:
	              // If the next 3 input code points are U+0021 EXCLAMATION MARK U+002D HYPHEN-MINUS U+002D HYPHEN-MINUS (!--), ...
	              if (getCharCode(offset + 1) === 0x0021 &&
	                  getCharCode(offset + 2) === 0x002D &&
	                  getCharCode(offset + 3) === 0x002D) {
	                  // ... consume them and return a <CDO-token>.
	                  type = TYPE$2.CDO;
	                  offset = offset + 4;
	              } else {
	                  // Otherwise, return a <delim-token> with its value set to the current input code point.
	                  type = TYPE$2.Delim;
	                  offset++;
	              }

	              break;

	          // U+0040 COMMERCIAL AT (@)
	          case 0x0040:
	              // If the next 3 input code points would start an identifier, ...
	              if (isIdentifierStart$1(getCharCode(offset + 1), getCharCode(offset + 2), getCharCode(offset + 3))) {
	                  // ... consume a name, create an <at-keyword-token> with its value set to the returned value, and return it.
	                  type = TYPE$2.AtKeyword;
	                  offset = consumeName$1(source, offset + 1);
	              } else {
	                  // Otherwise, return a <delim-token> with its value set to the current input code point.
	                  type = TYPE$2.Delim;
	                  offset++;
	              }

	              break;

	          // U+005B LEFT SQUARE BRACKET ([)
	          case 0x005B:
	              // Return a <[-token>.
	              type = TYPE$2.LeftSquareBracket;
	              offset++;
	              break;

	          // U+005C REVERSE SOLIDUS (\)
	          case 0x005C:
	              // If the input stream starts with a valid escape, ...
	              if (isValidEscape$2(code, getCharCode(offset + 1))) {
	                  // ... reconsume the current input code point, consume an ident-like token, and return it.
	                  consumeIdentLikeToken();
	              } else {
	                  // Otherwise, this is a parse error. Return a <delim-token> with its value set to the current input code point.
	                  type = TYPE$2.Delim;
	                  offset++;
	              }
	              break;

	          // U+005D RIGHT SQUARE BRACKET (])
	          case 0x005D:
	              // Return a <]-token>.
	              type = TYPE$2.RightSquareBracket;
	              offset++;
	              break;

	          // U+007B LEFT CURLY BRACKET ({)
	          case 0x007B:
	              // Return a <{-token>.
	              type = TYPE$2.LeftCurlyBracket;
	              offset++;
	              break;

	          // U+007D RIGHT CURLY BRACKET (})
	          case 0x007D:
	              // Return a <}-token>.
	              type = TYPE$2.RightCurlyBracket;
	              offset++;
	              break;

	          // digit
	          case charCodeCategory$1.Digit:
	              // Reconsume the current input code point, consume a numeric token, and return it.
	              consumeNumericToken();
	              break;

	          // name-start code point
	          case charCodeCategory$1.NameStart:
	              // Reconsume the current input code point, consume an ident-like token, and return it.
	              consumeIdentLikeToken();
	              break;

	          // EOF
	          case charCodeCategory$1.Eof:
	              // Return an <EOF-token>.
	              break;

	          // anything else
	          default:
	              // Return a <delim-token> with its value set to the current input code point.
	              type = TYPE$2.Delim;
	              offset++;
	      }

	      switch (type) {
	          case balanceCloseType:
	              balancePrev = balanceStart & OFFSET_MASK$1;
	              balanceStart = balance[balancePrev];
	              balanceCloseType = balanceStart >> TYPE_SHIFT$1;
	              balance[tokenCount] = balancePrev;
	              balance[balancePrev++] = tokenCount;
	              for (; balancePrev < tokenCount; balancePrev++) {
	                  if (balance[balancePrev] === sourceLength) {
	                      balance[balancePrev] = tokenCount;
	                  }
	              }
	              break;

	          case TYPE$2.LeftParenthesis:
	          case TYPE$2.Function:
	              balance[tokenCount] = balanceStart;
	              balanceCloseType = TYPE$2.RightParenthesis;
	              balanceStart = (balanceCloseType << TYPE_SHIFT$1) | tokenCount;
	              break;

	          case TYPE$2.LeftSquareBracket:
	              balance[tokenCount] = balanceStart;
	              balanceCloseType = TYPE$2.RightSquareBracket;
	              balanceStart = (balanceCloseType << TYPE_SHIFT$1) | tokenCount;
	              break;

	          case TYPE$2.LeftCurlyBracket:
	              balance[tokenCount] = balanceStart;
	              balanceCloseType = TYPE$2.RightCurlyBracket;
	              balanceStart = (balanceCloseType << TYPE_SHIFT$1) | tokenCount;
	              break;
	      }

	      offsetAndType[tokenCount++] = (type << TYPE_SHIFT$1) | offset;
	  }

	  // finalize buffers
	  offsetAndType[tokenCount] = (TYPE$2.EOF << TYPE_SHIFT$1) | offset; // <EOF-token>
	  balance[tokenCount] = sourceLength;
	  balance[sourceLength] = sourceLength; // prevents false positive balance match with any token
	  while (balanceStart !== 0) {
	      balancePrev = balanceStart & OFFSET_MASK$1;
	      balanceStart = balance[balancePrev];
	      balance[balancePrev] = sourceLength;
	  }

	  // update stream
	  stream.source = source;
	  stream.firstCharOffset = start;
	  stream.offsetAndType = offsetAndType;
	  stream.tokenCount = tokenCount;
	  stream.balance = balance;
	  stream.reset();
	  stream.next();

	  return stream;
	}

	// extend tokenizer with constants
	Object.keys(_const).forEach(function(key) {
	  tokenize[key] = _const[key];
	});

	// extend tokenizer with static methods from utils
	Object.keys(charCodeDefinitions).forEach(function(key) {
	  tokenize[key] = charCodeDefinitions[key];
	});
	Object.keys(utils$1).forEach(function(key) {
	  tokenize[key] = utils$1[key];
	});

	var tokenizer = tokenize;

	var isDigit$2 = tokenizer.isDigit;
	var cmpChar$1 = tokenizer.cmpChar;
	var TYPE$3 = tokenizer.TYPE;

	var DELIM = TYPE$3.Delim;
	var WHITESPACE$1 = TYPE$3.WhiteSpace;
	var COMMENT$1 = TYPE$3.Comment;
	var IDENT = TYPE$3.Ident;
	var NUMBER = TYPE$3.Number;
	var DIMENSION = TYPE$3.Dimension;
	var PLUSSIGN = 0x002B;    // U+002B PLUS SIGN (+)
	var HYPHENMINUS$1 = 0x002D; // U+002D HYPHEN-MINUS (-)
	var N = 0x006E;           // U+006E LATIN SMALL LETTER N (n)
	var DISALLOW_SIGN = true;
	var ALLOW_SIGN = false;

	function isDelim(token, code) {
	  return token !== null && token.type === DELIM && token.value.charCodeAt(0) === code;
	}

	function skipSC(token, offset, getNextToken) {
	  while (token !== null && (token.type === WHITESPACE$1 || token.type === COMMENT$1)) {
	      token = getNextToken(++offset);
	  }

	  return offset;
	}

	function checkInteger(token, valueOffset, disallowSign, offset) {
	  if (!token) {
	      return 0;
	  }

	  var code = token.value.charCodeAt(valueOffset);

	  if (code === PLUSSIGN || code === HYPHENMINUS$1) {
	      if (disallowSign) {
	          // Number sign is not allowed
	          return 0;
	      }
	      valueOffset++;
	  }

	  for (; valueOffset < token.value.length; valueOffset++) {
	      if (!isDigit$2(token.value.charCodeAt(valueOffset))) {
	          // Integer is expected
	          return 0;
	      }
	  }

	  return offset + 1;
	}

	// ... <signed-integer>
	// ... ['+' | '-'] <signless-integer>
	function consumeB(token, offset_, getNextToken) {
	  var sign = false;
	  var offset = skipSC(token, offset_, getNextToken);

	  token = getNextToken(offset);

	  if (token === null) {
	      return offset_;
	  }

	  if (token.type !== NUMBER) {
	      if (isDelim(token, PLUSSIGN) || isDelim(token, HYPHENMINUS$1)) {
	          sign = true;
	          offset = skipSC(getNextToken(++offset), offset, getNextToken);
	          token = getNextToken(offset);

	          if (token === null && token.type !== NUMBER) {
	              return 0;
	          }
	      } else {
	          return offset_;
	      }
	  }

	  if (!sign) {
	      var code = token.value.charCodeAt(0);
	      if (code !== PLUSSIGN && code !== HYPHENMINUS$1) {
	          // Number sign is expected
	          return 0;
	      }
	  }

	  return checkInteger(token, sign ? 0 : 1, sign, offset);
	}

	// An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb
	var genericAnPlusB = function anPlusB(token, getNextToken) {
	  /* eslint-disable brace-style*/
	  var offset = 0;

	  if (!token) {
	      return 0;
	  }

	  // <integer>
	  if (token.type === NUMBER) {
	      return checkInteger(token, 0, ALLOW_SIGN, offset); // b
	  }

	  // -n
	  // -n <signed-integer>
	  // -n ['+' | '-'] <signless-integer>
	  // -n- <signless-integer>
	  // <dashndashdigit-ident>
	  else if (token.type === IDENT && token.value.charCodeAt(0) === HYPHENMINUS$1) {
	      // expect 1st char is N
	      if (!cmpChar$1(token.value, 1, N)) {
	          return 0;
	      }

	      switch (token.value.length) {
	          // -n
	          // -n <signed-integer>
	          // -n ['+' | '-'] <signless-integer>
	          case 2:
	              return consumeB(getNextToken(++offset), offset, getNextToken);

	          // -n- <signless-integer>
	          case 3:
	              if (token.value.charCodeAt(2) !== HYPHENMINUS$1) {
	                  return 0;
	              }

	              offset = skipSC(getNextToken(++offset), offset, getNextToken);
	              token = getNextToken(offset);

	              return checkInteger(token, 0, DISALLOW_SIGN, offset);

	          // <dashndashdigit-ident>
	          default:
	              if (token.value.charCodeAt(2) !== HYPHENMINUS$1) {
	                  return 0;
	              }

	              return checkInteger(token, 3, DISALLOW_SIGN, offset);
	      }
	  }

	  // '+'? n
	  // '+'? n <signed-integer>
	  // '+'? n ['+' | '-'] <signless-integer>
	  // '+'? n- <signless-integer>
	  // '+'? <ndashdigit-ident>
	  else if (token.type === IDENT || (isDelim(token, PLUSSIGN) && getNextToken(offset + 1).type === IDENT)) {
	      // just ignore a plus
	      if (token.type !== IDENT) {
	          token = getNextToken(++offset);
	      }

	      if (token === null || !cmpChar$1(token.value, 0, N)) {
	          return 0;
	      }

	      switch (token.value.length) {
	          // '+'? n
	          // '+'? n <signed-integer>
	          // '+'? n ['+' | '-'] <signless-integer>
	          case 1:
	              return consumeB(getNextToken(++offset), offset, getNextToken);

	          // '+'? n- <signless-integer>
	          case 2:
	              if (token.value.charCodeAt(1) !== HYPHENMINUS$1) {
	                  return 0;
	              }

	              offset = skipSC(getNextToken(++offset), offset, getNextToken);
	              token = getNextToken(offset);

	              return checkInteger(token, 0, DISALLOW_SIGN, offset);

	          // '+'? <ndashdigit-ident>
	          default:
	              if (token.value.charCodeAt(1) !== HYPHENMINUS$1) {
	                  return 0;
	              }

	              return checkInteger(token, 2, DISALLOW_SIGN, offset);
	      }
	  }

	  // <ndashdigit-dimension>
	  // <ndash-dimension> <signless-integer>
	  // <n-dimension>
	  // <n-dimension> <signed-integer>
	  // <n-dimension> ['+' | '-'] <signless-integer>
	  else if (token.type === DIMENSION) {
	      var code = token.value.charCodeAt(0);
	      var sign = code === PLUSSIGN || code === HYPHENMINUS$1 ? 1 : 0;

	      for (var i = sign; i < token.value.length; i++) {
	          if (!isDigit$2(token.value.charCodeAt(i))) {
	              break;
	          }
	      }

	      if (i === sign) {
	          // Integer is expected
	          return 0;
	      }

	      if (!cmpChar$1(token.value, i, N)) {
	          return 0;
	      }

	      // <n-dimension>
	      // <n-dimension> <signed-integer>
	      // <n-dimension> ['+' | '-'] <signless-integer>
	      if (i + 1 === token.value.length) {
	          return consumeB(getNextToken(++offset), offset, getNextToken);
	      } else {
	          if (token.value.charCodeAt(i + 1) !== HYPHENMINUS$1) {
	              return 0;
	          }

	          // <ndash-dimension> <signless-integer>
	          if (i + 2 === token.value.length) {
	              offset = skipSC(getNextToken(++offset), offset, getNextToken);
	              token = getNextToken(offset);

	              return checkInteger(token, 0, DISALLOW_SIGN, offset);
	          }
	          // <ndashdigit-dimension>
	          else {
	              return checkInteger(token, i + 2, DISALLOW_SIGN, offset);
	          }
	      }
	  }

	  return 0;
	};

	var isHexDigit$2 = tokenizer.isHexDigit;
	var cmpChar$2 = tokenizer.cmpChar;
	var TYPE$4 = tokenizer.TYPE;

	var IDENT$1 = TYPE$4.Ident;
	var DELIM$1 = TYPE$4.Delim;
	var NUMBER$1 = TYPE$4.Number;
	var DIMENSION$1 = TYPE$4.Dimension;
	var PLUSSIGN$1 = 0x002B;     // U+002B PLUS SIGN (+)
	var HYPHENMINUS$2 = 0x002D;  // U+002D HYPHEN-MINUS (-)
	var QUESTIONMARK = 0x003F; // U+003F QUESTION MARK (?)
	var U = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)

	function isDelim$1(token, code) {
	  return token !== null && token.type === DELIM$1 && token.value.charCodeAt(0) === code;
	}

	function startsWith(token, code) {
	  return token.value.charCodeAt(0) === code;
	}

	function hexSequence(token, offset, allowDash) {
	  for (var pos = offset, hexlen = 0; pos < token.value.length; pos++) {
	      var code = token.value.charCodeAt(pos);

	      if (code === HYPHENMINUS$2 && allowDash && hexlen !== 0) {
	          if (hexSequence(token, offset + hexlen + 1, false) > 0) {
	              return 6; // dissallow following question marks
	          }

	          return 0; // dash at the ending of a hex sequence is not allowed
	      }

	      if (!isHexDigit$2(code)) {
	          return 0; // not a hex digit
	      }

	      if (++hexlen > 6) {
	          return 0; // too many hex digits
	      }    }

	  return hexlen;
	}

	function withQuestionMarkSequence(consumed, length, getNextToken) {
	  if (!consumed) {
	      return 0; // nothing consumed
	  }

	  while (isDelim$1(getNextToken(length), QUESTIONMARK)) {
	      if (++consumed > 6) {
	          return 0; // too many question marks
	      }

	      length++;
	  }

	  return length;
	}

	// https://drafts.csswg.org/css-syntax/#urange
	// Informally, the <urange> production has three forms:
	// U+0001
	//      Defines a range consisting of a single code point, in this case the code point "1".
	// U+0001-00ff
	//      Defines a range of codepoints between the first and the second value, in this case
	//      the range between "1" and "ff" (255 in decimal) inclusive.
	// U+00??
	//      Defines a range of codepoints where the "?" characters range over all hex digits,
	//      in this case defining the same as the value U+0000-00ff.
	// In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
	//
	// <urange> =
	//   u '+' <ident-token> '?'* |
	//   u <dimension-token> '?'* |
	//   u <number-token> '?'* |
	//   u <number-token> <dimension-token> |
	//   u <number-token> <number-token> |
	//   u '+' '?'+
	var genericUrange = function urange(token, getNextToken) {
	  var length = 0;

	  // should start with `u` or `U`
	  if (token === null || token.type !== IDENT$1 || !cmpChar$2(token.value, 0, U)) {
	      return 0;
	  }

	  token = getNextToken(++length);
	  if (token === null) {
	      return 0;
	  }

	  // u '+' <ident-token> '?'*
	  // u '+' '?'+
	  if (isDelim$1(token, PLUSSIGN$1)) {
	      token = getNextToken(++length);
	      if (token === null) {
	          return 0;
	      }

	      if (token.type === IDENT$1) {
	          // u '+' <ident-token> '?'*
	          return withQuestionMarkSequence(hexSequence(token, 0, true), ++length, getNextToken);
	      }

	      if (isDelim$1(token, QUESTIONMARK)) {
	          // u '+' '?'+
	          return withQuestionMarkSequence(1, ++length, getNextToken);
	      }

	      // Hex digit or question mark is expected
	      return 0;
	  }

	  // u <number-token> '?'*
	  // u <number-token> <dimension-token>
	  // u <number-token> <number-token>
	  if (token.type === NUMBER$1) {
	      if (!startsWith(token, PLUSSIGN$1)) {
	          return 0;
	      }

	      var consumedHexLength = hexSequence(token, 1, true);
	      if (consumedHexLength === 0) {
	          return 0;
	      }

	      token = getNextToken(++length);
	      if (token === null) {
	          // u <number-token> <eof>
	          return length;
	      }

	      if (token.type === DIMENSION$1 || token.type === NUMBER$1) {
	          // u <number-token> <dimension-token>
	          // u <number-token> <number-token>
	          if (!startsWith(token, HYPHENMINUS$2) || !hexSequence(token, 1, false)) {
	              return 0;
	          }

	          return length + 1;
	      }

	      // u <number-token> '?'*
	      return withQuestionMarkSequence(consumedHexLength, length, getNextToken);
	  }

	  // u <dimension-token> '?'*
	  if (token.type === DIMENSION$1) {
	      if (!startsWith(token, PLUSSIGN$1)) {
	          return 0;
	      }

	      return withQuestionMarkSequence(hexSequence(token, 1, true), ++length, getNextToken);
	  }

	  return 0;
	};

	var isIdentifierStart$2 = tokenizer.isIdentifierStart;
	var isHexDigit$3 = tokenizer.isHexDigit;
	var isDigit$3 = tokenizer.isDigit;
	var cmpStr$3 = tokenizer.cmpStr;
	var consumeNumber$2 = tokenizer.consumeNumber;
	var TYPE$5 = tokenizer.TYPE;



	var cssWideKeywords = ['unset', 'initial', 'inherit'];
	var calcFunctionNames = ['calc(', '-moz-calc(', '-webkit-calc('];

	// https://www.w3.org/TR/css-values-3/#lengths
	var LENGTH = {
	  // absolute length units
	  'px': true,
	  'mm': true,
	  'cm': true,
	  'in': true,
	  'pt': true,
	  'pc': true,
	  'q': true,

	  // relative length units
	  'em': true,
	  'ex': true,
	  'ch': true,
	  'rem': true,

	  // viewport-percentage lengths
	  'vh': true,
	  'vw': true,
	  'vmin': true,
	  'vmax': true,
	  'vm': true
	};

	var ANGLE = {
	  'deg': true,
	  'grad': true,
	  'rad': true,
	  'turn': true
	};

	var TIME = {
	  's': true,
	  'ms': true
	};

	var FREQUENCY = {
	  'hz': true,
	  'khz': true
	};

	// https://www.w3.org/TR/css-values-3/#resolution (https://drafts.csswg.org/css-values/#resolution)
	var RESOLUTION = {
	  'dpi': true,
	  'dpcm': true,
	  'dppx': true,
	  'x': true      // https://github.com/w3c/csswg-drafts/issues/461
	};

	// https://drafts.csswg.org/css-grid/#fr-unit
	var FLEX = {
	  'fr': true
	};

	// https://www.w3.org/TR/css3-speech/#mixing-props-voice-volume
	var DECIBEL = {
	  'db': true
	};

	// https://www.w3.org/TR/css3-speech/#voice-props-voice-pitch
	var SEMITONES = {
	  'st': true
	};

	// safe char code getter
	function charCode(str, index) {
	  return index < str.length ? str.charCodeAt(index) : 0;
	}

	function eqStr(actual, expected) {
	  return cmpStr$3(actual, 0, actual.length, expected);
	}

	function eqStrAny(actual, expected) {
	  for (var i = 0; i < expected.length; i++) {
	      if (eqStr(actual, expected[i])) {
	          return true;
	      }
	  }

	  return false;
	}

	// IE postfix hack, i.e. 123\0 or 123px\9
	function isPostfixIeHack(str, offset) {
	  if (offset !== str.length - 2) {
	      return false;
	  }

	  return (
	      str.charCodeAt(offset) === 0x005C &&  // U+005C REVERSE SOLIDUS (\)
	      isDigit$3(str.charCodeAt(offset + 1))
	  );
	}

	function outOfRange(opts, value, numEnd) {
	  if (opts && opts.type === 'Range') {
	      var num = Number(
	          numEnd !== undefined && numEnd !== value.length
	              ? value.substr(0, numEnd)
	              : value
	      );

	      if (isNaN(num)) {
	          return true;
	      }

	      if (opts.min !== null && num < opts.min) {
	          return true;
	      }

	      if (opts.max !== null && num > opts.max) {
	          return true;
	      }
	  }

	  return false;
	}

	function consumeFunction(token, getNextToken) {
	  var startIdx = token.index;
	  var length = 0;

	  // balanced token consuming
	  do {
	      length++;

	      if (token.balance <= startIdx) {
	          break;
	      }
	  } while (token = getNextToken(length));

	  return length;
	}

	// TODO: implement
	// can be used wherever <length>, <frequency>, <angle>, <time>, <percentage>, <number>, or <integer> values are allowed
	// https://drafts.csswg.org/css-values/#calc-notation
	function calc(next) {
	  return function(token, getNextToken, opts) {
	      if (token === null) {
	          return 0;
	      }

	      if (token.type === TYPE$5.Function && eqStrAny(token.value, calcFunctionNames)) {
	          return consumeFunction(token, getNextToken);
	      }

	      return next(token, getNextToken, opts);
	  };
	}

	function tokenType(expectedTokenType) {
	  return function(token) {
	      if (token === null || token.type !== expectedTokenType) {
	          return 0;
	      }

	      return 1;
	  };
	}

	function func(name) {
	  name = name + '(';

	  return function(token, getNextToken) {
	      if (token !== null && eqStr(token.value, name)) {
	          return consumeFunction(token, getNextToken);
	      }

	      return 0;
	  };
	}

	// =========================
	// Complex types
	//

	// https://drafts.csswg.org/css-values-4/#custom-idents
	// 4.2. Author-defined Identifiers: the <custom-ident> type
	// Some properties accept arbitrary author-defined identifiers as a component value.
	// This generic data type is denoted by <custom-ident>, and represents any valid CSS identifier
	// that would not be misinterpreted as a pre-defined keyword in that property’s value definition.
	//
	// See also: https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident
	function customIdent(token) {
	  if (token === null || token.type !== TYPE$5.Ident) {
	      return 0;
	  }

	  var name = token.value.toLowerCase();

	  // The CSS-wide keywords are not valid <custom-ident>s
	  if (eqStrAny(name, cssWideKeywords)) {
	      return 0;
	  }

	  // The default keyword is reserved and is also not a valid <custom-ident>
	  if (eqStr(name, 'default')) {
	      return 0;
	  }

	  // TODO: ignore property specific keywords (as described https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)
	  // Specifications using <custom-ident> must specify clearly what other keywords
	  // are excluded from <custom-ident>, if any—for example by saying that any pre-defined keywords
	  // in that property’s value definition are excluded. Excluded keywords are excluded
	  // in all ASCII case permutations.

	  return 1;
	}

	// https://drafts.csswg.org/css-variables/#typedef-custom-property-name
	// A custom property is any property whose name starts with two dashes (U+002D HYPHEN-MINUS), like --foo.
	// The <custom-property-name> production corresponds to this: it’s defined as any valid identifier
	// that starts with two dashes, except -- itself, which is reserved for future use by CSS.
	// NOTE: Current implementation treat `--` as a valid name since most (all?) major browsers treat it as valid.
	function customPropertyName(token) {
	  // ... defined as any valid identifier
	  if (token === null || token.type !== TYPE$5.Ident) {
	      return 0;
	  }

	  // ... that starts with two dashes (U+002D HYPHEN-MINUS)
	  if (charCode(token.value, 0) !== 0x002D || charCode(token.value, 1) !== 0x002D) {
	      return 0;
	  }

	  return 1;
	}

	// https://drafts.csswg.org/css-color-4/#hex-notation
	// The syntax of a <hex-color> is a <hash-token> token whose value consists of 3, 4, 6, or 8 hexadecimal digits.
	// In other words, a hex color is written as a hash character, "#", followed by some number of digits 0-9 or
	// letters a-f (the case of the letters doesn’t matter - #00ff00 is identical to #00FF00).
	function hexColor(token) {
	  if (token === null || token.type !== TYPE$5.Hash) {
	      return 0;
	  }

	  var length = token.value.length;

	  // valid values (length): #rgb (4), #rgba (5), #rrggbb (7), #rrggbbaa (9)
	  if (length !== 4 && length !== 5 && length !== 7 && length !== 9) {
	      return 0;
	  }

	  for (var i = 1; i < length; i++) {
	      if (!isHexDigit$3(token.value.charCodeAt(i))) {
	          return 0;
	      }
	  }

	  return 1;
	}

	function idSelector(token) {
	  if (token === null || token.type !== TYPE$5.Hash) {
	      return 0;
	  }

	  if (!isIdentifierStart$2(charCode(token.value, 1), charCode(token.value, 2), charCode(token.value, 3))) {
	      return 0;
	  }

	  return 1;
	}

	// https://drafts.csswg.org/css-syntax/#any-value
	// It represents the entirety of what a valid declaration can have as its value.
	function declarationValue(token, getNextToken) {
	  if (!token) {
	      return 0;
	  }

	  var length = 0;
	  var level = 0;
	  var startIdx = token.index;

	  // The <declaration-value> production matches any sequence of one or more tokens,
	  // so long as the sequence ...
	  scan:
	  do {
	      switch (token.type) {
	          // ... does not contain <bad-string-token>, <bad-url-token>,
	          case TYPE$5.BadString:
	          case TYPE$5.BadUrl:
	              break scan;

	          // ... unmatched <)-token>, <]-token>, or <}-token>,
	          case TYPE$5.RightCurlyBracket:
	          case TYPE$5.RightParenthesis:
	          case TYPE$5.RightSquareBracket:
	              if (token.balance > token.index || token.balance < startIdx) {
	                  break scan;
	              }

	              level--;
	              break;

	          // ... or top-level <semicolon-token> tokens
	          case TYPE$5.Semicolon:
	              if (level === 0) {
	                  break scan;
	              }

	              break;

	          // ... or <delim-token> tokens with a value of "!"
	          case TYPE$5.Delim:
	              if (token.value === '!' && level === 0) {
	                  break scan;
	              }

	              break;

	          case TYPE$5.Function:
	          case TYPE$5.LeftParenthesis:
	          case TYPE$5.LeftSquareBracket:
	          case TYPE$5.LeftCurlyBracket:
	              level++;
	              break;
	      }

	      length++;

	      // until balance closing
	      if (token.balance <= startIdx) {
	          break;
	      }
	  } while (token = getNextToken(length));

	  return length;
	}

	// https://drafts.csswg.org/css-syntax/#any-value
	// The <any-value> production is identical to <declaration-value>, but also
	// allows top-level <semicolon-token> tokens and <delim-token> tokens
	// with a value of "!". It represents the entirety of what valid CSS can be in any context.
	function anyValue(token, getNextToken) {
	  if (!token) {
	      return 0;
	  }

	  var startIdx = token.index;
	  var length = 0;

	  // The <any-value> production matches any sequence of one or more tokens,
	  // so long as the sequence ...
	  scan:
	  do {
	      switch (token.type) {
	          // ... does not contain <bad-string-token>, <bad-url-token>,
	          case TYPE$5.BadString:
	          case TYPE$5.BadUrl:
	              break scan;

	          // ... unmatched <)-token>, <]-token>, or <}-token>,
	          case TYPE$5.RightCurlyBracket:
	          case TYPE$5.RightParenthesis:
	          case TYPE$5.RightSquareBracket:
	              if (token.balance > token.index || token.balance < startIdx) {
	                  break scan;
	              }

	              break;
	      }

	      length++;

	      // until balance closing
	      if (token.balance <= startIdx) {
	          break;
	      }
	  } while (token = getNextToken(length));

	  return length;
	}

	// =========================
	// Dimensions
	//

	function dimension(type) {
	  return function(token, getNextToken, opts) {
	      if (token === null || token.type !== TYPE$5.Dimension) {
	          return 0;
	      }

	      var numberEnd = consumeNumber$2(token.value, 0);

	      // check unit
	      if (type !== null) {
	          // check for IE postfix hack, i.e. 123px\0 or 123px\9
	          var reverseSolidusOffset = token.value.indexOf('\\', numberEnd);
	          var unit = reverseSolidusOffset === -1 || !isPostfixIeHack(token.value, reverseSolidusOffset)
	              ? token.value.substr(numberEnd)
	              : token.value.substring(numberEnd, reverseSolidusOffset);

	          if (type.hasOwnProperty(unit.toLowerCase()) === false) {
	              return 0;
	          }
	      }

	      // check range if specified
	      if (outOfRange(opts, token.value, numberEnd)) {
	          return 0;
	      }

	      return 1;
	  };
	}

	// =========================
	// Percentage
	//

	// §5.5. Percentages: the <percentage> type
	// https://drafts.csswg.org/css-values-4/#percentages
	function percentage(token, getNextToken, opts) {
	  // ... corresponds to the <percentage-token> production
	  if (token === null || token.type !== TYPE$5.Percentage) {
	      return 0;
	  }

	  // check range if specified
	  if (outOfRange(opts, token.value, token.value.length - 1)) {
	      return 0;
	  }

	  return 1;
	}

	// =========================
	// Numeric
	//

	// https://drafts.csswg.org/css-values-4/#numbers
	// The value <zero> represents a literal number with the value 0. Expressions that merely
	// evaluate to a <number> with the value 0 (for example, calc(0)) do not match <zero>;
	// only literal <number-token>s do.
	function zero(next) {
	  if (typeof next !== 'function') {
	      next = function() {
	          return 0;
	      };
	  }

	  return function(token, getNextToken, opts) {
	      if (token !== null && token.type === TYPE$5.Number) {
	          if (Number(token.value) === 0) {
	              return 1;
	          }
	      }

	      return next(token, getNextToken, opts);
	  };
	}

	// § 5.3. Real Numbers: the <number> type
	// https://drafts.csswg.org/css-values-4/#numbers
	// Number values are denoted by <number>, and represent real numbers, possibly with a fractional component.
	// ... It corresponds to the <number-token> production
	function number(token, getNextToken, opts) {
	  if (token === null) {
	      return 0;
	  }

	  var numberEnd = consumeNumber$2(token.value, 0);
	  var isNumber = numberEnd === token.value.length;
	  if (!isNumber && !isPostfixIeHack(token.value, numberEnd)) {
	      return 0;
	  }

	  // check range if specified
	  if (outOfRange(opts, token.value, numberEnd)) {
	      return 0;
	  }

	  return 1;
	}

	// §5.2. Integers: the <integer> type
	// https://drafts.csswg.org/css-values-4/#integers
	function integer(token, getNextToken, opts) {
	  // ... corresponds to a subset of the <number-token> production
	  if (token === null || token.type !== TYPE$5.Number) {
	      return 0;
	  }

	  // The first digit of an integer may be immediately preceded by `-` or `+` to indicate the integer’s sign.
	  var i = token.value.charCodeAt(0) === 0x002B ||       // U+002B PLUS SIGN (+)
	          token.value.charCodeAt(0) === 0x002D ? 1 : 0; // U+002D HYPHEN-MINUS (-)

	  // When written literally, an integer is one or more decimal digits 0 through 9 ...
	  for (; i < token.value.length; i++) {
	      if (!isDigit$3(token.value.charCodeAt(i))) {
	          return 0;
	      }
	  }

	  // check range if specified
	  if (outOfRange(opts, token.value, i)) {
	      return 0;
	  }

	  return 1;
	}

	var generic = {
	  // token types
	  'ident-token': tokenType(TYPE$5.Ident),
	  'function-token': tokenType(TYPE$5.Function),
	  'at-keyword-token': tokenType(TYPE$5.AtKeyword),
	  'hash-token': tokenType(TYPE$5.Hash),
	  'string-token': tokenType(TYPE$5.String),
	  'bad-string-token': tokenType(TYPE$5.BadString),
	  'url-token': tokenType(TYPE$5.Url),
	  'bad-url-token': tokenType(TYPE$5.BadUrl),
	  'delim-token': tokenType(TYPE$5.Delim),
	  'number-token': tokenType(TYPE$5.Number),
	  'percentage-token': tokenType(TYPE$5.Percentage),
	  'dimension-token': tokenType(TYPE$5.Dimension),
	  'whitespace-token': tokenType(TYPE$5.WhiteSpace),
	  'CDO-token': tokenType(TYPE$5.CDO),
	  'CDC-token': tokenType(TYPE$5.CDC),
	  'colon-token': tokenType(TYPE$5.Colon),
	  'semicolon-token': tokenType(TYPE$5.Semicolon),
	  'comma-token': tokenType(TYPE$5.Comma),
	  '[-token': tokenType(TYPE$5.LeftSquareBracket),
	  ']-token': tokenType(TYPE$5.RightSquareBracket),
	  '(-token': tokenType(TYPE$5.LeftParenthesis),
	  ')-token': tokenType(TYPE$5.RightParenthesis),
	  '{-token': tokenType(TYPE$5.LeftCurlyBracket),
	  '}-token': tokenType(TYPE$5.RightCurlyBracket),

	  // token type aliases
	  'string': tokenType(TYPE$5.String),
	  'ident': tokenType(TYPE$5.Ident),

	  // complex types
	  'custom-ident': customIdent,
	  'custom-property-name': customPropertyName,
	  'hex-color': hexColor,
	  'id-selector': idSelector, // element( <id-selector> )
	  'an-plus-b': genericAnPlusB,
	  'urange': genericUrange,
	  'declaration-value': declarationValue,
	  'any-value': anyValue,

	  // dimensions
	  'dimension': calc(dimension(null)),
	  'angle': calc(dimension(ANGLE)),
	  'decibel': calc(dimension(DECIBEL)),
	  'frequency': calc(dimension(FREQUENCY)),
	  'flex': calc(dimension(FLEX)),
	  'length': calc(zero(dimension(LENGTH))),
	  'resolution': calc(dimension(RESOLUTION)),
	  'semitones': calc(dimension(SEMITONES)),
	  'time': calc(dimension(TIME)),

	  // percentage
	  'percentage': calc(percentage),

	  // numeric
	  'zero': zero(),
	  'number': calc(number),
	  'integer': calc(integer),

	  // old IE stuff
	  '-ms-legacy-expression': func('expression')
	};

	var _SyntaxError$1 = function SyntaxError(message, input, offset) {
	  var error = createCustomError('SyntaxError', message);

	  error.input = input;
	  error.offset = offset;
	  error.rawMessage = message;
	  error.message = error.rawMessage + '\n' +
	      '  ' + error.input + '\n' +
	      '--' + new Array((error.offset || error.input.length) + 1).join('-') + '^';

	  return error;
	};

	var TAB = 9;
	var N$1 = 10;
	var F = 12;
	var R = 13;
	var SPACE = 32;

	var Tokenizer = function(str) {
	  this.str = str;
	  this.pos = 0;
	};

	Tokenizer.prototype = {
	  charCodeAt: function(pos) {
	      return pos < this.str.length ? this.str.charCodeAt(pos) : 0;
	  },
	  charCode: function() {
	      return this.charCodeAt(this.pos);
	  },
	  nextCharCode: function() {
	      return this.charCodeAt(this.pos + 1);
	  },
	  nextNonWsCode: function(pos) {
	      return this.charCodeAt(this.findWsEnd(pos));
	  },
	  findWsEnd: function(pos) {
	      for (; pos < this.str.length; pos++) {
	          var code = this.str.charCodeAt(pos);
	          if (code !== R && code !== N$1 && code !== F && code !== SPACE && code !== TAB) {
	              break;
	          }
	      }

	      return pos;
	  },
	  substringToPos: function(end) {
	      return this.str.substring(this.pos, this.pos = end);
	  },
	  eat: function(code) {
	      if (this.charCode() !== code) {
	          this.error('Expect `' + String.fromCharCode(code) + '`');
	      }

	      this.pos++;
	  },
	  peek: function() {
	      return this.pos < this.str.length ? this.str.charAt(this.pos++) : '';
	  },
	  error: function(message) {
	      throw new _SyntaxError$1(message, this.str, this.pos);
	  }
	};

	var tokenizer$1 = Tokenizer;

	var TAB$1 = 9;
	var N$2 = 10;
	var F$1 = 12;
	var R$1 = 13;
	var SPACE$1 = 32;
	var EXCLAMATIONMARK = 33;    // !
	var NUMBERSIGN = 35;         // #
	var AMPERSAND = 38;          // &
	var APOSTROPHE = 39;         // '
	var LEFTPARENTHESIS = 40;    // (
	var RIGHTPARENTHESIS = 41;   // )
	var ASTERISK = 42;           // *
	var PLUSSIGN$2 = 43;           // +
	var COMMA = 44;              // ,
	var HYPERMINUS = 45;         // -
	var LESSTHANSIGN = 60;       // <
	var GREATERTHANSIGN = 62;    // >
	var QUESTIONMARK$1 = 63;       // ?
	var COMMERCIALAT = 64;       // @
	var LEFTSQUAREBRACKET = 91;  // [
	var RIGHTSQUAREBRACKET = 93; // ]
	var LEFTCURLYBRACKET = 123;  // {
	var VERTICALLINE = 124;      // |
	var RIGHTCURLYBRACKET = 125; // }
	var INFINITY = 8734;         // ∞
	var NAME_CHAR = createCharMap(function(ch) {
	  return /[a-zA-Z0-9\-]/.test(ch);
	});
	var COMBINATOR_PRECEDENCE = {
	  ' ': 1,
	  '&&': 2,
	  '||': 3,
	  '|': 4
	};

	function createCharMap(fn) {
	  var array = typeof Uint32Array === 'function' ? new Uint32Array(128) : new Array(128);
	  for (var i = 0; i < 128; i++) {
	      array[i] = fn(String.fromCharCode(i)) ? 1 : 0;
	  }
	  return array;
	}

	function scanSpaces(tokenizer) {
	  return tokenizer.substringToPos(
	      tokenizer.findWsEnd(tokenizer.pos)
	  );
	}

	function scanWord(tokenizer) {
	  var end = tokenizer.pos;

	  for (; end < tokenizer.str.length; end++) {
	      var code = tokenizer.str.charCodeAt(end);
	      if (code >= 128 || NAME_CHAR[code] === 0) {
	          break;
	      }
	  }

	  if (tokenizer.pos === end) {
	      tokenizer.error('Expect a keyword');
	  }

	  return tokenizer.substringToPos(end);
	}

	function scanNumber(tokenizer) {
	  var end = tokenizer.pos;

	  for (; end < tokenizer.str.length; end++) {
	      var code = tokenizer.str.charCodeAt(end);
	      if (code < 48 || code > 57) {
	          break;
	      }
	  }

	  if (tokenizer.pos === end) {
	      tokenizer.error('Expect a number');
	  }

	  return tokenizer.substringToPos(end);
	}

	function scanString(tokenizer) {
	  var end = tokenizer.str.indexOf('\'', tokenizer.pos + 1);

	  if (end === -1) {
	      tokenizer.pos = tokenizer.str.length;
	      tokenizer.error('Expect an apostrophe');
	  }

	  return tokenizer.substringToPos(end + 1);
	}

	function readMultiplierRange(tokenizer) {
	  var min = null;
	  var max = null;

	  tokenizer.eat(LEFTCURLYBRACKET);

	  min = scanNumber(tokenizer);

	  if (tokenizer.charCode() === COMMA) {
	      tokenizer.pos++;
	      if (tokenizer.charCode() !== RIGHTCURLYBRACKET) {
	          max = scanNumber(tokenizer);
	      }
	  } else {
	      max = min;
	  }

	  tokenizer.eat(RIGHTCURLYBRACKET);

	  return {
	      min: Number(min),
	      max: max ? Number(max) : 0
	  };
	}

	function readMultiplier(tokenizer) {
	  var range = null;
	  var comma = false;

	  switch (tokenizer.charCode()) {
	      case ASTERISK:
	          tokenizer.pos++;

	          range = {
	              min: 0,
	              max: 0
	          };

	          break;

	      case PLUSSIGN$2:
	          tokenizer.pos++;

	          range = {
	              min: 1,
	              max: 0
	          };

	          break;

	      case QUESTIONMARK$1:
	          tokenizer.pos++;

	          range = {
	              min: 0,
	              max: 1
	          };

	          break;

	      case NUMBERSIGN:
	          tokenizer.pos++;

	          comma = true;

	          if (tokenizer.charCode() === LEFTCURLYBRACKET) {
	              range = readMultiplierRange(tokenizer);
	          } else {
	              range = {
	                  min: 1,
	                  max: 0
	              };
	          }

	          break;

	      case LEFTCURLYBRACKET:
	          range = readMultiplierRange(tokenizer);
	          break;

	      default:
	          return null;
	  }

	  return {
	      type: 'Multiplier',
	      comma: comma,
	      min: range.min,
	      max: range.max,
	      term: null
	  };
	}

	function maybeMultiplied(tokenizer, node) {
	  var multiplier = readMultiplier(tokenizer);

	  if (multiplier !== null) {
	      multiplier.term = node;
	      return multiplier;
	  }

	  return node;
	}

	function maybeToken(tokenizer) {
	  var ch = tokenizer.peek();

	  if (ch === '') {
	      return null;
	  }

	  return {
	      type: 'Token',
	      value: ch
	  };
	}

	function readProperty(tokenizer) {
	  var name;

	  tokenizer.eat(LESSTHANSIGN);
	  tokenizer.eat(APOSTROPHE);

	  name = scanWord(tokenizer);

	  tokenizer.eat(APOSTROPHE);
	  tokenizer.eat(GREATERTHANSIGN);

	  return maybeMultiplied(tokenizer, {
	      type: 'Property',
	      name: name
	  });
	}

	// https://drafts.csswg.org/css-values-3/#numeric-ranges
	// 4.1. Range Restrictions and Range Definition Notation
	//
	// Range restrictions can be annotated in the numeric type notation using CSS bracketed
	// range notation—[min,max]—within the angle brackets, after the identifying keyword,
	// indicating a closed range between (and including) min and max.
	// For example, <integer [0, 10]> indicates an integer between 0 and 10, inclusive.
	function readTypeRange(tokenizer) {
	  // use null for Infinity to make AST format JSON serializable/deserializable
	  var min = null; // -Infinity
	  var max = null; // Infinity
	  var sign = 1;

	  tokenizer.eat(LEFTSQUAREBRACKET);

	  if (tokenizer.charCode() === HYPERMINUS) {
	      tokenizer.peek();
	      sign = -1;
	  }

	  if (sign == -1 && tokenizer.charCode() === INFINITY) {
	      tokenizer.peek();
	  } else {
	      min = sign * Number(scanNumber(tokenizer));
	  }

	  scanSpaces(tokenizer);
	  tokenizer.eat(COMMA);
	  scanSpaces(tokenizer);

	  if (tokenizer.charCode() === INFINITY) {
	      tokenizer.peek();
	  } else {
	      sign = 1;

	      if (tokenizer.charCode() === HYPERMINUS) {
	          tokenizer.peek();
	          sign = -1;
	      }

	      max = sign * Number(scanNumber(tokenizer));
	  }

	  tokenizer.eat(RIGHTSQUAREBRACKET);

	  // If no range is indicated, either by using the bracketed range notation
	  // or in the property description, then [−∞,∞] is assumed.
	  if (min === null && max === null) {
	      return null;
	  }

	  return {
	      type: 'Range',
	      min: min,
	      max: max
	  };
	}

	function readType(tokenizer) {
	  var name;
	  var opts = null;

	  tokenizer.eat(LESSTHANSIGN);
	  name = scanWord(tokenizer);

	  if (tokenizer.charCode() === LEFTPARENTHESIS &&
	      tokenizer.nextCharCode() === RIGHTPARENTHESIS) {
	      tokenizer.pos += 2;
	      name += '()';
	  }

	  if (tokenizer.charCodeAt(tokenizer.findWsEnd(tokenizer.pos)) === LEFTSQUAREBRACKET) {
	      scanSpaces(tokenizer);
	      opts = readTypeRange(tokenizer);
	  }

	  tokenizer.eat(GREATERTHANSIGN);

	  return maybeMultiplied(tokenizer, {
	      type: 'Type',
	      name: name,
	      opts: opts
	  });
	}

	function readKeywordOrFunction(tokenizer) {
	  var name;

	  name = scanWord(tokenizer);

	  if (tokenizer.charCode() === LEFTPARENTHESIS) {
	      tokenizer.pos++;

	      return {
	          type: 'Function',
	          name: name
	      };
	  }

	  return maybeMultiplied(tokenizer, {
	      type: 'Keyword',
	      name: name
	  });
	}

	function regroupTerms(terms, combinators) {
	  function createGroup(terms, combinator) {
	      return {
	          type: 'Group',
	          terms: terms,
	          combinator: combinator,
	          disallowEmpty: false,
	          explicit: false
	      };
	  }

	  combinators = Object.keys(combinators).sort(function(a, b) {
	      return COMBINATOR_PRECEDENCE[a] - COMBINATOR_PRECEDENCE[b];
	  });

	  while (combinators.length > 0) {
	      var combinator = combinators.shift();
	      for (var i = 0, subgroupStart = 0; i < terms.length; i++) {
	          var term = terms[i];
	          if (term.type === 'Combinator') {
	              if (term.value === combinator) {
	                  if (subgroupStart === -1) {
	                      subgroupStart = i - 1;
	                  }
	                  terms.splice(i, 1);
	                  i--;
	              } else {
	                  if (subgroupStart !== -1 && i - subgroupStart > 1) {
	                      terms.splice(
	                          subgroupStart,
	                          i - subgroupStart,
	                          createGroup(terms.slice(subgroupStart, i), combinator)
	                      );
	                      i = subgroupStart + 1;
	                  }
	                  subgroupStart = -1;
	              }
	          }
	      }

	      if (subgroupStart !== -1 && combinators.length) {
	          terms.splice(
	              subgroupStart,
	              i - subgroupStart,
	              createGroup(terms.slice(subgroupStart, i), combinator)
	          );
	      }
	  }

	  return combinator;
	}

	function readImplicitGroup(tokenizer) {
	  var terms = [];
	  var combinators = {};
	  var token;
	  var prevToken = null;
	  var prevTokenPos = tokenizer.pos;

	  while (token = peek(tokenizer)) {
	      if (token.type !== 'Spaces') {
	          if (token.type === 'Combinator') {
	              // check for combinator in group beginning and double combinator sequence
	              if (prevToken === null || prevToken.type === 'Combinator') {
	                  tokenizer.pos = prevTokenPos;
	                  tokenizer.error('Unexpected combinator');
	              }

	              combinators[token.value] = true;
	          } else if (prevToken !== null && prevToken.type !== 'Combinator') {
	              combinators[' '] = true;  // a b
	              terms.push({
	                  type: 'Combinator',
	                  value: ' '
	              });
	          }

	          terms.push(token);
	          prevToken = token;
	          prevTokenPos = tokenizer.pos;
	      }
	  }

	  // check for combinator in group ending
	  if (prevToken !== null && prevToken.type === 'Combinator') {
	      tokenizer.pos -= prevTokenPos;
	      tokenizer.error('Unexpected combinator');
	  }

	  return {
	      type: 'Group',
	      terms: terms,
	      combinator: regroupTerms(terms, combinators) || ' ',
	      disallowEmpty: false,
	      explicit: false
	  };
	}

	function readGroup(tokenizer) {
	  var result;

	  tokenizer.eat(LEFTSQUAREBRACKET);
	  result = readImplicitGroup(tokenizer);
	  tokenizer.eat(RIGHTSQUAREBRACKET);

	  result.explicit = true;

	  if (tokenizer.charCode() === EXCLAMATIONMARK) {
	      tokenizer.pos++;
	      result.disallowEmpty = true;
	  }

	  return result;
	}

	function peek(tokenizer) {
	  var code = tokenizer.charCode();

	  if (code < 128 && NAME_CHAR[code] === 1) {
	      return readKeywordOrFunction(tokenizer);
	  }

	  switch (code) {
	      case RIGHTSQUAREBRACKET:
	          // don't eat, stop scan a group
	          break;

	      case LEFTSQUAREBRACKET:
	          return maybeMultiplied(tokenizer, readGroup(tokenizer));

	      case LESSTHANSIGN:
	          return tokenizer.nextCharCode() === APOSTROPHE
	              ? readProperty(tokenizer)
	              : readType(tokenizer);

	      case VERTICALLINE:
	          return {
	              type: 'Combinator',
	              value: tokenizer.substringToPos(
	                  tokenizer.nextCharCode() === VERTICALLINE
	                      ? tokenizer.pos + 2
	                      : tokenizer.pos + 1
	              )
	          };

	      case AMPERSAND:
	          tokenizer.pos++;
	          tokenizer.eat(AMPERSAND);

	          return {
	              type: 'Combinator',
	              value: '&&'
	          };

	      case COMMA:
	          tokenizer.pos++;
	          return {
	              type: 'Comma'
	          };

	      case APOSTROPHE:
	          return maybeMultiplied(tokenizer, {
	              type: 'String',
	              value: scanString(tokenizer)
	          });

	      case SPACE$1:
	      case TAB$1:
	      case N$2:
	      case R$1:
	      case F$1:
	          return {
	              type: 'Spaces',
	              value: scanSpaces(tokenizer)
	          };

	      case COMMERCIALAT:
	          code = tokenizer.nextCharCode();

	          if (code < 128 && NAME_CHAR[code] === 1) {
	              tokenizer.pos++;
	              return {
	                  type: 'AtKeyword',
	                  name: scanWord(tokenizer)
	              };
	          }

	          return maybeToken(tokenizer);

	      case ASTERISK:
	      case PLUSSIGN$2:
	      case QUESTIONMARK$1:
	      case NUMBERSIGN:
	      case EXCLAMATIONMARK:
	          // prohibited tokens (used as a multiplier start)
	          break;

	      case LEFTCURLYBRACKET:
	          // LEFTCURLYBRACKET is allowed since mdn/data uses it w/o quoting
	          // check next char isn't a number, because it's likely a disjoined multiplier
	          code = tokenizer.nextCharCode();

	          if (code < 48 || code > 57) {
	              return maybeToken(tokenizer);
	          }

	          break;

	      default:
	          return maybeToken(tokenizer);
	  }
	}

	function parse(source) {
	  var tokenizer = new tokenizer$1(source);
	  var result = readImplicitGroup(tokenizer);

	  if (tokenizer.pos !== source.length) {
	      tokenizer.error('Unexpected input');
	  }

	  // reduce redundant groups with single group term
	  if (result.terms.length === 1 && result.terms[0].type === 'Group') {
	      result = result.terms[0];
	  }

	  return result;
	}

	// warm up parse to elimitate code branches that never execute
	// fix soft deoptimizations (insufficient type feedback)
	parse('[a&&<b>#|<\'c\'>*||e() f{2} /,(% g#{1,2} h{2,})]!');

	var parse_1 = parse;

	var noop$1 = function() {};

	function ensureFunction(value) {
	  return typeof value === 'function' ? value : noop$1;
	}

	var walk = function(node, options, context) {
	  function walk(node) {
	      enter.call(context, node);

	      switch (node.type) {
	          case 'Group':
	              node.terms.forEach(walk);
	              break;

	          case 'Multiplier':
	              walk(node.term);
	              break;

	          case 'Type':
	          case 'Property':
	          case 'Keyword':
	          case 'AtKeyword':
	          case 'Function':
	          case 'String':
	          case 'Token':
	          case 'Comma':
	              break;

	          default:
	              throw new Error('Unknown type: ' + node.type);
	      }

	      leave.call(context, node);
	  }

	  var enter = noop$1;
	  var leave = noop$1;

	  if (typeof options === 'function') {
	      enter = options;
	  } else if (options) {
	      enter = ensureFunction(options.enter);
	      leave = ensureFunction(options.leave);
	  }

	  if (enter === noop$1 && leave === noop$1) {
	      throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
	  }

	  walk(node);
	};

	var tokenStream = new TokenStream_1();
	var astToTokens = {
	  decorator: function(handlers) {
	      var curNode = null;
	      var prev = { len: 0, node: null };
	      var nodes = [prev];
	      var buffer = '';

	      return {
	          children: handlers.children,
	          node: function(node) {
	              var tmp = curNode;
	              curNode = node;
	              handlers.node.call(this, node);
	              curNode = tmp;
	          },
	          chunk: function(chunk) {
	              buffer += chunk;
	              if (prev.node !== curNode) {
	                  nodes.push({
	                      len: chunk.length,
	                      node: curNode
	                  });
	              } else {
	                  prev.len += chunk.length;
	              }
	          },
	          result: function() {
	              return prepareTokens(buffer, nodes);
	          }
	      };
	  }
	};

	function prepareTokens(str, nodes) {
	  var tokens = [];
	  var nodesOffset = 0;
	  var nodesIndex = 0;
	  var currentNode = nodes ? nodes[nodesIndex].node : null;

	  tokenizer(str, tokenStream);

	  while (!tokenStream.eof) {
	      if (nodes) {
	          while (nodesIndex < nodes.length && nodesOffset + nodes[nodesIndex].len <= tokenStream.tokenStart) {
	              nodesOffset += nodes[nodesIndex++].len;
	              currentNode = nodes[nodesIndex].node;
	          }
	      }

	      tokens.push({
	          type: tokenStream.tokenType,
	          value: tokenStream.getTokenValue(),
	          index: tokenStream.tokenIndex, // TODO: remove it, temporary solution
	          balance: tokenStream.balance[tokenStream.tokenIndex], // TODO: remove it, temporary solution
	          node: currentNode
	      });
	      tokenStream.next();
	      // console.log({ ...tokens[tokens.length - 1], node: undefined });
	  }

	  return tokens;
	}

	var prepareTokens_1 = function(value, syntax) {
	  if (typeof value === 'string') {
	      return prepareTokens(value, null);
	  }

	  return syntax.generate(value, astToTokens);
	};

	var MATCH = { type: 'Match' };
	var MISMATCH = { type: 'Mismatch' };
	var DISALLOW_EMPTY = { type: 'DisallowEmpty' };
	var LEFTPARENTHESIS$1 = 40;  // (
	var RIGHTPARENTHESIS$1 = 41; // )

	function createCondition(match, thenBranch, elseBranch) {
	  // reduce node count
	  if (thenBranch === MATCH && elseBranch === MISMATCH) {
	      return match;
	  }

	  if (match === MATCH && thenBranch === MATCH && elseBranch === MATCH) {
	      return match;
	  }

	  if (match.type === 'If' && match.else === MISMATCH && thenBranch === MATCH) {
	      thenBranch = match.then;
	      match = match.match;
	  }

	  return {
	      type: 'If',
	      match: match,
	      then: thenBranch,
	      else: elseBranch
	  };
	}

	function isFunctionType(name) {
	  return (
	      name.length > 2 &&
	      name.charCodeAt(name.length - 2) === LEFTPARENTHESIS$1 &&
	      name.charCodeAt(name.length - 1) === RIGHTPARENTHESIS$1
	  );
	}

	function isEnumCapatible(term) {
	  return (
	      term.type === 'Keyword' ||
	      term.type === 'AtKeyword' ||
	      term.type === 'Function' ||
	      term.type === 'Type' && isFunctionType(term.name)
	  );
	}

	function buildGroupMatchGraph(combinator, terms, atLeastOneTermMatched) {
	  switch (combinator) {
	      case ' ':
	          // Juxtaposing components means that all of them must occur, in the given order.
	          //
	          // a b c
	          // =
	          // match a
	          //   then match b
	          //     then match c
	          //       then MATCH
	          //       else MISMATCH
	          //     else MISMATCH
	          //   else MISMATCH
	          var result = MATCH;

	          for (var i = terms.length - 1; i >= 0; i--) {
	              var term = terms[i];

	              result = createCondition(
	                  term,
	                  result,
	                  MISMATCH
	              );
	          }
	          return result;

	      case '|':
	          // A bar (|) separates two or more alternatives: exactly one of them must occur.
	          //
	          // a | b | c
	          // =
	          // match a
	          //   then MATCH
	          //   else match b
	          //     then MATCH
	          //     else match c
	          //       then MATCH
	          //       else MISMATCH

	          var result = MISMATCH;
	          var map = null;

	          for (var i = terms.length - 1; i >= 0; i--) {
	              var term = terms[i];

	              // reduce sequence of keywords into a Enum
	              if (isEnumCapatible(term)) {
	                  if (map === null && i > 0 && isEnumCapatible(terms[i - 1])) {
	                      map = Object.create(null);
	                      result = createCondition(
	                          {
	                              type: 'Enum',
	                              map: map
	                          },
	                          MATCH,
	                          result
	                      );
	                  }

	                  if (map !== null) {
	                      var key = (isFunctionType(term.name) ? term.name.slice(0, -1) : term.name).toLowerCase();
	                      if (key in map === false) {
	                          map[key] = term;
	                          continue;
	                      }
	                  }
	              }

	              map = null;

	              // create a new conditonal node
	              result = createCondition(
	                  term,
	                  MATCH,
	                  result
	              );
	          }
	          return result;

	      case '&&':
	          // A double ampersand (&&) separates two or more components,
	          // all of which must occur, in any order.

	          // Use MatchOnce for groups with a large number of terms,
	          // since &&-groups produces at least N!-node trees
	          if (terms.length > 5) {
	              return {
	                  type: 'MatchOnce',
	                  terms: terms,
	                  all: true
	              };
	          }

	          // Use a combination tree for groups with small number of terms
	          //
	          // a && b && c
	          // =
	          // match a
	          //   then [b && c]
	          //   else match b
	          //     then [a && c]
	          //     else match c
	          //       then [a && b]
	          //       else MISMATCH
	          //
	          // a && b
	          // =
	          // match a
	          //   then match b
	          //     then MATCH
	          //     else MISMATCH
	          //   else match b
	          //     then match a
	          //       then MATCH
	          //       else MISMATCH
	          //     else MISMATCH
	          var result = MISMATCH;

	          for (var i = terms.length - 1; i >= 0; i--) {
	              var term = terms[i];
	              var thenClause;

	              if (terms.length > 1) {
	                  thenClause = buildGroupMatchGraph(
	                      combinator,
	                      terms.filter(function(newGroupTerm) {
	                          return newGroupTerm !== term;
	                      }),
	                      false
	                  );
	              } else {
	                  thenClause = MATCH;
	              }

	              result = createCondition(
	                  term,
	                  thenClause,
	                  result
	              );
	          }
	          return result;

	      case '||':
	          // A double bar (||) separates two or more options:
	          // one or more of them must occur, in any order.

	          // Use MatchOnce for groups with a large number of terms,
	          // since ||-groups produces at least N!-node trees
	          if (terms.length > 5) {
	              return {
	                  type: 'MatchOnce',
	                  terms: terms,
	                  all: false
	              };
	          }

	          // Use a combination tree for groups with small number of terms
	          //
	          // a || b || c
	          // =
	          // match a
	          //   then [b || c]
	          //   else match b
	          //     then [a || c]
	          //     else match c
	          //       then [a || b]
	          //       else MISMATCH
	          //
	          // a || b
	          // =
	          // match a
	          //   then match b
	          //     then MATCH
	          //     else MATCH
	          //   else match b
	          //     then match a
	          //       then MATCH
	          //       else MATCH
	          //     else MISMATCH
	          var result = atLeastOneTermMatched ? MATCH : MISMATCH;

	          for (var i = terms.length - 1; i >= 0; i--) {
	              var term = terms[i];
	              var thenClause;

	              if (terms.length > 1) {
	                  thenClause = buildGroupMatchGraph(
	                      combinator,
	                      terms.filter(function(newGroupTerm) {
	                          return newGroupTerm !== term;
	                      }),
	                      true
	                  );
	              } else {
	                  thenClause = MATCH;
	              }

	              result = createCondition(
	                  term,
	                  thenClause,
	                  result
	              );
	          }
	          return result;
	  }
	}

	function buildMultiplierMatchGraph(node) {
	  var result = MATCH;
	  var matchTerm = buildMatchGraph(node.term);

	  if (node.max === 0) {
	      // disable repeating of empty match to prevent infinite loop
	      matchTerm = createCondition(
	          matchTerm,
	          DISALLOW_EMPTY,
	          MISMATCH
	      );

	      // an occurrence count is not limited, make a cycle;
	      // to collect more terms on each following matching mismatch
	      result = createCondition(
	          matchTerm,
	          null, // will be a loop
	          MISMATCH
	      );

	      result.then = createCondition(
	          MATCH,
	          MATCH,
	          result // make a loop
	      );

	      if (node.comma) {
	          result.then.else = createCondition(
	              { type: 'Comma', syntax: node },
	              result,
	              MISMATCH
	          );
	      }
	  } else {
	      // create a match node chain for [min .. max] interval with optional matches
	      for (var i = node.min || 1; i <= node.max; i++) {
	          if (node.comma && result !== MATCH) {
	              result = createCondition(
	                  { type: 'Comma', syntax: node },
	                  result,
	                  MISMATCH
	              );
	          }

	          result = createCondition(
	              matchTerm,
	              createCondition(
	                  MATCH,
	                  MATCH,
	                  result
	              ),
	              MISMATCH
	          );
	      }
	  }

	  if (node.min === 0) {
	      // allow zero match
	      result = createCondition(
	          MATCH,
	          MATCH,
	          result
	      );
	  } else {
	      // create a match node chain to collect [0 ... min - 1] required matches
	      for (var i = 0; i < node.min - 1; i++) {
	          if (node.comma && result !== MATCH) {
	              result = createCondition(
	                  { type: 'Comma', syntax: node },
	                  result,
	                  MISMATCH
	              );
	          }

	          result = createCondition(
	              matchTerm,
	              result,
	              MISMATCH
	          );
	      }
	  }

	  return result;
	}

	function buildMatchGraph(node) {
	  if (typeof node === 'function') {
	      return {
	          type: 'Generic',
	          fn: node
	      };
	  }

	  switch (node.type) {
	      case 'Group':
	          var result = buildGroupMatchGraph(
	              node.combinator,
	              node.terms.map(buildMatchGraph),
	              false
	          );

	          if (node.disallowEmpty) {
	              result = createCondition(
	                  result,
	                  DISALLOW_EMPTY,
	                  MISMATCH
	              );
	          }

	          return result;

	      case 'Multiplier':
	          return buildMultiplierMatchGraph(node);

	      case 'Type':
	      case 'Property':
	          return {
	              type: node.type,
	              name: node.name,
	              syntax: node
	          };

	      case 'Keyword':
	          return {
	              type: node.type,
	              name: node.name.toLowerCase(),
	              syntax: node
	          };

	      case 'AtKeyword':
	          return {
	              type: node.type,
	              name: '@' + node.name.toLowerCase(),
	              syntax: node
	          };

	      case 'Function':
	          return {
	              type: node.type,
	              name: node.name.toLowerCase() + '(',
	              syntax: node
	          };

	      case 'String':
	          // convert a one char length String to a Token
	          if (node.value.length === 3) {
	              return {
	                  type: 'Token',
	                  value: node.value.charAt(1),
	                  syntax: node
	              };
	          }

	          // otherwise use it as is
	          return {
	              type: node.type,
	              value: node.value.substr(1, node.value.length - 2).replace(/\\'/g, '\''),
	              syntax: node
	          };

	      case 'Token':
	          return {
	              type: node.type,
	              value: node.value,
	              syntax: node
	          };

	      case 'Comma':
	          return {
	              type: node.type,
	              syntax: node
	          };

	      default:
	          throw new Error('Unknown node type:', node.type);
	  }
	}

	var matchGraph = {
	  MATCH: MATCH,
	  MISMATCH: MISMATCH,
	  DISALLOW_EMPTY: DISALLOW_EMPTY,
	  buildMatchGraph: function(syntaxTree, ref) {
	      if (typeof syntaxTree === 'string') {
	          syntaxTree = parse_1(syntaxTree);
	      }

	      return {
	          type: 'MatchGraph',
	          match: buildMatchGraph(syntaxTree),
	          syntax: ref || null,
	          source: syntaxTree
	      };
	  }
	};

	var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

	var MATCH$1 = matchGraph.MATCH;
	var MISMATCH$1 = matchGraph.MISMATCH;
	var DISALLOW_EMPTY$1 = matchGraph.DISALLOW_EMPTY;
	var TYPE$6 = _const.TYPE;

	var STUB = 0;
	var TOKEN = 1;
	var OPEN_SYNTAX = 2;
	var CLOSE_SYNTAX = 3;

	var EXIT_REASON_MATCH = 'Match';
	var EXIT_REASON_MISMATCH = 'Mismatch';
	var EXIT_REASON_ITERATION_LIMIT = 'Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)';

	var ITERATION_LIMIT = 15000;
	var totalIterationCount = 0;

	function reverseList(list) {
	  var prev = null;
	  var next = null;
	  var item = list;

	  while (item !== null) {
	      next = item.prev;
	      item.prev = prev;
	      prev = item;
	      item = next;
	  }

	  return prev;
	}

	function areStringsEqualCaseInsensitive(testStr, referenceStr) {
	  if (testStr.length !== referenceStr.length) {
	      return false;
	  }

	  for (var i = 0; i < testStr.length; i++) {
	      var testCode = testStr.charCodeAt(i);
	      var referenceCode = referenceStr.charCodeAt(i);

	      // testCode.toLowerCase() for U+0041 LATIN CAPITAL LETTER A (A) .. U+005A LATIN CAPITAL LETTER Z (Z).
	      if (testCode >= 0x0041 && testCode <= 0x005A) {
	          testCode = testCode | 32;
	      }

	      if (testCode !== referenceCode) {
	          return false;
	      }
	  }

	  return true;
	}

	function isContextEdgeDelim(token) {
	  if (token.type !== TYPE$6.Delim) {
	      return false;
	  }

	  // Fix matching for unicode-range: U+30??, U+FF00-FF9F
	  // Probably we need to check out previous match instead
	  return token.value !== '?';
	}

	function isCommaContextStart(token) {
	  if (token === null) {
	      return true;
	  }

	  return (
	      token.type === TYPE$6.Comma ||
	      token.type === TYPE$6.Function ||
	      token.type === TYPE$6.LeftParenthesis ||
	      token.type === TYPE$6.LeftSquareBracket ||
	      token.type === TYPE$6.LeftCurlyBracket ||
	      isContextEdgeDelim(token)
	  );
	}

	function isCommaContextEnd(token) {
	  if (token === null) {
	      return true;
	  }

	  return (
	      token.type === TYPE$6.RightParenthesis ||
	      token.type === TYPE$6.RightSquareBracket ||
	      token.type === TYPE$6.RightCurlyBracket ||
	      token.type === TYPE$6.Delim
	  );
	}

	function internalMatch(tokens, state, syntaxes) {
	  function moveToNextToken() {
	      do {
	          tokenIndex++;
	          token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;
	      } while (token !== null && (token.type === TYPE$6.WhiteSpace || token.type === TYPE$6.Comment));
	  }

	  function getNextToken(offset) {
	      var nextIndex = tokenIndex + offset;

	      return nextIndex < tokens.length ? tokens[nextIndex] : null;
	  }

	  function stateSnapshotFromSyntax(nextState, prev) {
	      return {
	          nextState: nextState,
	          matchStack: matchStack,
	          syntaxStack: syntaxStack,
	          thenStack: thenStack,
	          tokenIndex: tokenIndex,
	          prev: prev
	      };
	  }

	  function pushThenStack(nextState) {
	      thenStack = {
	          nextState: nextState,
	          matchStack: matchStack,
	          syntaxStack: syntaxStack,
	          prev: thenStack
	      };
	  }

	  function pushElseStack(nextState) {
	      elseStack = stateSnapshotFromSyntax(nextState, elseStack);
	  }

	  function addTokenToMatch() {
	      matchStack = {
	          type: TOKEN,
	          syntax: state.syntax,
	          token: token,
	          prev: matchStack
	      };

	      moveToNextToken();
	      syntaxStash = null;

	      if (tokenIndex > longestMatch) {
	          longestMatch = tokenIndex;
	      }
	  }

	  function openSyntax() {
	      syntaxStack = {
	          syntax: state.syntax,
	          opts: state.syntax.opts || (syntaxStack !== null && syntaxStack.opts) || null,
	          prev: syntaxStack
	      };

	      matchStack = {
	          type: OPEN_SYNTAX,
	          syntax: state.syntax,
	          token: matchStack.token,
	          prev: matchStack
	      };
	  }

	  function closeSyntax() {
	      if (matchStack.type === OPEN_SYNTAX) {
	          matchStack = matchStack.prev;
	      } else {
	          matchStack = {
	              type: CLOSE_SYNTAX,
	              syntax: syntaxStack.syntax,
	              token: matchStack.token,
	              prev: matchStack
	          };
	      }

	      syntaxStack = syntaxStack.prev;
	  }

	  var syntaxStack = null;
	  var thenStack = null;
	  var elseStack = null;

	  // null – stashing allowed, nothing stashed
	  // false – stashing disabled, nothing stashed
	  // anithing else – fail stashable syntaxes, some syntax stashed
	  var syntaxStash = null;

	  var iterationCount = 0; // count iterations and prevent infinite loop
	  var exitReason = null;

	  var token = null;
	  var tokenIndex = -1;
	  var longestMatch = 0;
	  var matchStack = {
	      type: STUB,
	      syntax: null,
	      token: null,
	      prev: null
	  };

	  moveToNextToken();

	  while (exitReason === null && ++iterationCount < ITERATION_LIMIT) {
	      // function mapList(list, fn) {
	      //     var result = [];
	      //     while (list) {
	      //         result.unshift(fn(list));
	      //         list = list.prev;
	      //     }
	      //     return result;
	      // }
	      // console.log('--\n',
	      //     '#' + iterationCount,
	      //     require('util').inspect({
	      //         match: mapList(matchStack, x => x.type === TOKEN ? x.token && x.token.value : x.syntax ? ({ [OPEN_SYNTAX]: '<', [CLOSE_SYNTAX]: '</' }[x.type] || x.type) + '!' + x.syntax.name : null),
	      //         token: token && token.value,
	      //         tokenIndex,
	      //         syntax: syntax.type + (syntax.id ? ' #' + syntax.id : '')
	      //     }, { depth: null })
	      // );
	      switch (state.type) {
	          case 'Match':
	              if (thenStack === null) {
	                  // turn to MISMATCH when some tokens left unmatched
	                  if (token !== null) {
	                      // doesn't mismatch if just one token left and it's an IE hack
	                      if (tokenIndex !== tokens.length - 1 || (token.value !== '\\0' && token.value !== '\\9')) {
	                          state = MISMATCH$1;
	                          break;
	                      }
	                  }

	                  // break the main loop, return a result - MATCH
	                  exitReason = EXIT_REASON_MATCH;
	                  break;
	              }

	              // go to next syntax (`then` branch)
	              state = thenStack.nextState;

	              // check match is not empty
	              if (state === DISALLOW_EMPTY$1) {
	                  if (thenStack.matchStack === matchStack) {
	                      state = MISMATCH$1;
	                      break;
	                  } else {
	                      state = MATCH$1;
	                  }
	              }

	              // close syntax if needed
	              while (thenStack.syntaxStack !== syntaxStack) {
	                  closeSyntax();
	              }

	              // pop stack
	              thenStack = thenStack.prev;
	              break;

	          case 'Mismatch':
	              // when some syntax is stashed
	              if (syntaxStash !== null && syntaxStash !== false) {
	                  // there is no else branches or a branch reduce match stack
	                  if (elseStack === null || tokenIndex > elseStack.tokenIndex) {
	                      // restore state from the stash
	                      elseStack = syntaxStash;
	                      syntaxStash = false; // disable stashing
	                  }
	              } else if (elseStack === null) {
	                  // no else branches -> break the main loop
	                  // return a result - MISMATCH
	                  exitReason = EXIT_REASON_MISMATCH;
	                  break;
	              }

	              // go to next syntax (`else` branch)
	              state = elseStack.nextState;

	              // restore all the rest stack states
	              thenStack = elseStack.thenStack;
	              syntaxStack = elseStack.syntaxStack;
	              matchStack = elseStack.matchStack;
	              tokenIndex = elseStack.tokenIndex;
	              token = tokenIndex < tokens.length ? tokens[tokenIndex] : null;

	              // pop stack
	              elseStack = elseStack.prev;
	              break;

	          case 'MatchGraph':
	              state = state.match;
	              break;

	          case 'If':
	              // IMPORTANT: else stack push must go first,
	              // since it stores the state of thenStack before changes
	              if (state.else !== MISMATCH$1) {
	                  pushElseStack(state.else);
	              }

	              if (state.then !== MATCH$1) {
	                  pushThenStack(state.then);
	              }

	              state = state.match;
	              break;

	          case 'MatchOnce':
	              state = {
	                  type: 'MatchOnceBuffer',
	                  syntax: state,
	                  index: 0,
	                  mask: 0
	              };
	              break;

	          case 'MatchOnceBuffer':
	              var terms = state.syntax.terms;

	              if (state.index === terms.length) {
	                  // no matches at all or it's required all terms to be matched
	                  if (state.mask === 0 || state.syntax.all) {
	                      state = MISMATCH$1;
	                      break;
	                  }

	                  // a partial match is ok
	                  state = MATCH$1;
	                  break;
	              }

	              // all terms are matched
	              if (state.mask === (1 << terms.length) - 1) {
	                  state = MATCH$1;
	                  break;
	              }

	              for (; state.index < terms.length; state.index++) {
	                  var matchFlag = 1 << state.index;

	                  if ((state.mask & matchFlag) === 0) {
	                      // IMPORTANT: else stack push must go first,
	                      // since it stores the state of thenStack before changes
	                      pushElseStack(state);
	                      pushThenStack({
	                          type: 'AddMatchOnce',
	                          syntax: state.syntax,
	                          mask: state.mask | matchFlag
	                      });

	                      // match
	                      state = terms[state.index++];
	                      break;
	                  }
	              }
	              break;

	          case 'AddMatchOnce':
	              state = {
	                  type: 'MatchOnceBuffer',
	                  syntax: state.syntax,
	                  index: 0,
	                  mask: state.mask
	              };
	              break;

	          case 'Enum':
	              if (token !== null) {
	                  var name = token.value.toLowerCase();

	                  // drop \0 and \9 hack from keyword name
	                  if (name.indexOf('\\') !== -1) {
	                      name = name.replace(/\\[09].*$/, '');
	                  }

	                  if (hasOwnProperty$1.call(state.map, name)) {
	                      state = state.map[name];
	                      break;
	                  }
	              }

	              state = MISMATCH$1;
	              break;

	          case 'Generic':
	              var opts = syntaxStack !== null ? syntaxStack.opts : null;
	              var lastTokenIndex = tokenIndex + Math.floor(state.fn(token, getNextToken, opts));

	              if (!isNaN(lastTokenIndex) && lastTokenIndex > tokenIndex) {
	                  while (tokenIndex < lastTokenIndex) {
	                      addTokenToMatch();
	                  }

	                  state = MATCH$1;
	              } else {
	                  state = MISMATCH$1;
	              }

	              break;

	          case 'Type':
	          case 'Property':
	              var syntaxDict = state.type === 'Type' ? 'types' : 'properties';
	              var dictSyntax = hasOwnProperty$1.call(syntaxes, syntaxDict) ? syntaxes[syntaxDict][state.name] : null;

	              if (!dictSyntax || !dictSyntax.match) {
	                  throw new Error(
	                      'Bad syntax reference: ' +
	                      (state.type === 'Type'
	                          ? '<' + state.name + '>'
	                          : '<\'' + state.name + '\'>')
	                  );
	              }

	              // stash a syntax for types with low priority
	              if (syntaxStash !== false && token !== null && state.type === 'Type') {
	                  var lowPriorityMatching =
	                      // https://drafts.csswg.org/css-values-4/#custom-idents
	                      // When parsing positionally-ambiguous keywords in a property value, a <custom-ident> production
	                      // can only claim the keyword if no other unfulfilled production can claim it.
	                      (state.name === 'custom-ident' && token.type === TYPE$6.Ident) ||

	                      // https://drafts.csswg.org/css-values-4/#lengths
	                      // ... if a `0` could be parsed as either a <number> or a <length> in a property (such as line-height),
	                      // it must parse as a <number>
	                      (state.name === 'length' && token.value === '0');

	                  if (lowPriorityMatching) {
	                      if (syntaxStash === null) {
	                          syntaxStash = stateSnapshotFromSyntax(state, elseStack);
	                      }

	                      state = MISMATCH$1;
	                      break;
	                  }
	              }

	              openSyntax();
	              state = dictSyntax.match;
	              break;

	          case 'Keyword':
	              var name = state.name;

	              if (token !== null) {
	                  var keywordName = token.value;

	                  // drop \0 and \9 hack from keyword name
	                  if (keywordName.indexOf('\\') !== -1) {
	                      keywordName = keywordName.replace(/\\[09].*$/, '');
	                  }

	                  if (areStringsEqualCaseInsensitive(keywordName, name)) {
	                      addTokenToMatch();
	                      state = MATCH$1;
	                      break;
	                  }
	              }

	              state = MISMATCH$1;
	              break;

	          case 'AtKeyword':
	          case 'Function':
	              if (token !== null && areStringsEqualCaseInsensitive(token.value, state.name)) {
	                  addTokenToMatch();
	                  state = MATCH$1;
	                  break;
	              }

	              state = MISMATCH$1;
	              break;

	          case 'Token':
	              if (token !== null && token.value === state.value) {
	                  addTokenToMatch();
	                  state = MATCH$1;
	                  break;
	              }

	              state = MISMATCH$1;
	              break;

	          case 'Comma':
	              if (token !== null && token.type === TYPE$6.Comma) {
	                  if (isCommaContextStart(matchStack.token)) {
	                      state = MISMATCH$1;
	                  } else {
	                      addTokenToMatch();
	                      state = isCommaContextEnd(token) ? MISMATCH$1 : MATCH$1;
	                  }
	              } else {
	                  state = isCommaContextStart(matchStack.token) || isCommaContextEnd(token) ? MATCH$1 : MISMATCH$1;
	              }

	              break;

	          case 'String':
	              var string = '';

	              for (var lastTokenIndex = tokenIndex; lastTokenIndex < tokens.length && string.length < state.value.length; lastTokenIndex++) {
	                  string += tokens[lastTokenIndex].value;
	              }

	              if (areStringsEqualCaseInsensitive(string, state.value)) {
	                  while (tokenIndex < lastTokenIndex) {
	                      addTokenToMatch();
	                  }

	                  state = MATCH$1;
	              } else {
	                  state = MISMATCH$1;
	              }

	              break;

	          default:
	              throw new Error('Unknown node type: ' + state.type);
	      }
	  }

	  totalIterationCount += iterationCount;

	  switch (exitReason) {
	      case null:
	          console.warn('[csstree-match] BREAK after ' + ITERATION_LIMIT + ' iterations');
	          exitReason = EXIT_REASON_ITERATION_LIMIT;
	          matchStack = null;
	          break;

	      case EXIT_REASON_MATCH:
	          while (syntaxStack !== null) {
	              closeSyntax();
	          }
	          break;

	      default:
	          matchStack = null;
	  }

	  return {
	      tokens: tokens,
	      reason: exitReason,
	      iterations: iterationCount,
	      match: matchStack,
	      longestMatch: longestMatch
	  };
	}

	function matchAsList(tokens, matchGraph, syntaxes) {
	  var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});

	  if (matchResult.match !== null) {
	      var item = reverseList(matchResult.match).prev;

	      matchResult.match = [];

	      while (item !== null) {
	          switch (item.type) {
	              case STUB:
	                  break;

	              case OPEN_SYNTAX:
	              case CLOSE_SYNTAX:
	                  matchResult.match.push({
	                      type: item.type,
	                      syntax: item.syntax
	                  });
	                  break;

	              default:
	                  matchResult.match.push({
	                      token: item.token.value,
	                      node: item.token.node
	                  });
	                  break;
	          }

	          item = item.prev;
	      }
	  }

	  return matchResult;
	}

	function matchAsTree(tokens, matchGraph, syntaxes) {
	  var matchResult = internalMatch(tokens, matchGraph, syntaxes || {});

	  if (matchResult.match === null) {
	      return matchResult;
	  }

	  var item = matchResult.match;
	  var host = matchResult.match = {
	      syntax: matchGraph.syntax || null,
	      match: []
	  };
	  var hostStack = [host];

	  // revert a list and start with 2nd item since 1st is a stub item
	  item = reverseList(item).prev;

	  // build a tree
	  while (item !== null) {
	      switch (item.type) {
	          case OPEN_SYNTAX:
	              host.match.push(host = {
	                  syntax: item.syntax,
	                  match: []
	              });
	              hostStack.push(host);
	              break;

	          case CLOSE_SYNTAX:
	              hostStack.pop();
	              host = hostStack[hostStack.length - 1];
	              break;

	          default:
	              host.match.push({
	                  syntax: item.syntax || null,
	                  token: item.token.value,
	                  node: item.token.node
	              });
	      }

	      item = item.prev;
	  }

	  return matchResult;
	}

	var match = {
	  matchAsList: matchAsList,
	  matchAsTree: matchAsTree,
	  getTotalIterationCount: function() {
	      return totalIterationCount;
	  }
	};

	function getTrace(node) {
	  function shouldPutToTrace(syntax) {
	      if (syntax === null) {
	          return false;
	      }

	      return (
	          syntax.type === 'Type' ||
	          syntax.type === 'Property' ||
	          syntax.type === 'Keyword'
	      );
	  }

	  function hasMatch(matchNode) {
	      if (Array.isArray(matchNode.match)) {
	          // use for-loop for better perfomance
	          for (var i = 0; i < matchNode.match.length; i++) {
	              if (hasMatch(matchNode.match[i])) {
	                  if (shouldPutToTrace(matchNode.syntax)) {
	                      result.unshift(matchNode.syntax);
	                  }

	                  return true;
	              }
	          }
	      } else if (matchNode.node === node) {
	          result = shouldPutToTrace(matchNode.syntax)
	              ? [matchNode.syntax]
	              : [];

	          return true;
	      }

	      return false;
	  }

	  var result = null;

	  if (this.matched !== null) {
	      hasMatch(this.matched);
	  }

	  return result;
	}

	function testNode(match, node, fn) {
	  var trace = getTrace.call(match, node);

	  if (trace === null) {
	      return false;
	  }

	  return trace.some(fn);
	}

	function isType(node, type) {
	  return testNode(this, node, function(matchNode) {
	      return matchNode.type === 'Type' && matchNode.name === type;
	  });
	}

	function isProperty(node, property) {
	  return testNode(this, node, function(matchNode) {
	      return matchNode.type === 'Property' && matchNode.name === property;
	  });
	}

	function isKeyword(node) {
	  return testNode(this, node, function(matchNode) {
	      return matchNode.type === 'Keyword';
	  });
	}

	var trace = {
	  getTrace: getTrace,
	  isType: isType,
	  isProperty: isProperty,
	  isKeyword: isKeyword
	};

	function getFirstMatchNode(matchNode) {
	  if ('node' in matchNode) {
	      return matchNode.node;
	  }

	  return getFirstMatchNode(matchNode.match[0]);
	}

	function getLastMatchNode(matchNode) {
	  if ('node' in matchNode) {
	      return matchNode.node;
	  }

	  return getLastMatchNode(matchNode.match[matchNode.match.length - 1]);
	}

	function matchFragments(lexer, ast, match, type, name) {
	  function findFragments(matchNode) {
	      if (matchNode.syntax !== null &&
	          matchNode.syntax.type === type &&
	          matchNode.syntax.name === name) {
	          var start = getFirstMatchNode(matchNode);
	          var end = getLastMatchNode(matchNode);

	          lexer.syntax.walk(ast, function(node, item, list) {
	              if (node === start) {
	                  var nodes = new List_1();

	                  do {
	                      nodes.appendData(item.data);

	                      if (item.data === end) {
	                          break;
	                      }

	                      item = item.next;
	                  } while (item !== null);

	                  fragments.push({
	                      parent: list,
	                      nodes: nodes
	                  });
	              }
	          });
	      }

	      if (Array.isArray(matchNode.match)) {
	          matchNode.match.forEach(findFragments);
	      }
	  }

	  var fragments = [];

	  if (match.matched !== null) {
	      findFragments(match.matched);
	  }

	  return fragments;
	}

	var search = {
	  matchFragments: matchFragments
	};

	var hasOwnProperty$2 = Object.prototype.hasOwnProperty;

	function isValidNumber(value) {
	  // Number.isInteger(value) && value >= 0
	  return (
	      typeof value === 'number' &&
	      isFinite(value) &&
	      Math.floor(value) === value &&
	      value >= 0
	  );
	}

	function isValidLocation(loc) {
	  return (
	      Boolean(loc) &&
	      isValidNumber(loc.offset) &&
	      isValidNumber(loc.line) &&
	      isValidNumber(loc.column)
	  );
	}

	function createNodeStructureChecker(type, fields) {
	  return function checkNode(node, warn) {
	      if (!node || node.constructor !== Object) {
	          return warn(node, 'Type of node should be an Object');
	      }

	      for (var key in node) {
	          var valid = true;

	          if (hasOwnProperty$2.call(node, key) === false) {
	              continue;
	          }

	          if (key === 'type') {
	              if (node.type !== type) {
	                  warn(node, 'Wrong node type `' + node.type + '`, expected `' + type + '`');
	              }
	          } else if (key === 'loc') {
	              if (node.loc === null) {
	                  continue;
	              } else if (node.loc && node.loc.constructor === Object) {
	                  if (typeof node.loc.source !== 'string') {
	                      key += '.source';
	                  } else if (!isValidLocation(node.loc.start)) {
	                      key += '.start';
	                  } else if (!isValidLocation(node.loc.end)) {
	                      key += '.end';
	                  } else {
	                      continue;
	                  }
	              }

	              valid = false;
	          } else if (fields.hasOwnProperty(key)) {
	              for (var i = 0, valid = false; !valid && i < fields[key].length; i++) {
	                  var fieldType = fields[key][i];

	                  switch (fieldType) {
	                      case String:
	                          valid = typeof node[key] === 'string';
	                          break;

	                      case Boolean:
	                          valid = typeof node[key] === 'boolean';
	                          break;

	                      case null:
	                          valid = node[key] === null;
	                          break;

	                      default:
	                          if (typeof fieldType === 'string') {
	                              valid = node[key] && node[key].type === fieldType;
	                          } else if (Array.isArray(fieldType)) {
	                              valid = node[key] instanceof List_1;
	                          }
	                  }
	              }
	          } else {
	              warn(node, 'Unknown field `' + key + '` for ' + type + ' node type');
	          }

	          if (!valid) {
	              warn(node, 'Bad value for `' + type + '.' + key + '`');
	          }
	      }

	      for (var key in fields) {
	          if (hasOwnProperty$2.call(fields, key) &&
	              hasOwnProperty$2.call(node, key) === false) {
	              warn(node, 'Field `' + type + '.' + key + '` is missed');
	          }
	      }
	  };
	}

	function processStructure(name, nodeType) {
	  var structure = nodeType.structure;
	  var fields = {
	      type: String,
	      loc: true
	  };
	  var docs = {
	      type: '"' + name + '"'
	  };

	  for (var key in structure) {
	      if (hasOwnProperty$2.call(structure, key) === false) {
	          continue;
	      }

	      var docsTypes = [];
	      var fieldTypes = fields[key] = Array.isArray(structure[key])
	          ? structure[key].slice()
	          : [structure[key]];

	      for (var i = 0; i < fieldTypes.length; i++) {
	          var fieldType = fieldTypes[i];
	          if (fieldType === String || fieldType === Boolean) {
	              docsTypes.push(fieldType.name);
	          } else if (fieldType === null) {
	              docsTypes.push('null');
	          } else if (typeof fieldType === 'string') {
	              docsTypes.push('<' + fieldType + '>');
	          } else if (Array.isArray(fieldType)) {
	              docsTypes.push('List'); // TODO: use type enum
	          } else {
	              throw new Error('Wrong value `' + fieldType + '` in `' + name + '.' + key + '` structure definition');
	          }
	      }

	      docs[key] = docsTypes.join(' | ');
	  }

	  return {
	      docs: docs,
	      check: createNodeStructureChecker(name, fields)
	  };
	}

	var structure = {
	  getStructureFromConfig: function(config) {
	      var structure = {};

	      if (config.node) {
	          for (var name in config.node) {
	              if (hasOwnProperty$2.call(config.node, name)) {
	                  var nodeType = config.node[name];

	                  if (nodeType.structure) {
	                      structure[name] = processStructure(name, nodeType);
	                  } else {
	                      throw new Error('Missed `structure` field in `' + name + '` node type definition');
	                  }
	              }
	          }
	      }

	      return structure;
	  }
	};

	var SyntaxReferenceError$1 = error.SyntaxReferenceError;
	var SyntaxMatchError$1 = error.SyntaxMatchError;






	var buildMatchGraph$1 = matchGraph.buildMatchGraph;
	var matchAsTree$1 = match.matchAsTree;


	var getStructureFromConfig = structure.getStructureFromConfig;
	var cssWideKeywords$1 = buildMatchGraph$1('inherit | initial | unset');
	var cssWideKeywordsWithExpression = buildMatchGraph$1('inherit | initial | unset | <-ms-legacy-expression>');

	function dumpMapSyntax(map, compact, syntaxAsAst) {
	  var result = {};

	  for (var name in map) {
	      if (map[name].syntax) {
	          result[name] = syntaxAsAst
	              ? map[name].syntax
	              : generate_1(map[name].syntax, { compact: compact });
	      }
	  }

	  return result;
	}

	function dumpAtruleMapSyntax(map, compact, syntaxAsAst) {
	  const result = {};

	  for (const [name, atrule] of Object.entries(map)) {
	      result[name] = {
	          prelude: atrule.prelude && (
	              syntaxAsAst
	                  ? atrule.prelude.syntax
	                  : generate_1(atrule.prelude.syntax, { compact })
	          ),
	          descriptors: atrule.descriptors && dumpMapSyntax(atrule.descriptors, compact, syntaxAsAst)
	      };
	  }

	  return result;
	}

	function valueHasVar(tokens) {
	  for (var i = 0; i < tokens.length; i++) {
	      if (tokens[i].value.toLowerCase() === 'var(') {
	          return true;
	      }
	  }

	  return false;
	}

	function buildMatchResult(match, error, iterations) {
	  return {
	      matched: match,
	      iterations: iterations,
	      error: error,
	      getTrace: trace.getTrace,
	      isType: trace.isType,
	      isProperty: trace.isProperty,
	      isKeyword: trace.isKeyword
	  };
	}

	function matchSyntax(lexer, syntax, value, useCommon) {
	  var tokens = prepareTokens_1(value, lexer.syntax);
	  var result;

	  if (valueHasVar(tokens)) {
	      return buildMatchResult(null, new Error('Matching for a tree with var() is not supported'));
	  }

	  if (useCommon) {
	      result = matchAsTree$1(tokens, lexer.valueCommonSyntax, lexer);
	  }

	  if (!useCommon || !result.match) {
	      result = matchAsTree$1(tokens, syntax.match, lexer);
	      if (!result.match) {
	          return buildMatchResult(
	              null,
	              new SyntaxMatchError$1(result.reason, syntax.syntax, value, result),
	              result.iterations
	          );
	      }
	  }

	  return buildMatchResult(result.match, null, result.iterations);
	}

	var Lexer = function(config, syntax, structure) {
	  this.valueCommonSyntax = cssWideKeywords$1;
	  this.syntax = syntax;
	  this.generic = false;
	  this.atrules = {};
	  this.properties = {};
	  this.types = {};
	  this.structure = structure || getStructureFromConfig(config);

	  if (config) {
	      if (config.types) {
	          for (var name in config.types) {
	              this.addType_(name, config.types[name]);
	          }
	      }

	      if (config.generic) {
	          this.generic = true;
	          for (var name in generic) {
	              this.addType_(name, generic[name]);
	          }
	      }

	      if (config.atrules) {
	          for (var name in config.atrules) {
	              this.addAtrule_(name, config.atrules[name]);
	          }
	      }

	      if (config.properties) {
	          for (var name in config.properties) {
	              this.addProperty_(name, config.properties[name]);
	          }
	      }
	  }
	};

	Lexer.prototype = {
	  structure: {},
	  checkStructure: function(ast) {
	      function collectWarning(node, message) {
	          warns.push({
	              node: node,
	              message: message
	          });
	      }

	      var structure = this.structure;
	      var warns = [];

	      this.syntax.walk(ast, function(node) {
	          if (structure.hasOwnProperty(node.type)) {
	              structure[node.type].check(node, collectWarning);
	          } else {
	              collectWarning(node, 'Unknown node type `' + node.type + '`');
	          }
	      });

	      return warns.length ? warns : false;
	  },

	  createDescriptor: function(syntax, type, name, parent = null) {
	      var ref = {
	          type: type,
	          name: name
	      };
	      var descriptor = {
	          type: type,
	          name: name,
	          parent: parent,
	          syntax: null,
	          match: null
	      };

	      if (typeof syntax === 'function') {
	          descriptor.match = buildMatchGraph$1(syntax, ref);
	      } else {
	          if (typeof syntax === 'string') {
	              // lazy parsing on first access
	              Object.defineProperty(descriptor, 'syntax', {
	                  get: function() {
	                      Object.defineProperty(descriptor, 'syntax', {
	                          value: parse_1(syntax)
	                      });

	                      return descriptor.syntax;
	                  }
	              });
	          } else {
	              descriptor.syntax = syntax;
	          }

	          // lazy graph build on first access
	          Object.defineProperty(descriptor, 'match', {
	              get: function() {
	                  Object.defineProperty(descriptor, 'match', {
	                      value: buildMatchGraph$1(descriptor.syntax, ref)
	                  });

	                  return descriptor.match;
	              }
	          });
	      }

	      return descriptor;
	  },
	  addAtrule_: function(name, syntax) {
	      if (!syntax) {
	          return;
	      }

	      this.atrules[name] = {
	          type: 'Atrule',
	          name: name,
	          prelude: syntax.prelude ? this.createDescriptor(syntax.prelude, 'AtrulePrelude', name) : null,
	          descriptors: syntax.descriptors
	              ? Object.keys(syntax.descriptors).reduce((res, descName) => {
	                  res[descName] = this.createDescriptor(syntax.descriptors[descName], 'AtruleDescriptor', descName, name);
	                  return res;
	              }, {})
	              : null
	      };
	  },
	  addProperty_: function(name, syntax) {
	      if (!syntax) {
	          return;
	      }

	      this.properties[name] = this.createDescriptor(syntax, 'Property', name);
	  },
	  addType_: function(name, syntax) {
	      if (!syntax) {
	          return;
	      }

	      this.types[name] = this.createDescriptor(syntax, 'Type', name);

	      if (syntax === generic['-ms-legacy-expression']) {
	          this.valueCommonSyntax = cssWideKeywordsWithExpression;
	      }
	  },

	  checkAtruleName: function(atruleName) {
	      if (!this.getAtrule(atruleName)) {
	          return new SyntaxReferenceError$1('Unknown at-rule', '@' + atruleName);
	      }
	  },
	  checkAtrulePrelude: function(atruleName, prelude) {
	      let error = this.checkAtruleName(atruleName);

	      if (error) {
	          return error;
	      }

	      var atrule = this.getAtrule(atruleName);

	      if (!atrule.prelude && prelude) {
	          return new SyntaxError('At-rule `@' + atruleName + '` should not contain a prelude');
	      }

	      if (atrule.prelude && !prelude) {
	          return new SyntaxError('At-rule `@' + atruleName + '` should contain a prelude');
	      }
	  },
	  checkAtruleDescriptorName: function(atruleName, descriptorName) {
	      let error = this.checkAtruleName(atruleName);

	      if (error) {
	          return error;
	      }

	      var atrule = this.getAtrule(atruleName);
	      var descriptor = names.keyword(descriptorName);

	      if (!atrule.descriptors) {
	          return new SyntaxError('At-rule `@' + atruleName + '` has no known descriptors');
	      }

	      if (!atrule.descriptors[descriptor.name] &&
	          !atrule.descriptors[descriptor.basename]) {
	          return new SyntaxReferenceError$1('Unknown at-rule descriptor', descriptorName);
	      }
	  },
	  checkPropertyName: function(propertyName) {
	      var property = names.property(propertyName);

	      // don't match syntax for a custom property
	      if (property.custom) {
	          return new Error('Lexer matching doesn\'t applicable for custom properties');
	      }

	      if (!this.getProperty(propertyName)) {
	          return new SyntaxReferenceError$1('Unknown property', propertyName);
	      }
	  },

	  matchAtrulePrelude: function(atruleName, prelude) {
	      var error = this.checkAtrulePrelude(atruleName, prelude);

	      if (error) {
	          return buildMatchResult(null, error);
	      }

	      if (!prelude) {
	          return buildMatchResult(null, null);
	      }

	      return matchSyntax(this, this.getAtrule(atruleName).prelude, prelude, false);
	  },
	  matchAtruleDescriptor: function(atruleName, descriptorName, value) {
	      var error = this.checkAtruleDescriptorName(atruleName, descriptorName);

	      if (error) {
	          return buildMatchResult(null, error);
	      }

	      var atrule = this.getAtrule(atruleName);
	      var descriptor = names.keyword(descriptorName);

	      return matchSyntax(this, atrule.descriptors[descriptor.name] || atrule.descriptors[descriptor.basename], value, false);
	  },
	  matchDeclaration: function(node) {
	      if (node.type !== 'Declaration') {
	          return buildMatchResult(null, new Error('Not a Declaration node'));
	      }

	      return this.matchProperty(node.property, node.value);
	  },
	  matchProperty: function(propertyName, value) {
	      var error = this.checkPropertyName(propertyName);

	      if (error) {
	          return buildMatchResult(null, error);
	      }

	      return matchSyntax(this, this.getProperty(propertyName), value, true);
	  },
	  matchType: function(typeName, value) {
	      var typeSyntax = this.getType(typeName);

	      if (!typeSyntax) {
	          return buildMatchResult(null, new SyntaxReferenceError$1('Unknown type', typeName));
	      }

	      return matchSyntax(this, typeSyntax, value, false);
	  },
	  match: function(syntax, value) {
	      if (typeof syntax !== 'string' && (!syntax || !syntax.type)) {
	          return buildMatchResult(null, new SyntaxReferenceError$1('Bad syntax'));
	      }

	      if (typeof syntax === 'string' || !syntax.match) {
	          syntax = this.createDescriptor(syntax, 'Type', 'anonymous');
	      }

	      return matchSyntax(this, syntax, value, false);
	  },

	  findValueFragments: function(propertyName, value, type, name) {
	      return search.matchFragments(this, value, this.matchProperty(propertyName, value), type, name);
	  },
	  findDeclarationValueFragments: function(declaration, type, name) {
	      return search.matchFragments(this, declaration.value, this.matchDeclaration(declaration), type, name);
	  },
	  findAllFragments: function(ast, type, name) {
	      var result = [];

	      this.syntax.walk(ast, {
	          visit: 'Declaration',
	          enter: function(declaration) {
	              result.push.apply(result, this.findDeclarationValueFragments(declaration, type, name));
	          }.bind(this)
	      });

	      return result;
	  },

	  getAtrule: function(atruleName, fallbackBasename = true) {
	      var atrule = names.keyword(atruleName);
	      var atruleEntry = atrule.vendor && fallbackBasename
	          ? this.atrules[atrule.name] || this.atrules[atrule.basename]
	          : this.atrules[atrule.name];

	      return atruleEntry || null;
	  },
	  getAtrulePrelude: function(atruleName, fallbackBasename = true) {
	      const atrule = this.getAtrule(atruleName, fallbackBasename);

	      return atrule && atrule.prelude || null;
	  },
	  getAtruleDescriptor: function(atruleName, name) {
	      return this.atrules.hasOwnProperty(atruleName) && this.atrules.declarators
	          ? this.atrules[atruleName].declarators[name] || null
	          : null;
	  },
	  getProperty: function(propertyName, fallbackBasename = true) {
	      var property = names.property(propertyName);
	      var propertyEntry = property.vendor && fallbackBasename
	          ? this.properties[property.name] || this.properties[property.basename]
	          : this.properties[property.name];

	      return propertyEntry || null;
	  },
	  getType: function(name) {
	      return this.types.hasOwnProperty(name) ? this.types[name] : null;
	  },

	  validate: function() {
	      function validate(syntax, name, broken, descriptor) {
	          if (broken.hasOwnProperty(name)) {
	              return broken[name];
	          }

	          broken[name] = false;
	          if (descriptor.syntax !== null) {
	              walk(descriptor.syntax, function(node) {
	                  if (node.type !== 'Type' && node.type !== 'Property') {
	                      return;
	                  }

	                  var map = node.type === 'Type' ? syntax.types : syntax.properties;
	                  var brokenMap = node.type === 'Type' ? brokenTypes : brokenProperties;

	                  if (!map.hasOwnProperty(node.name) || validate(syntax, node.name, brokenMap, map[node.name])) {
	                      broken[name] = true;
	                  }
	              }, this);
	          }
	      }

	      var brokenTypes = {};
	      var brokenProperties = {};

	      for (var key in this.types) {
	          validate(this, key, brokenTypes, this.types[key]);
	      }

	      for (var key in this.properties) {
	          validate(this, key, brokenProperties, this.properties[key]);
	      }

	      brokenTypes = Object.keys(brokenTypes).filter(function(name) {
	          return brokenTypes[name];
	      });
	      brokenProperties = Object.keys(brokenProperties).filter(function(name) {
	          return brokenProperties[name];
	      });

	      if (brokenTypes.length || brokenProperties.length) {
	          return {
	              types: brokenTypes,
	              properties: brokenProperties
	          };
	      }

	      return null;
	  },
	  dump: function(syntaxAsAst, pretty) {
	      return {
	          generic: this.generic,
	          types: dumpMapSyntax(this.types, !pretty, syntaxAsAst),
	          properties: dumpMapSyntax(this.properties, !pretty, syntaxAsAst),
	          atrules: dumpAtruleMapSyntax(this.atrules, !pretty, syntaxAsAst)
	      };
	  },
	  toString: function() {
	      return JSON.stringify(this.dump());
	  }
	};

	var Lexer_1 = Lexer;

	var definitionSyntax = {
	  SyntaxError: _SyntaxError$1,
	  parse: parse_1,
	  generate: generate_1,
	  walk: walk
	};

	var isBOM$2 = tokenizer.isBOM;

	var N$3 = 10;
	var F$2 = 12;
	var R$2 = 13;

	function computeLinesAndColumns(host, source) {
	  var sourceLength = source.length;
	  var lines = adoptBuffer(host.lines, sourceLength); // +1
	  var line = host.startLine;
	  var columns = adoptBuffer(host.columns, sourceLength);
	  var column = host.startColumn;
	  var startOffset = source.length > 0 ? isBOM$2(source.charCodeAt(0)) : 0;

	  for (var i = startOffset; i < sourceLength; i++) { // -1
	      var code = source.charCodeAt(i);

	      lines[i] = line;
	      columns[i] = column++;

	      if (code === N$3 || code === R$2 || code === F$2) {
	          if (code === R$2 && i + 1 < sourceLength && source.charCodeAt(i + 1) === N$3) {
	              i++;
	              lines[i] = line;
	              columns[i] = column;
	          }

	          line++;
	          column = 1;
	      }
	  }

	  lines[i] = line;
	  columns[i] = column;

	  host.lines = lines;
	  host.columns = columns;
	}

	var OffsetToLocation = function() {
	  this.lines = null;
	  this.columns = null;
	  this.linesAndColumnsComputed = false;
	};

	OffsetToLocation.prototype = {
	  setSource: function(source, startOffset, startLine, startColumn) {
	      this.source = source;
	      this.startOffset = typeof startOffset === 'undefined' ? 0 : startOffset;
	      this.startLine = typeof startLine === 'undefined' ? 1 : startLine;
	      this.startColumn = typeof startColumn === 'undefined' ? 1 : startColumn;
	      this.linesAndColumnsComputed = false;
	  },

	  ensureLinesAndColumnsComputed: function() {
	      if (!this.linesAndColumnsComputed) {
	          computeLinesAndColumns(this, this.source);
	          this.linesAndColumnsComputed = true;
	      }
	  },
	  getLocation: function(offset, filename) {
	      this.ensureLinesAndColumnsComputed();

	      return {
	          source: filename,
	          offset: this.startOffset + offset,
	          line: this.lines[offset],
	          column: this.columns[offset]
	      };
	  },
	  getLocationRange: function(start, end, filename) {
	      this.ensureLinesAndColumnsComputed();

	      return {
	          source: filename,
	          start: {
	              offset: this.startOffset + start,
	              line: this.lines[start],
	              column: this.columns[start]
	          },
	          end: {
	              offset: this.startOffset + end,
	              line: this.lines[end],
	              column: this.columns[end]
	          }
	      };
	  }
	};

	var OffsetToLocation_1 = OffsetToLocation;

	var TYPE$7 = tokenizer.TYPE;
	var WHITESPACE$2 = TYPE$7.WhiteSpace;
	var COMMENT$2 = TYPE$7.Comment;

	var sequence = function readSequence(recognizer) {
	  var children = this.createList();
	  var child = null;
	  var context = {
	      recognizer: recognizer,
	      space: null,
	      ignoreWS: false,
	      ignoreWSAfter: false
	  };

	  this.scanner.skipSC();

	  while (!this.scanner.eof) {
	      switch (this.scanner.tokenType) {
	          case COMMENT$2:
	              this.scanner.next();
	              continue;

	          case WHITESPACE$2:
	              if (context.ignoreWS) {
	                  this.scanner.next();
	              } else {
	                  context.space = this.WhiteSpace();
	              }
	              continue;
	      }

	      child = recognizer.getNode.call(this, context);

	      if (child === undefined) {
	          break;
	      }

	      if (context.space !== null) {
	          children.push(context.space);
	          context.space = null;
	      }

	      children.push(child);

	      if (context.ignoreWSAfter) {
	          context.ignoreWSAfter = false;
	          context.ignoreWS = true;
	      } else {
	          context.ignoreWS = false;
	      }
	  }

	  return children;
	};

	var { findWhiteSpaceStart: findWhiteSpaceStart$1, cmpStr: cmpStr$4 } = utils$1;

	var noop$2 = function() {};

	var TYPE$8 = _const.TYPE;
	var NAME$2 = _const.NAME;
	var WHITESPACE$3 = TYPE$8.WhiteSpace;
	var COMMENT$3 = TYPE$8.Comment;
	var IDENT$2 = TYPE$8.Ident;
	var FUNCTION = TYPE$8.Function;
	var URL$1 = TYPE$8.Url;
	var HASH = TYPE$8.Hash;
	var PERCENTAGE = TYPE$8.Percentage;
	var NUMBER$2 = TYPE$8.Number;
	var NUMBERSIGN$1 = 0x0023; // U+0023 NUMBER SIGN (#)
	var NULL = 0;

	function createParseContext(name) {
	  return function() {
	      return this[name]();
	  };
	}

	function processConfig(config) {
	  var parserConfig = {
	      context: {},
	      scope: {},
	      atrule: {},
	      pseudo: {}
	  };

	  if (config.parseContext) {
	      for (var name in config.parseContext) {
	          switch (typeof config.parseContext[name]) {
	              case 'function':
	                  parserConfig.context[name] = config.parseContext[name];
	                  break;

	              case 'string':
	                  parserConfig.context[name] = createParseContext(config.parseContext[name]);
	                  break;
	          }
	      }
	  }

	  if (config.scope) {
	      for (var name in config.scope) {
	          parserConfig.scope[name] = config.scope[name];
	      }
	  }

	  if (config.atrule) {
	      for (var name in config.atrule) {
	          var atrule = config.atrule[name];

	          if (atrule.parse) {
	              parserConfig.atrule[name] = atrule.parse;
	          }
	      }
	  }

	  if (config.pseudo) {
	      for (var name in config.pseudo) {
	          var pseudo = config.pseudo[name];

	          if (pseudo.parse) {
	              parserConfig.pseudo[name] = pseudo.parse;
	          }
	      }
	  }

	  if (config.node) {
	      for (var name in config.node) {
	          parserConfig[name] = config.node[name].parse;
	      }
	  }

	  return parserConfig;
	}

	var create = function createParser(config) {
	  var parser = {
	      scanner: new TokenStream_1(),
	      locationMap: new OffsetToLocation_1(),

	      filename: '<unknown>',
	      needPositions: false,
	      onParseError: noop$2,
	      onParseErrorThrow: false,
	      parseAtrulePrelude: true,
	      parseRulePrelude: true,
	      parseValue: true,
	      parseCustomProperty: false,

	      readSequence: sequence,

	      createList: function() {
	          return new List_1();
	      },
	      createSingleNodeList: function(node) {
	          return new List_1().appendData(node);
	      },
	      getFirstListNode: function(list) {
	          return list && list.first();
	      },
	      getLastListNode: function(list) {
	          return list.last();
	      },

	      parseWithFallback: function(consumer, fallback) {
	          var startToken = this.scanner.tokenIndex;

	          try {
	              return consumer.call(this);
	          } catch (e) {
	              if (this.onParseErrorThrow) {
	                  throw e;
	              }

	              var fallbackNode = fallback.call(this, startToken);

	              this.onParseErrorThrow = true;
	              this.onParseError(e, fallbackNode);
	              this.onParseErrorThrow = false;

	              return fallbackNode;
	          }
	      },

	      lookupNonWSType: function(offset) {
	          do {
	              var type = this.scanner.lookupType(offset++);
	              if (type !== WHITESPACE$3) {
	                  return type;
	              }
	          } while (type !== NULL);

	          return NULL;
	      },

	      eat: function(tokenType) {
	          if (this.scanner.tokenType !== tokenType) {
	              var offset = this.scanner.tokenStart;
	              var message = NAME$2[tokenType] + ' is expected';

	              // tweak message and offset
	              switch (tokenType) {
	                  case IDENT$2:
	                      // when identifier is expected but there is a function or url
	                      if (this.scanner.tokenType === FUNCTION || this.scanner.tokenType === URL$1) {
	                          offset = this.scanner.tokenEnd - 1;
	                          message = 'Identifier is expected but function found';
	                      } else {
	                          message = 'Identifier is expected';
	                      }
	                      break;

	                  case HASH:
	                      if (this.scanner.isDelim(NUMBERSIGN$1)) {
	                          this.scanner.next();
	                          offset++;
	                          message = 'Name is expected';
	                      }
	                      break;

	                  case PERCENTAGE:
	                      if (this.scanner.tokenType === NUMBER$2) {
	                          offset = this.scanner.tokenEnd;
	                          message = 'Percent sign is expected';
	                      }
	                      break;

	                  default:
	                      // when test type is part of another token show error for current position + 1
	                      // e.g. eat(HYPHENMINUS) will fail on "-foo", but pointing on "-" is odd
	                      if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === tokenType) {
	                          offset = offset + 1;
	                      }
	              }

	              this.error(message, offset);
	          }

	          this.scanner.next();
	      },

	      consume: function(tokenType) {
	          var value = this.scanner.getTokenValue();

	          this.eat(tokenType);

	          return value;
	      },
	      consumeFunctionName: function() {
	          var name = this.scanner.source.substring(this.scanner.tokenStart, this.scanner.tokenEnd - 1);

	          this.eat(FUNCTION);

	          return name;
	      },

	      getLocation: function(start, end) {
	          if (this.needPositions) {
	              return this.locationMap.getLocationRange(
	                  start,
	                  end,
	                  this.filename
	              );
	          }

	          return null;
	      },
	      getLocationFromList: function(list) {
	          if (this.needPositions) {
	              var head = this.getFirstListNode(list);
	              var tail = this.getLastListNode(list);
	              return this.locationMap.getLocationRange(
	                  head !== null ? head.loc.start.offset - this.locationMap.startOffset : this.scanner.tokenStart,
	                  tail !== null ? tail.loc.end.offset - this.locationMap.startOffset : this.scanner.tokenStart,
	                  this.filename
	              );
	          }

	          return null;
	      },

	      error: function(message, offset) {
	          var location = typeof offset !== 'undefined' && offset < this.scanner.source.length
	              ? this.locationMap.getLocation(offset)
	              : this.scanner.eof
	                  ? this.locationMap.getLocation(findWhiteSpaceStart$1(this.scanner.source, this.scanner.source.length - 1))
	                  : this.locationMap.getLocation(this.scanner.tokenStart);

	          throw new _SyntaxError(
	              message || 'Unexpected input',
	              this.scanner.source,
	              location.offset,
	              location.line,
	              location.column
	          );
	      }
	  };

	  config = processConfig(config || {});
	  for (var key in config) {
	      parser[key] = config[key];
	  }

	  return function(source, options) {
	      options = options || {};

	      var context = options.context || 'default';
	      var onComment = options.onComment;
	      var ast;

	      tokenizer(source, parser.scanner);
	      parser.locationMap.setSource(
	          source,
	          options.offset,
	          options.line,
	          options.column
	      );

	      parser.filename = options.filename || '<unknown>';
	      parser.needPositions = Boolean(options.positions);
	      parser.onParseError = typeof options.onParseError === 'function' ? options.onParseError : noop$2;
	      parser.onParseErrorThrow = false;
	      parser.parseAtrulePrelude = 'parseAtrulePrelude' in options ? Boolean(options.parseAtrulePrelude) : true;
	      parser.parseRulePrelude = 'parseRulePrelude' in options ? Boolean(options.parseRulePrelude) : true;
	      parser.parseValue = 'parseValue' in options ? Boolean(options.parseValue) : true;
	      parser.parseCustomProperty = 'parseCustomProperty' in options ? Boolean(options.parseCustomProperty) : false;

	      if (!parser.context.hasOwnProperty(context)) {
	          throw new Error('Unknown context `' + context + '`');
	      }

	      if (typeof onComment === 'function') {
	          parser.scanner.forEachToken((type, start, end) => {
	              if (type === COMMENT$3) {
	                  const loc = parser.getLocation(start, end);
	                  const value = cmpStr$4(source, end - 2, end, '*/')
	                      ? source.slice(start + 2, end - 2)
	                      : source.slice(start + 2, end);

	                  onComment(value, loc);
	              }
	          });
	      }

	      ast = parser.context[context].call(parser, options);

	      if (!parser.scanner.eof) {
	          parser.error();
	      }

	      return ast;
	  };
	};

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	* Copyright 2011 Mozilla Foundation and contributors
	* Licensed under the New BSD license. See LICENSE or:
	* http://opensource.org/licenses/BSD-3-Clause
	*/

	var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

	/**
	* Encode an integer in the range of 0 to 63 to a single base 64 digit.
	*/
	var encode = function (number) {
	if (0 <= number && number < intToCharMap.length) {
	  return intToCharMap[number];
	}
	throw new TypeError("Must be between 0 and 63: " + number);
	};

	/**
	* Decode a single base 64 character code digit to an integer. Returns -1 on
	* failure.
	*/
	var decode = function (charCode) {
	var bigA = 65;     // 'A'
	var bigZ = 90;     // 'Z'

	var littleA = 97;  // 'a'
	var littleZ = 122; // 'z'

	var zero = 48;     // '0'
	var nine = 57;     // '9'

	var plus = 43;     // '+'
	var slash = 47;    // '/'

	var littleOffset = 26;
	var numberOffset = 52;

	// 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	if (bigA <= charCode && charCode <= bigZ) {
	  return (charCode - bigA);
	}

	// 26 - 51: abcdefghijklmnopqrstuvwxyz
	if (littleA <= charCode && charCode <= littleZ) {
	  return (charCode - littleA + littleOffset);
	}

	// 52 - 61: 0123456789
	if (zero <= charCode && charCode <= nine) {
	  return (charCode - zero + numberOffset);
	}

	// 62: +
	if (charCode == plus) {
	  return 62;
	}

	// 63: /
	if (charCode == slash) {
	  return 63;
	}

	// Invalid base64 digit.
	return -1;
	};

	var base64 = {
	encode: encode,
	decode: decode
	};

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	* Copyright 2011 Mozilla Foundation and contributors
	* Licensed under the New BSD license. See LICENSE or:
	* http://opensource.org/licenses/BSD-3-Clause
	*
	* Based on the Base 64 VLQ implementation in Closure Compiler:
	* https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	*
	* Copyright 2011 The Closure Compiler Authors. All rights reserved.
	* Redistribution and use in source and binary forms, with or without
	* modification, are permitted provided that the following conditions are
	* met:
	*
	*  * Redistributions of source code must retain the above copyright
	*    notice, this list of conditions and the following disclaimer.
	*  * Redistributions in binary form must reproduce the above
	*    copyright notice, this list of conditions and the following
	*    disclaimer in the documentation and/or other materials provided
	*    with the distribution.
	*  * Neither the name of Google Inc. nor the names of its
	*    contributors may be used to endorse or promote products derived
	*    from this software without specific prior written permission.
	*
	* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	* "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	* LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	* A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	* OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	* SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	* LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	* DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	* THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	* OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/



	// A single base 64 digit can contain 6 bits of data. For the base 64 variable
	// length quantities we use in the source map spec, the first bit is the sign,
	// the next four bits are the actual value, and the 6th bit is the
	// continuation bit. The continuation bit tells us whether there are more
	// digits in this value following this digit.
	//
	//   Continuation
	//   |    Sign
	//   |    |
	//   V    V
	//   101011

	var VLQ_BASE_SHIFT = 5;

	// binary: 100000
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	// binary: 011111
	var VLQ_BASE_MASK = VLQ_BASE - 1;

	// binary: 100000
	var VLQ_CONTINUATION_BIT = VLQ_BASE;

	/**
	* Converts from a two-complement value to a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	*   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	*/
	function toVLQSigned(aValue) {
	return aValue < 0
	  ? ((-aValue) << 1) + 1
	  : (aValue << 1) + 0;
	}

	/**
	* Converts to a two-complement value from a value where the sign bit is
	* placed in the least significant bit.  For example, as decimals:
	*   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	*   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	*/
	function fromVLQSigned(aValue) {
	var isNegative = (aValue & 1) === 1;
	var shifted = aValue >> 1;
	return isNegative
	  ? -shifted
	  : shifted;
	}

	/**
	* Returns the base 64 VLQ encoded value.
	*/
	var encode$1 = function base64VLQ_encode(aValue) {
	var encoded = "";
	var digit;

	var vlq = toVLQSigned(aValue);

	do {
	  digit = vlq & VLQ_BASE_MASK;
	  vlq >>>= VLQ_BASE_SHIFT;
	  if (vlq > 0) {
	    // There are still more digits in this value, so we must make sure the
	    // continuation bit is marked.
	    digit |= VLQ_CONTINUATION_BIT;
	  }
	  encoded += base64.encode(digit);
	} while (vlq > 0);

	return encoded;
	};

	/**
	* Decodes the next base 64 VLQ value from the given string and returns the
	* value and the rest of the string via the out parameter.
	*/
	var decode$1 = function base64VLQ_decode(aStr, aIndex, aOutParam) {
	var strLen = aStr.length;
	var result = 0;
	var shift = 0;
	var continuation, digit;

	do {
	  if (aIndex >= strLen) {
	    throw new Error("Expected more digits in base 64 VLQ value.");
	  }

	  digit = base64.decode(aStr.charCodeAt(aIndex++));
	  if (digit === -1) {
	    throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
	  }

	  continuation = !!(digit & VLQ_CONTINUATION_BIT);
	  digit &= VLQ_BASE_MASK;
	  result = result + (digit << shift);
	  shift += VLQ_BASE_SHIFT;
	} while (continuation);

	aOutParam.value = fromVLQSigned(result);
	aOutParam.rest = aIndex;
	};

	var base64Vlq = {
	encode: encode$1,
	decode: decode$1
	};

	function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
	}

	var util$1 = createCommonjsModule(function (module, exports) {
	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	* Copyright 2011 Mozilla Foundation and contributors
	* Licensed under the New BSD license. See LICENSE or:
	* http://opensource.org/licenses/BSD-3-Clause
	*/

	/**
	* This is a helper function for getting values from parameter/options
	* objects.
	*
	* @param args The object we are extracting values from
	* @param name The name of the property we are getting.
	* @param defaultValue An optional value to return if the property is missing
	* from the object. If this is not specified and the property is missing, an
	* error will be thrown.
	*/
	function getArg(aArgs, aName, aDefaultValue) {
	if (aName in aArgs) {
	  return aArgs[aName];
	} else if (arguments.length === 3) {
	  return aDefaultValue;
	} else {
	  throw new Error('"' + aName + '" is a required argument.');
	}
	}
	exports.getArg = getArg;

	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;

	function urlParse(aUrl) {
	var match = aUrl.match(urlRegexp);
	if (!match) {
	  return null;
	}
	return {
	  scheme: match[1],
	  auth: match[2],
	  host: match[3],
	  port: match[4],
	  path: match[5]
	};
	}
	exports.urlParse = urlParse;

	function urlGenerate(aParsedUrl) {
	var url = '';
	if (aParsedUrl.scheme) {
	  url += aParsedUrl.scheme + ':';
	}
	url += '//';
	if (aParsedUrl.auth) {
	  url += aParsedUrl.auth + '@';
	}
	if (aParsedUrl.host) {
	  url += aParsedUrl.host;
	}
	if (aParsedUrl.port) {
	  url += ":" + aParsedUrl.port;
	}
	if (aParsedUrl.path) {
	  url += aParsedUrl.path;
	}
	return url;
	}
	exports.urlGenerate = urlGenerate;

	/**
	* Normalizes a path, or the path portion of a URL:
	*
	* - Replaces consecutive slashes with one slash.
	* - Removes unnecessary '.' parts.
	* - Removes unnecessary '<dir>/..' parts.
	*
	* Based on code in the Node.js 'path' core module.
	*
	* @param aPath The path or url to normalize.
	*/
	function normalize(aPath) {
	var path = aPath;
	var url = urlParse(aPath);
	if (url) {
	  if (!url.path) {
	    return aPath;
	  }
	  path = url.path;
	}
	var isAbsolute = exports.isAbsolute(path);

	var parts = path.split(/\/+/);
	for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	  part = parts[i];
	  if (part === '.') {
	    parts.splice(i, 1);
	  } else if (part === '..') {
	    up++;
	  } else if (up > 0) {
	    if (part === '') {
	      // The first part is blank if the path is absolute. Trying to go
	      // above the root is a no-op. Therefore we can remove all '..' parts
	      // directly after the root.
	      parts.splice(i + 1, up);
	      up = 0;
	    } else {
	      parts.splice(i, 2);
	      up--;
	    }
	  }
	}
	path = parts.join('/');

	if (path === '') {
	  path = isAbsolute ? '/' : '.';
	}

	if (url) {
	  url.path = path;
	  return urlGenerate(url);
	}
	return path;
	}
	exports.normalize = normalize;

	/**
	* Joins two paths/URLs.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be joined with the root.
	*
	* - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	*   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	*   first.
	* - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	*   is updated with the result and aRoot is returned. Otherwise the result
	*   is returned.
	*   - If aPath is absolute, the result is aPath.
	*   - Otherwise the two paths are joined with a slash.
	* - Joining for example 'http://' and 'www.example.com' is also supported.
	*/
	function join(aRoot, aPath) {
	if (aRoot === "") {
	  aRoot = ".";
	}
	if (aPath === "") {
	  aPath = ".";
	}
	var aPathUrl = urlParse(aPath);
	var aRootUrl = urlParse(aRoot);
	if (aRootUrl) {
	  aRoot = aRootUrl.path || '/';
	}

	// `join(foo, '//www.example.org')`
	if (aPathUrl && !aPathUrl.scheme) {
	  if (aRootUrl) {
	    aPathUrl.scheme = aRootUrl.scheme;
	  }
	  return urlGenerate(aPathUrl);
	}

	if (aPathUrl || aPath.match(dataUrlRegexp)) {
	  return aPath;
	}

	// `join('http://', 'www.example.com')`
	if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	  aRootUrl.host = aPath;
	  return urlGenerate(aRootUrl);
	}

	var joined = aPath.charAt(0) === '/'
	  ? aPath
	  : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

	if (aRootUrl) {
	  aRootUrl.path = joined;
	  return urlGenerate(aRootUrl);
	}
	return joined;
	}
	exports.join = join;

	exports.isAbsolute = function (aPath) {
	return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
	};

	/**
	* Make a path relative to a URL or another path.
	*
	* @param aRoot The root path or URL.
	* @param aPath The path or URL to be made relative to aRoot.
	*/
	function relative(aRoot, aPath) {
	if (aRoot === "") {
	  aRoot = ".";
	}

	aRoot = aRoot.replace(/\/$/, '');

	// It is possible for the path to be above the root. In this case, simply
	// checking whether the root is a prefix of the path won't work. Instead, we
	// need to remove components from the root one by one, until either we find
	// a prefix that fits, or we run out of components to remove.
	var level = 0;
	while (aPath.indexOf(aRoot + '/') !== 0) {
	  var index = aRoot.lastIndexOf("/");
	  if (index < 0) {
	    return aPath;
	  }

	  // If the only part of the root that is left is the scheme (i.e. http://,
	  // file:///, etc.), one or more slashes (/), or simply nothing at all, we
	  // have exhausted all components, so the path is not relative to the root.
	  aRoot = aRoot.slice(0, index);
	  if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
	    return aPath;
	  }

	  ++level;
	}

	// Make sure we add a "../" for each component we removed from the root.
	return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;

	var supportsNullProto = (function () {
	var obj = Object.create(null);
	return !('__proto__' in obj);
	}());

	function identity (s) {
	return s;
	}

	/**
	* Because behavior goes wacky when you set `__proto__` on objects, we
	* have to prefix all the strings in our set with an arbitrary character.
	*
	* See https://github.com/mozilla/source-map/pull/31 and
	* https://github.com/mozilla/source-map/issues/30
	*
	* @param String aStr
	*/
	function toSetString(aStr) {
	if (isProtoString(aStr)) {
	  return '$' + aStr;
	}

	return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;

	function fromSetString(aStr) {
	if (isProtoString(aStr)) {
	  return aStr.slice(1);
	}

	return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;

	function isProtoString(s) {
	if (!s) {
	  return false;
	}

	var length = s.length;

	if (length < 9 /* "__proto__".length */) {
	  return false;
	}

	if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
	    s.charCodeAt(length - 2) !== 95  /* '_' */ ||
	    s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
	    s.charCodeAt(length - 4) !== 116 /* 't' */ ||
	    s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
	    s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
	    s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
	    s.charCodeAt(length - 8) !== 95  /* '_' */ ||
	    s.charCodeAt(length - 9) !== 95  /* '_' */) {
	  return false;
	}

	for (var i = length - 10; i >= 0; i--) {
	  if (s.charCodeAt(i) !== 36 /* '$' */) {
	    return false;
	  }
	}

	return true;
	}

	/**
	* Comparator between two mappings where the original positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same original source/line/column, but different generated
	* line and column the same. Useful when searching for a mapping with a
	* stubbed out mapping.
	*/
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	var cmp = strcmp(mappingA.source, mappingB.source);
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.originalLine - mappingB.originalLine;
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.originalColumn - mappingB.originalColumn;
	if (cmp !== 0 || onlyCompareOriginal) {
	  return cmp;
	}

	cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.generatedLine - mappingB.generatedLine;
	if (cmp !== 0) {
	  return cmp;
	}

	return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;

	/**
	* Comparator between two mappings with deflated source and name indices where
	* the generated positions are compared.
	*
	* Optionally pass in `true` as `onlyCompareGenerated` to consider two
	* mappings with the same generated line and column, but different
	* source/name/original line and column the same. Useful when searching for a
	* mapping with a stubbed out mapping.
	*/
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	var cmp = mappingA.generatedLine - mappingB.generatedLine;
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	if (cmp !== 0 || onlyCompareGenerated) {
	  return cmp;
	}

	cmp = strcmp(mappingA.source, mappingB.source);
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.originalLine - mappingB.originalLine;
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.originalColumn - mappingB.originalColumn;
	if (cmp !== 0) {
	  return cmp;
	}

	return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

	function strcmp(aStr1, aStr2) {
	if (aStr1 === aStr2) {
	  return 0;
	}

	if (aStr1 === null) {
	  return 1; // aStr2 !== null
	}

	if (aStr2 === null) {
	  return -1; // aStr1 !== null
	}

	if (aStr1 > aStr2) {
	  return 1;
	}

	return -1;
	}

	/**
	* Comparator between two mappings with inflated source and name strings where
	* the generated positions are compared.
	*/
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	var cmp = mappingA.generatedLine - mappingB.generatedLine;
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = strcmp(mappingA.source, mappingB.source);
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.originalLine - mappingB.originalLine;
	if (cmp !== 0) {
	  return cmp;
	}

	cmp = mappingA.originalColumn - mappingB.originalColumn;
	if (cmp !== 0) {
	  return cmp;
	}

	return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

	/**
	* Strip any JSON XSSI avoidance prefix from the string (as documented
	* in the source maps specification), and then parse the string as
	* JSON.
	*/
	function parseSourceMapInput(str) {
	return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;

	/**
	* Compute the URL of a source given the the source root, the source's
	* URL, and the source map's URL.
	*/
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	sourceURL = sourceURL || '';

	if (sourceRoot) {
	  // This follows what Chrome does.
	  if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	    sourceRoot += '/';
	  }
	  // The spec says:
	  //   Line 4: An optional source root, useful for relocating source
	  //   files on a server or removing repeated values in the
	  //   “sources” entry.  This value is prepended to the individual
	  //   entries in the “source” field.
	  sourceURL = sourceRoot + sourceURL;
	}

	// Historically, SourceMapConsumer did not take the sourceMapURL as
	// a parameter.  This mode is still somewhat supported, which is why
	// this code block is conditional.  However, it's preferable to pass
	// the source map URL to SourceMapConsumer, so that this function
	// can implement the source URL resolution algorithm as outlined in
	// the spec.  This block is basically the equivalent of:
	//    new URL(sourceURL, sourceMapURL).toString()
	// ... except it avoids using URL, which wasn't available in the
	// older releases of node still supported by this library.
	//
	// The spec says:
	//   If the sources are not absolute URLs after prepending of the
	//   “sourceRoot”, the sources are resolved relative to the
	//   SourceMap (like resolving script src in a html document).
	if (sourceMapURL) {
	  var parsed = urlParse(sourceMapURL);
	  if (!parsed) {
	    throw new Error("sourceMapURL could not be parsed");
	  }
	  if (parsed.path) {
	    // Strip the last path component, but keep the "/".
	    var index = parsed.path.lastIndexOf('/');
	    if (index >= 0) {
	      parsed.path = parsed.path.substring(0, index + 1);
	    }
	  }
	  sourceURL = join(urlGenerate(parsed), sourceURL);
	}

	return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL;
	});
	util$1.getArg;
	util$1.urlParse;
	util$1.urlGenerate;
	util$1.normalize;
	util$1.join;
	util$1.isAbsolute;
	util$1.relative;
	util$1.toSetString;
	util$1.fromSetString;
	util$1.compareByOriginalPositions;
	util$1.compareByGeneratedPositionsDeflated;
	util$1.compareByGeneratedPositionsInflated;
	util$1.parseSourceMapInput;
	util$1.computeSourceURL;

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	* Copyright 2011 Mozilla Foundation and contributors
	* Licensed under the New BSD license. See LICENSE or:
	* http://opensource.org/licenses/BSD-3-Clause
	*/


	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";

	/**
	* A data structure which is a combination of an array and a set. Adding a new
	* member is O(1), testing for membership is O(1), and finding the index of an
	* element is O(1). Removing elements from the set is not supported. Only
	* strings are supported for membership.
	*/
	function ArraySet() {
	this._array = [];
	this._set = hasNativeMap ? new Map() : Object.create(null);
	}

	/**
	* Static method for creating ArraySet instances from an existing array.
	*/
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	var set = new ArraySet();
	for (var i = 0, len = aArray.length; i < len; i++) {
	  set.add(aArray[i], aAllowDuplicates);
	}
	return set;
	};

	/**
	* Return how many unique items are in this ArraySet. If duplicates have been
	* added, than those do not count towards the size.
	*
	* @returns Number
	*/
	ArraySet.prototype.size = function ArraySet_size() {
	return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};

	/**
	* Add the given string to this set.
	*
	* @param String aStr
	*/
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	var sStr = hasNativeMap ? aStr : util$1.toSetString(aStr);
	var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	var idx = this._array.length;
	if (!isDuplicate || aAllowDuplicates) {
	  this._array.push(aStr);
	}
	if (!isDuplicate) {
	  if (hasNativeMap) {
	    this._set.set(aStr, idx);
	  } else {
	    this._set[sStr] = idx;
	  }
	}
	};

	/**
	* Is the given string a member of this set?
	*
	* @param String aStr
	*/
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	if (hasNativeMap) {
	  return this._set.has(aStr);
	} else {
	  var sStr = util$1.toSetString(aStr);
	  return has.call(this._set, sStr);
	}
	};

	/**
	* What is the index of the given string in the array?
	*
	* @param String aStr
	*/
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	if (hasNativeMap) {
	  var idx = this._set.get(aStr);
	  if (idx >= 0) {
	      return idx;
	  }
	} else {
	  var sStr = util$1.toSetString(aStr);
	  if (has.call(this._set, sStr)) {
	    return this._set[sStr];
	  }
	}

	throw new Error('"' + aStr + '" is not in the set.');
	};

	/**
	* What is the element at the given index?
	*
	* @param Number aIdx
	*/
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	if (aIdx >= 0 && aIdx < this._array.length) {
	  return this._array[aIdx];
	}
	throw new Error('No element indexed by ' + aIdx);
	};

	/**
	* Returns the array representation of this set (which has the proper indices
	* indicated by indexOf). Note that this is a copy of the internal array used
	* for storing the members so that no one can mess with internal state.
	*/
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	return this._array.slice();
	};

	var ArraySet_1 = ArraySet;

	var arraySet = {
	ArraySet: ArraySet_1
	};

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	* Copyright 2014 Mozilla Foundation and contributors
	* Licensed under the New BSD license. See LICENSE or:
	* http://opensource.org/licenses/BSD-3-Clause
	*/



	/**
	* Determine whether mappingB is after mappingA with respect to generated
	* position.
	*/
	function generatedPositionAfter(mappingA, mappingB) {
	// Optimized for most common case
	var lineA = mappingA.generatedLine;
	var lineB = mappingB.generatedLine;
	var columnA = mappingA.generatedColumn;
	var columnB = mappingB.generatedColumn;
	return lineB > lineA || lineB == lineA && columnB >= columnA ||
	       util$1.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}

	/**
	* A data structure to provide a sorted view of accumulated mappings in a
	* performance conscious manner. It trades a neglibable overhead in general
	* case for a large speedup in case of mappings being added in order.
	*/
	function MappingList() {
	this._array = [];
	this._sorted = true;
	// Serves as infimum
	this._last = {generatedLine: -1, generatedColumn: 0};
	}

	/**
	* Iterate through internal items. This method takes the same arguments that
	* `Array.prototype.forEach` takes.
	*
	* NOTE: The order of the mappings is NOT guaranteed.
	*/
	MappingList.prototype.unsortedForEach =
	function MappingList_forEach(aCallback, aThisArg) {
	  this._array.forEach(aCallback, aThisArg);
	};

	/**
	* Add the given source mapping.
	*
	* @param Object aMapping
	*/
	MappingList.prototype.add = function MappingList_add(aMapping) {
	if (generatedPositionAfter(this._last, aMapping)) {
	  this._last = aMapping;
	  this._array.push(aMapping);
	} else {
	  this._sorted = false;
	  this._array.push(aMapping);
	}
	};

	/**
	* Returns the flat, sorted array of mappings. The mappings are sorted by
	* generated position.
	*
	* WARNING: This method returns internal data without copying, for
	* performance. The return value must NOT be mutated, and should be treated as
	* an immutable borrow. If you want to take ownership, you must make your own
	* copy.
	*/
	MappingList.prototype.toArray = function MappingList_toArray() {
	if (!this._sorted) {
	  this._array.sort(util$1.compareByGeneratedPositionsInflated);
	  this._sorted = true;
	}
	return this._array;
	};

	var MappingList_1 = MappingList;

	var mappingList = {
	MappingList: MappingList_1
	};

	/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	* Copyright 2011 Mozilla Foundation and contributors
	* Licensed under the New BSD license. See LICENSE or:
	* http://opensource.org/licenses/BSD-3-Clause
	*/



	var ArraySet$1 = arraySet.ArraySet;
	var MappingList$1 = mappingList.MappingList;

	/**
	* An instance of the SourceMapGenerator represents a source map which is
	* being built incrementally. You may pass an object with the following
	* properties:
	*
	*   - file: The filename of the generated source.
	*   - sourceRoot: A root for all relative URLs in this source map.
	*/
	function SourceMapGenerator(aArgs) {
	if (!aArgs) {
	  aArgs = {};
	}
	this._file = util$1.getArg(aArgs, 'file', null);
	this._sourceRoot = util$1.getArg(aArgs, 'sourceRoot', null);
	this._skipValidation = util$1.getArg(aArgs, 'skipValidation', false);
	this._sources = new ArraySet$1();
	this._names = new ArraySet$1();
	this._mappings = new MappingList$1();
	this._sourcesContents = null;
	}

	SourceMapGenerator.prototype._version = 3;

	/**
	* Creates a new SourceMapGenerator based on a SourceMapConsumer
	*
	* @param aSourceMapConsumer The SourceMap.
	*/
	SourceMapGenerator.fromSourceMap =
	function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	  var sourceRoot = aSourceMapConsumer.sourceRoot;
	  var generator = new SourceMapGenerator({
	    file: aSourceMapConsumer.file,
	    sourceRoot: sourceRoot
	  });
	  aSourceMapConsumer.eachMapping(function (mapping) {
	    var newMapping = {
	      generated: {
	        line: mapping.generatedLine,
	        column: mapping.generatedColumn
	      }
	    };

	    if (mapping.source != null) {
	      newMapping.source = mapping.source;
	      if (sourceRoot != null) {
	        newMapping.source = util$1.relative(sourceRoot, newMapping.source);
	      }

	      newMapping.original = {
	        line: mapping.originalLine,
	        column: mapping.originalColumn
	      };

	      if (mapping.name != null) {
	        newMapping.name = mapping.name;
	      }
	    }

	    generator.addMapping(newMapping);
	  });
	  aSourceMapConsumer.sources.forEach(function (sourceFile) {
	    var sourceRelative = sourceFile;
	    if (sourceRoot !== null) {
	      sourceRelative = util$1.relative(sourceRoot, sourceFile);
	    }

	    if (!generator._sources.has(sourceRelative)) {
	      generator._sources.add(sourceRelative);
	    }

	    var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	    if (content != null) {
	      generator.setSourceContent(sourceFile, content);
	    }
	  });
	  return generator;
	};

	/**
	* Add a single mapping from original source line and column to the generated
	* source's line and column for this source map being created. The mapping
	* object should have the following properties:
	*
	*   - generated: An object with the generated line and column positions.
	*   - original: An object with the original line and column positions.
	*   - source: The original source file (relative to the sourceRoot).
	*   - name: An optional original token name for this mapping.
	*/
	SourceMapGenerator.prototype.addMapping =
	function SourceMapGenerator_addMapping(aArgs) {
	  var generated = util$1.getArg(aArgs, 'generated');
	  var original = util$1.getArg(aArgs, 'original', null);
	  var source = util$1.getArg(aArgs, 'source', null);
	  var name = util$1.getArg(aArgs, 'name', null);

	  if (!this._skipValidation) {
	    this._validateMapping(generated, original, source, name);
	  }

	  if (source != null) {
	    source = String(source);
	    if (!this._sources.has(source)) {
	      this._sources.add(source);
	    }
	  }

	  if (name != null) {
	    name = String(name);
	    if (!this._names.has(name)) {
	      this._names.add(name);
	    }
	  }

	  this._mappings.add({
	    generatedLine: generated.line,
	    generatedColumn: generated.column,
	    originalLine: original != null && original.line,
	    originalColumn: original != null && original.column,
	    source: source,
	    name: name
	  });
	};

	/**
	* Set the source content for a source file.
	*/
	SourceMapGenerator.prototype.setSourceContent =
	function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	  var source = aSourceFile;
	  if (this._sourceRoot != null) {
	    source = util$1.relative(this._sourceRoot, source);
	  }

	  if (aSourceContent != null) {
	    // Add the source content to the _sourcesContents map.
	    // Create a new _sourcesContents map if the property is null.
	    if (!this._sourcesContents) {
	      this._sourcesContents = Object.create(null);
	    }
	    this._sourcesContents[util$1.toSetString(source)] = aSourceContent;
	  } else if (this._sourcesContents) {
	    // Remove the source file from the _sourcesContents map.
	    // If the _sourcesContents map is empty, set the property to null.
	    delete this._sourcesContents[util$1.toSetString(source)];
	    if (Object.keys(this._sourcesContents).length === 0) {
	      this._sourcesContents = null;
	    }
	  }
	};

	/**
	* Applies the mappings of a sub-source-map for a specific source file to the
	* source map being generated. Each mapping to the supplied source file is
	* rewritten using the supplied source map. Note: The resolution for the
	* resulting mappings is the minimium of this map and the supplied map.
	*
	* @param aSourceMapConsumer The source map to be applied.
	* @param aSourceFile Optional. The filename of the source file.
	*        If omitted, SourceMapConsumer's file property will be used.
	* @param aSourceMapPath Optional. The dirname of the path to the source map
	*        to be applied. If relative, it is relative to the SourceMapConsumer.
	*        This parameter is needed when the two source maps aren't in the same
	*        directory, and the source map to be applied contains relative source
	*        paths. If so, those relative source paths need to be rewritten
	*        relative to the SourceMapGenerator.
	*/
	SourceMapGenerator.prototype.applySourceMap =
	function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	  var sourceFile = aSourceFile;
	  // If aSourceFile is omitted, we will use the file property of the SourceMap
	  if (aSourceFile == null) {
	    if (aSourceMapConsumer.file == null) {
	      throw new Error(
	        'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	        'or the source map\'s "file" property. Both were omitted.'
	      );
	    }
	    sourceFile = aSourceMapConsumer.file;
	  }
	  var sourceRoot = this._sourceRoot;
	  // Make "sourceFile" relative if an absolute Url is passed.
	  if (sourceRoot != null) {
	    sourceFile = util$1.relative(sourceRoot, sourceFile);
	  }
	  // Applying the SourceMap can add and remove items from the sources and
	  // the names array.
	  var newSources = new ArraySet$1();
	  var newNames = new ArraySet$1();

	  // Find mappings for the "sourceFile"
	  this._mappings.unsortedForEach(function (mapping) {
	    if (mapping.source === sourceFile && mapping.originalLine != null) {
	      // Check if it can be mapped by the source map, then update the mapping.
	      var original = aSourceMapConsumer.originalPositionFor({
	        line: mapping.originalLine,
	        column: mapping.originalColumn
	      });
	      if (original.source != null) {
	        // Copy mapping
	        mapping.source = original.source;
	        if (aSourceMapPath != null) {
	          mapping.source = util$1.join(aSourceMapPath, mapping.source);
	        }
	        if (sourceRoot != null) {
	          mapping.source = util$1.relative(sourceRoot, mapping.source);
	        }
	        mapping.originalLine = original.line;
	        mapping.originalColumn = original.column;
	        if (original.name != null) {
	          mapping.name = original.name;
	        }
	      }
	    }

	    var source = mapping.source;
	    if (source != null && !newSources.has(source)) {
	      newSources.add(source);
	    }

	    var name = mapping.name;
	    if (name != null && !newNames.has(name)) {
	      newNames.add(name);
	    }

	  }, this);
	  this._sources = newSources;
	  this._names = newNames;

	  // Copy sourcesContents of applied map.
	  aSourceMapConsumer.sources.forEach(function (sourceFile) {
	    var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	    if (content != null) {
	      if (aSourceMapPath != null) {
	        sourceFile = util$1.join(aSourceMapPath, sourceFile);
	      }
	      if (sourceRoot != null) {
	        sourceFile = util$1.relative(sourceRoot, sourceFile);
	      }
	      this.setSourceContent(sourceFile, content);
	    }
	  }, this);
	};

	/**
	* A mapping can have one of the three levels of data:
	*
	*   1. Just the generated position.
	*   2. The Generated position, original position, and original source.
	*   3. Generated and original position, original source, as well as a name
	*      token.
	*
	* To maintain consistency, we validate that any new mapping being added falls
	* in to one of these categories.
	*/
	SourceMapGenerator.prototype._validateMapping =
	function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                            aName) {
	  // When aOriginal is truthy but has empty values for .line and .column,
	  // it is most likely a programmer error. In this case we throw a very
	  // specific error message to try to guide them the right way.
	  // For example: https://github.com/Polymer/polymer-bundler/pull/519
	  if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
	      throw new Error(
	          'original.line and original.column are not numbers -- you probably meant to omit ' +
	          'the original mapping entirely and only map the generated position. If so, pass ' +
	          'null for the original mapping instead of an object with empty or null values.'
	      );
	  }

	  if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	      && aGenerated.line > 0 && aGenerated.column >= 0
	      && !aOriginal && !aSource && !aName) {
	    // Case 1.
	    return;
	  }
	  else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	           && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	           && aGenerated.line > 0 && aGenerated.column >= 0
	           && aOriginal.line > 0 && aOriginal.column >= 0
	           && aSource) {
	    // Cases 2 and 3.
	    return;
	  }
	  else {
	    throw new Error('Invalid mapping: ' + JSON.stringify({
	      generated: aGenerated,
	      source: aSource,
	      original: aOriginal,
	      name: aName
	    }));
	  }
	};

	/**
	* Serialize the accumulated mappings in to the stream of base 64 VLQs
	* specified by the source map format.
	*/
	SourceMapGenerator.prototype._serializeMappings =
	function SourceMapGenerator_serializeMappings() {
	  var previousGeneratedColumn = 0;
	  var previousGeneratedLine = 1;
	  var previousOriginalColumn = 0;
	  var previousOriginalLine = 0;
	  var previousName = 0;
	  var previousSource = 0;
	  var result = '';
	  var next;
	  var mapping;
	  var nameIdx;
	  var sourceIdx;

	  var mappings = this._mappings.toArray();
	  for (var i = 0, len = mappings.length; i < len; i++) {
	    mapping = mappings[i];
	    next = '';

	    if (mapping.generatedLine !== previousGeneratedLine) {
	      previousGeneratedColumn = 0;
	      while (mapping.generatedLine !== previousGeneratedLine) {
	        next += ';';
	        previousGeneratedLine++;
	      }
	    }
	    else {
	      if (i > 0) {
	        if (!util$1.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
	          continue;
	        }
	        next += ',';
	      }
	    }

	    next += base64Vlq.encode(mapping.generatedColumn
	                               - previousGeneratedColumn);
	    previousGeneratedColumn = mapping.generatedColumn;

	    if (mapping.source != null) {
	      sourceIdx = this._sources.indexOf(mapping.source);
	      next += base64Vlq.encode(sourceIdx - previousSource);
	      previousSource = sourceIdx;

	      // lines are stored 0-based in SourceMap spec version 3
	      next += base64Vlq.encode(mapping.originalLine - 1
	                                 - previousOriginalLine);
	      previousOriginalLine = mapping.originalLine - 1;

	      next += base64Vlq.encode(mapping.originalColumn
	                                 - previousOriginalColumn);
	      previousOriginalColumn = mapping.originalColumn;

	      if (mapping.name != null) {
	        nameIdx = this._names.indexOf(mapping.name);
	        next += base64Vlq.encode(nameIdx - previousName);
	        previousName = nameIdx;
	      }
	    }

	    result += next;
	  }

	  return result;
	};

	SourceMapGenerator.prototype._generateSourcesContent =
	function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	  return aSources.map(function (source) {
	    if (!this._sourcesContents) {
	      return null;
	    }
	    if (aSourceRoot != null) {
	      source = util$1.relative(aSourceRoot, source);
	    }
	    var key = util$1.toSetString(source);
	    return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
	      ? this._sourcesContents[key]
	      : null;
	  }, this);
	};

	/**
	* Externalize the source map.
	*/
	SourceMapGenerator.prototype.toJSON =
	function SourceMapGenerator_toJSON() {
	  var map = {
	    version: this._version,
	    sources: this._sources.toArray(),
	    names: this._names.toArray(),
	    mappings: this._serializeMappings()
	  };
	  if (this._file != null) {
	    map.file = this._file;
	  }
	  if (this._sourceRoot != null) {
	    map.sourceRoot = this._sourceRoot;
	  }
	  if (this._sourcesContents) {
	    map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	  }

	  return map;
	};

	/**
	* Render the source map being generated to a string.
	*/
	SourceMapGenerator.prototype.toString =
	function SourceMapGenerator_toString() {
	  return JSON.stringify(this.toJSON());
	};

	var SourceMapGenerator_1 = SourceMapGenerator;

	var sourceMapGenerator = {
	SourceMapGenerator: SourceMapGenerator_1
	};

	var SourceMapGenerator$1 = sourceMapGenerator.SourceMapGenerator;
	var trackNodes = {
	  Atrule: true,
	  Selector: true,
	  Declaration: true
	};

	var sourceMap = function generateSourceMap(handlers) {
	  var map = new SourceMapGenerator$1();
	  var line = 1;
	  var column = 0;
	  var generated = {
	      line: 1,
	      column: 0
	  };
	  var original = {
	      line: 0, // should be zero to add first mapping
	      column: 0
	  };
	  var sourceMappingActive = false;
	  var activatedGenerated = {
	      line: 1,
	      column: 0
	  };
	  var activatedMapping = {
	      generated: activatedGenerated
	  };

	  var handlersNode = handlers.node;
	  handlers.node = function(node) {
	      if (node.loc && node.loc.start && trackNodes.hasOwnProperty(node.type)) {
	          var nodeLine = node.loc.start.line;
	          var nodeColumn = node.loc.start.column - 1;

	          if (original.line !== nodeLine ||
	              original.column !== nodeColumn) {
	              original.line = nodeLine;
	              original.column = nodeColumn;

	              generated.line = line;
	              generated.column = column;

	              if (sourceMappingActive) {
	                  sourceMappingActive = false;
	                  if (generated.line !== activatedGenerated.line ||
	                      generated.column !== activatedGenerated.column) {
	                      map.addMapping(activatedMapping);
	                  }
	              }

	              sourceMappingActive = true;
	              map.addMapping({
	                  source: node.loc.source,
	                  original: original,
	                  generated: generated
	              });
	          }
	      }

	      handlersNode.call(this, node);

	      if (sourceMappingActive && trackNodes.hasOwnProperty(node.type)) {
	          activatedGenerated.line = line;
	          activatedGenerated.column = column;
	      }
	  };

	  var handlersChunk = handlers.chunk;
	  handlers.chunk = function(chunk) {
	      for (var i = 0; i < chunk.length; i++) {
	          if (chunk.charCodeAt(i) === 10) { // \n
	              line++;
	              column = 0;
	          } else {
	              column++;
	          }
	      }

	      handlersChunk(chunk);
	  };

	  var handlersResult = handlers.result;
	  handlers.result = function() {
	      if (sourceMappingActive) {
	          map.addMapping(activatedMapping);
	      }

	      return {
	          css: handlersResult(),
	          map: map
	      };
	  };

	  return handlers;
	};

	var hasOwnProperty$3 = Object.prototype.hasOwnProperty;

	function processChildren(node, delimeter) {
	  var list = node.children;
	  var prev = null;

	  if (typeof delimeter !== 'function') {
	      list.forEach(this.node, this);
	  } else {
	      list.forEach(function(node) {
	          if (prev !== null) {
	              delimeter.call(this, prev);
	          }

	          this.node(node);
	          prev = node;
	      }, this);
	  }
	}

	var create$1 = function createGenerator(config) {
	  function processNode(node) {
	      if (hasOwnProperty$3.call(types, node.type)) {
	          types[node.type].call(this, node);
	      } else {
	          throw new Error('Unknown node type: ' + node.type);
	      }
	  }

	  var types = {};

	  if (config.node) {
	      for (var name in config.node) {
	          types[name] = config.node[name].generate;
	      }
	  }

	  return function(node, options) {
	      var buffer = '';
	      var handlers = {
	          children: processChildren,
	          node: processNode,
	          chunk: function(chunk) {
	              buffer += chunk;
	          },
	          result: function() {
	              return buffer;
	          }
	      };

	      if (options) {
	          if (typeof options.decorator === 'function') {
	              handlers = options.decorator(handlers);
	          }

	          if (options.sourceMap) {
	              handlers = sourceMap(handlers);
	          }
	      }

	      handlers.node(node);

	      return handlers.result();
	  };
	};

	var create$2 = function createConvertors(walk) {
	  return {
	      fromPlainObject: function(ast) {
	          walk(ast, {
	              enter: function(node) {
	                  if (node.children && node.children instanceof List_1 === false) {
	                      node.children = new List_1().fromArray(node.children);
	                  }
	              }
	          });

	          return ast;
	      },
	      toPlainObject: function(ast) {
	          walk(ast, {
	              leave: function(node) {
	                  if (node.children && node.children instanceof List_1) {
	                      node.children = node.children.toArray();
	                  }
	              }
	          });

	          return ast;
	      }
	  };
	};

	var hasOwnProperty$4 = Object.prototype.hasOwnProperty;
	var noop$3 = function() {};

	function ensureFunction$1(value) {
	  return typeof value === 'function' ? value : noop$3;
	}

	function invokeForType(fn, type) {
	  return function(node, item, list) {
	      if (node.type === type) {
	          fn.call(this, node, item, list);
	      }
	  };
	}

	function getWalkersFromStructure(name, nodeType) {
	  var structure = nodeType.structure;
	  var walkers = [];

	  for (var key in structure) {
	      if (hasOwnProperty$4.call(structure, key) === false) {
	          continue;
	      }

	      var fieldTypes = structure[key];
	      var walker = {
	          name: key,
	          type: false,
	          nullable: false
	      };

	      if (!Array.isArray(structure[key])) {
	          fieldTypes = [structure[key]];
	      }

	      for (var i = 0; i < fieldTypes.length; i++) {
	          var fieldType = fieldTypes[i];
	          if (fieldType === null) {
	              walker.nullable = true;
	          } else if (typeof fieldType === 'string') {
	              walker.type = 'node';
	          } else if (Array.isArray(fieldType)) {
	              walker.type = 'list';
	          }
	      }

	      if (walker.type) {
	          walkers.push(walker);
	      }
	  }

	  if (walkers.length) {
	      return {
	          context: nodeType.walkContext,
	          fields: walkers
	      };
	  }

	  return null;
	}

	function getTypesFromConfig(config) {
	  var types = {};

	  for (var name in config.node) {
	      if (hasOwnProperty$4.call(config.node, name)) {
	          var nodeType = config.node[name];

	          if (!nodeType.structure) {
	              throw new Error('Missed `structure` field in `' + name + '` node type definition');
	          }

	          types[name] = getWalkersFromStructure(name, nodeType);
	      }
	  }

	  return types;
	}

	function createTypeIterator(config, reverse) {
	  var fields = config.fields.slice();
	  var contextName = config.context;
	  var useContext = typeof contextName === 'string';

	  if (reverse) {
	      fields.reverse();
	  }

	  return function(node, context, walk, walkReducer) {
	      var prevContextValue;

	      if (useContext) {
	          prevContextValue = context[contextName];
	          context[contextName] = node;
	      }

	      for (var i = 0; i < fields.length; i++) {
	          var field = fields[i];
	          var ref = node[field.name];

	          if (!field.nullable || ref) {
	              if (field.type === 'list') {
	                  var breakWalk = reverse
	                      ? ref.reduceRight(walkReducer, false)
	                      : ref.reduce(walkReducer, false);

	                  if (breakWalk) {
	                      return true;
	                  }
	              } else if (walk(ref)) {
	                  return true;
	              }
	          }
	      }

	      if (useContext) {
	          context[contextName] = prevContextValue;
	      }
	  };
	}

	function createFastTraveralMap(iterators) {
	  return {
	      Atrule: {
	          StyleSheet: iterators.StyleSheet,
	          Atrule: iterators.Atrule,
	          Rule: iterators.Rule,
	          Block: iterators.Block
	      },
	      Rule: {
	          StyleSheet: iterators.StyleSheet,
	          Atrule: iterators.Atrule,
	          Rule: iterators.Rule,
	          Block: iterators.Block
	      },
	      Declaration: {
	          StyleSheet: iterators.StyleSheet,
	          Atrule: iterators.Atrule,
	          Rule: iterators.Rule,
	          Block: iterators.Block,
	          DeclarationList: iterators.DeclarationList
	      }
	  };
	}

	var create$3 = function createWalker(config) {
	  var types = getTypesFromConfig(config);
	  var iteratorsNatural = {};
	  var iteratorsReverse = {};
	  var breakWalk = Symbol('break-walk');
	  var skipNode = Symbol('skip-node');

	  for (var name in types) {
	      if (hasOwnProperty$4.call(types, name) && types[name] !== null) {
	          iteratorsNatural[name] = createTypeIterator(types[name], false);
	          iteratorsReverse[name] = createTypeIterator(types[name], true);
	      }
	  }

	  var fastTraversalIteratorsNatural = createFastTraveralMap(iteratorsNatural);
	  var fastTraversalIteratorsReverse = createFastTraveralMap(iteratorsReverse);

	  var walk = function(root, options) {
	      function walkNode(node, item, list) {
	          var enterRet = enter.call(context, node, item, list);

	          if (enterRet === breakWalk) {
	              debugger;
	              return true;
	          }

	          if (enterRet === skipNode) {
	              return false;
	          }

	          if (iterators.hasOwnProperty(node.type)) {
	              if (iterators[node.type](node, context, walkNode, walkReducer)) {
	                  return true;
	              }
	          }

	          if (leave.call(context, node, item, list) === breakWalk) {
	              return true;
	          }

	          return false;
	      }

	      var walkReducer = (ret, data, item, list) => ret || walkNode(data, item, list);
	      var enter = noop$3;
	      var leave = noop$3;
	      var iterators = iteratorsNatural;
	      var context = {
	          break: breakWalk,
	          skip: skipNode,

	          root: root,
	          stylesheet: null,
	          atrule: null,
	          atrulePrelude: null,
	          rule: null,
	          selector: null,
	          block: null,
	          declaration: null,
	          function: null
	      };

	      if (typeof options === 'function') {
	          enter = options;
	      } else if (options) {
	          enter = ensureFunction$1(options.enter);
	          leave = ensureFunction$1(options.leave);

	          if (options.reverse) {
	              iterators = iteratorsReverse;
	          }

	          if (options.visit) {
	              if (fastTraversalIteratorsNatural.hasOwnProperty(options.visit)) {
	                  iterators = options.reverse
	                      ? fastTraversalIteratorsReverse[options.visit]
	                      : fastTraversalIteratorsNatural[options.visit];
	              } else if (!types.hasOwnProperty(options.visit)) {
	                  throw new Error('Bad value `' + options.visit + '` for `visit` option (should be: ' + Object.keys(types).join(', ') + ')');
	              }

	              enter = invokeForType(enter, options.visit);
	              leave = invokeForType(leave, options.visit);
	          }
	      }

	      if (enter === noop$3 && leave === noop$3) {
	          throw new Error('Neither `enter` nor `leave` walker handler is set or both aren\'t a function');
	      }

	      walkNode(root);
	  };

	  walk.break = breakWalk;
	  walk.skip = skipNode;

	  walk.find = function(ast, fn) {
	      var found = null;

	      walk(ast, function(node, item, list) {
	          if (fn.call(this, node, item, list)) {
	              found = node;
	              return breakWalk;
	          }
	      });

	      return found;
	  };

	  walk.findLast = function(ast, fn) {
	      var found = null;

	      walk(ast, {
	          reverse: true,
	          enter: function(node, item, list) {
	              if (fn.call(this, node, item, list)) {
	                  found = node;
	                  return breakWalk;
	              }
	          }
	      });

	      return found;
	  };

	  walk.findAll = function(ast, fn) {
	      var found = [];

	      walk(ast, function(node, item, list) {
	          if (fn.call(this, node, item, list)) {
	              found.push(node);
	          }
	      });

	      return found;
	  };

	  return walk;
	};

	var clone = function clone(node) {
	  var result = {};

	  for (var key in node) {
	      var value = node[key];

	      if (value) {
	          if (Array.isArray(value) || value instanceof List_1) {
	              value = value.map(clone);
	          } else if (value.constructor === Object) {
	              value = clone(value);
	          }
	      }

	      result[key] = value;
	  }

	  return result;
	};

	const hasOwnProperty$5 = Object.prototype.hasOwnProperty;
	const shape = {
	  generic: true,
	  types: appendOrAssign,
	  atrules: {
	      prelude: appendOrAssignOrNull,
	      descriptors: appendOrAssignOrNull
	  },
	  properties: appendOrAssign,
	  parseContext: assign,
	  scope: deepAssign,
	  atrule: ['parse'],
	  pseudo: ['parse'],
	  node: ['name', 'structure', 'parse', 'generate', 'walkContext']
	};

	function isObject(value) {
	  return value && value.constructor === Object;
	}

	function copy(value) {
	  return isObject(value)
	      ? Object.assign({}, value)
	      : value;
	}

	function assign(dest, src) {
	  return Object.assign(dest, src);
	}

	function deepAssign(dest, src) {
	  for (const key in src) {
	      if (hasOwnProperty$5.call(src, key)) {
	          if (isObject(dest[key])) {
	              deepAssign(dest[key], copy(src[key]));
	          } else {
	              dest[key] = copy(src[key]);
	          }
	      }
	  }

	  return dest;
	}

	function append(a, b) {
	  if (typeof b === 'string' && /^\s*\|/.test(b)) {
	      return typeof a === 'string'
	          ? a + b
	          : b.replace(/^\s*\|\s*/, '');
	  }

	  return b || null;
	}

	function appendOrAssign(a, b) {
	  if (typeof b === 'string') {
	      return append(a, b);
	  }

	  const result = Object.assign({}, a);
	  for (let key in b) {
	      if (hasOwnProperty$5.call(b, key)) {
	          result[key] = append(hasOwnProperty$5.call(a, key) ? a[key] : undefined, b[key]);
	      }
	  }

	  return result;
	}

	function appendOrAssignOrNull(a, b) {
	  const result = appendOrAssign(a, b);

	  return !isObject(result) || Object.keys(result).length
	      ? result
	      : null;
	}

	function mix(dest, src, shape) {
	  for (const key in shape) {
	      if (hasOwnProperty$5.call(shape, key) === false) {
	          continue;
	      }

	      if (shape[key] === true) {
	          if (key in src) {
	              if (hasOwnProperty$5.call(src, key)) {
	                  dest[key] = copy(src[key]);
	              }
	          }
	      } else if (shape[key]) {
	          if (typeof shape[key] === 'function') {
	              const fn = shape[key];
	              dest[key] = fn({}, dest[key]);
	              dest[key] = fn(dest[key] || {}, src[key]);
	          } else if (isObject(shape[key])) {
	              const result = {};

	              for (let name in dest[key]) {
	                  result[name] = mix({}, dest[key][name], shape[key]);
	              }

	              for (let name in src[key]) {
	                  result[name] = mix(result[name] || {}, src[key][name], shape[key]);
	              }

	              dest[key] = result;
	          } else if (Array.isArray(shape[key])) {
	              const res = {};
	              const innerShape = shape[key].reduce(function(s, k) {
	                  s[k] = true;
	                  return s;
	              }, {});

	              for (const [name, value] of Object.entries(dest[key] || {})) {
	                  res[name] = {};
	                  if (value) {
	                      mix(res[name], value, innerShape);
	                  }
	              }

	              for (const name in src[key]) {
	                  if (hasOwnProperty$5.call(src[key], name)) {
	                      if (!res[name]) {
	                          res[name] = {};
	                      }

	                      if (src[key] && src[key][name]) {
	                          mix(res[name], src[key][name], innerShape);
	                      }
	                  }
	              }

	              dest[key] = res;
	          }
	      }
	  }
	  return dest;
	}

	var mix_1 = (dest, src) => mix(dest, src, shape);

	function createSyntax(config) {
	  var parse = create(config);
	  var walk = create$3(config);
	  var generate = create$1(config);
	  var convert = create$2(walk);

	  var syntax = {
	      List: List_1,
	      SyntaxError: _SyntaxError,
	      TokenStream: TokenStream_1,
	      Lexer: Lexer_1,

	      vendorPrefix: names.vendorPrefix,
	      keyword: names.keyword,
	      property: names.property,
	      isCustomProperty: names.isCustomProperty,

	      definitionSyntax: definitionSyntax,
	      lexer: null,
	      createLexer: function(config) {
	          return new Lexer_1(config, syntax, syntax.lexer.structure);
	      },

	      tokenize: tokenizer,
	      parse: parse,
	      walk: walk,
	      generate: generate,

	      find: walk.find,
	      findLast: walk.findLast,
	      findAll: walk.findAll,

	      clone: clone,
	      fromPlainObject: convert.fromPlainObject,
	      toPlainObject: convert.toPlainObject,

	      createSyntax: function(config) {
	          return createSyntax(mix_1({}, config));
	      },
	      fork: function(extension) {
	          var base = mix_1({}, config); // copy of config
	          return createSyntax(
	              typeof extension === 'function'
	                  ? extension(base, Object.assign)
	                  : mix_1(base, extension)
	          );
	      }
	  };

	  syntax.lexer = new Lexer_1({
	      generic: true,
	      types: config.types,
	      atrules: config.atrules,
	      properties: config.properties,
	      node: config.node
	  }, syntax);

	  return syntax;
	}
	var create_1 = function(config) {
	  return createSyntax(mix_1({}, config));
	};

	var create$4 = {
	create: create_1
	};

	var data = {
	  "generic": true,
	  "types": {
	      "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large",
	      "alpha-value": "<number>|<percentage>",
	      "angle-percentage": "<angle>|<percentage>",
	      "angular-color-hint": "<angle-percentage>",
	      "angular-color-stop": "<color>&&<color-stop-angle>?",
	      "angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
	      "animateable-feature": "scroll-position|contents|<custom-ident>",
	      "attachment": "scroll|fixed|local",
	      "attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
	      "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
	      "attr-modifier": "i|s",
	      "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
	      "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
	      "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
	      "baseline-position": "[first|last]? baseline",
	      "basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>|<path()>",
	      "bg-image": "none|<image>",
	      "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
	      "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
	      "bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
	      "blur()": "blur( <length> )",
	      "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
	      "box": "border-box|padding-box|content-box",
	      "brightness()": "brightness( <number-percentage> )",
	      "calc()": "calc( <calc-sum> )",
	      "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
	      "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
	      "calc-value": "<number>|<dimension>|<percentage>|( <calc-sum> )",
	      "cf-final-image": "<image>|<color>",
	      "cf-mixing-image": "<percentage>?&&<image>",
	      "circle()": "circle( [<shape-radius>]? [at <position>]? )",
	      "clamp()": "clamp( <calc-sum>#{3} )",
	      "class-selector": "'.' <ident-token>",
	      "clip-source": "<url>",
	      "color": "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hex-color>|<named-color>|currentcolor|<deprecated-system-color>",
	      "color-stop": "<color-stop-length>|<color-stop-angle>",
	      "color-stop-angle": "<angle-percentage>{1,2}",
	      "color-stop-length": "<length-percentage>{1,2}",
	      "color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
	      "combinator": "'>'|'+'|'~'|['||']",
	      "common-lig-values": "[common-ligatures|no-common-ligatures]",
	      "compat-auto": "searchfield|textarea|push-button|slider-horizontal|checkbox|radio|square-button|menulist|listbox|meter|progress-bar|button",
	      "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
	      "compositing-operator": "add|subtract|intersect|exclude",
	      "compound-selector": "[<type-selector>? <subclass-selector>* [<pseudo-element-selector> <pseudo-class-selector>*]*]!",
	      "compound-selector-list": "<compound-selector>#",
	      "complex-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
	      "complex-selector-list": "<complex-selector>#",
	      "conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
	      "contextual-alt-values": "[contextual|no-contextual]",
	      "content-distribution": "space-between|space-around|space-evenly|stretch",
	      "content-list": "[<string>|contents|<image>|<quote>|<target>|<leader()>|<attr()>|counter( <ident> , <'list-style-type'>? )]+",
	      "content-position": "center|start|end|flex-start|flex-end",
	      "content-replacement": "<image>",
	      "contrast()": "contrast( [<number-percentage>] )",
	      "counter()": "counter( <custom-ident> , <counter-style>? )",
	      "counter-style": "<counter-style-name>|symbols( )",
	      "counter-style-name": "<custom-ident>",
	      "counters()": "counters( <custom-ident> , <string> , <counter-style>? )",
	      "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
	      "cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )",
	      "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
	      "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
	      "display-box": "contents|none",
	      "display-inside": "flow|flow-root|table|flex|grid|ruby",
	      "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
	      "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
	      "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
	      "display-outside": "block|inline|run-in",
	      "drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
	      "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
	      "east-asian-width-values": "[full-width|proportional-width]",
	      "element()": "element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )",
	      "ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
	      "ending-shape": "circle|ellipse",
	      "env()": "env( <custom-ident> , <declaration-value>? )",
	      "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
	      "family-name": "<string>|<custom-ident>+",
	      "feature-tag-value": "<string> [<integer>|on|off]?",
	      "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
	      "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
	      "feature-value-block-list": "<feature-value-block>+",
	      "feature-value-declaration": "<custom-ident> : <integer>+ ;",
	      "feature-value-declaration-list": "<feature-value-declaration>",
	      "feature-value-name": "<custom-ident>",
	      "fill-rule": "nonzero|evenodd",
	      "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
	      "filter-function-list": "[<filter-function>|<url>]+",
	      "final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
	      "fit-content()": "fit-content( [<length>|<percentage>] )",
	      "fixed-breadth": "<length-percentage>",
	      "fixed-repeat": "repeat( [<positive-integer>] , [<line-names>? <fixed-size>]+ <line-names>? )",
	      "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
	      "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
	      "font-variant-css21": "[normal|small-caps]",
	      "font-weight-absolute": "normal|bold|<number [1,1000]>",
	      "frequency-percentage": "<frequency>|<percentage>",
	      "general-enclosed": "[<function-token> <any-value> )]|( <ident> <any-value> )",
	      "generic-family": "serif|sans-serif|cursive|fantasy|monospace|-apple-system",
	      "generic-name": "serif|sans-serif|cursive|fantasy|monospace",
	      "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
	      "gradient": "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<-legacy-gradient>",
	      "grayscale()": "grayscale( <number-percentage> )",
	      "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
	      "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
	      "hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
	      "hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
	      "hue": "<number>|<angle>",
	      "hue-rotate()": "hue-rotate( <angle> )",
	      "image": "<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>",
	      "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
	      "image-set()": "image-set( <image-set-option># )",
	      "image-set-option": "[<image>|<string>] <resolution>",
	      "image-src": "<url>|<string>",
	      "image-tags": "ltr|rtl",
	      "inflexible-breadth": "<length>|<percentage>|min-content|max-content|auto",
	      "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
	      "invert()": "invert( <number-percentage> )",
	      "keyframes-name": "<custom-ident>|<string>",
	      "keyframe-block": "<keyframe-selector># { <declaration-list> }",
	      "keyframe-block-list": "<keyframe-block>+",
	      "keyframe-selector": "from|to|<percentage>",
	      "leader()": "leader( <leader-type> )",
	      "leader-type": "dotted|solid|space|<string>",
	      "length-percentage": "<length>|<percentage>",
	      "line-names": "'[' <custom-ident>* ']'",
	      "line-name-list": "[<line-names>|<name-repeat>]+",
	      "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
	      "line-width": "<length>|thin|medium|thick",
	      "linear-color-hint": "<length-percentage>",
	      "linear-color-stop": "<color> <color-stop-length>?",
	      "linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
	      "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
	      "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
	      "mask-reference": "none|<image>|<mask-source>",
	      "mask-source": "<url>",
	      "masking-mode": "alpha|luminance|match-source",
	      "matrix()": "matrix( <number>#{6} )",
	      "matrix3d()": "matrix3d( <number>#{16} )",
	      "max()": "max( <calc-sum># )",
	      "media-and": "<media-in-parens> [and <media-in-parens>]+",
	      "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
	      "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
	      "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
	      "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
	      "media-not": "not <media-in-parens>",
	      "media-or": "<media-in-parens> [or <media-in-parens>]+",
	      "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
	      "media-query-list": "<media-query>#",
	      "media-type": "<ident>",
	      "mf-boolean": "<mf-name>",
	      "mf-name": "<ident>",
	      "mf-plain": "<mf-name> : <mf-value>",
	      "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
	      "mf-value": "<number>|<dimension>|<ident>|<ratio>",
	      "min()": "min( <calc-sum># )",
	      "minmax()": "minmax( [<length>|<percentage>|min-content|max-content|auto] , [<length>|<percentage>|<flex>|min-content|max-content|auto] )",
	      "named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen|<-non-standard-color>",
	      "namespace-prefix": "<ident>",
	      "ns-prefix": "[<ident-token>|'*']? '|'",
	      "number-percentage": "<number>|<percentage>",
	      "numeric-figure-values": "[lining-nums|oldstyle-nums]",
	      "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
	      "numeric-spacing-values": "[proportional-nums|tabular-nums]",
	      "nth": "<an-plus-b>|even|odd",
	      "opacity()": "opacity( [<number-percentage>] )",
	      "overflow-position": "unsafe|safe",
	      "outline-radius": "<length>|<percentage>",
	      "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
	      "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
	      "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
	      "page-selector-list": "[<page-selector>#]?",
	      "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
	      "path()": "path( [<fill-rule> ,]? <string> )",
	      "paint()": "paint( <ident> , <declaration-value>? )",
	      "perspective()": "perspective( <length> )",
	      "polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
	      "position": "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
	      "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
	      "pseudo-element-selector": "':' <pseudo-class-selector>",
	      "pseudo-page": ": [left|right|first|blank]",
	      "quote": "open-quote|close-quote|no-open-quote|no-close-quote",
	      "radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
	      "relative-selector": "<combinator>? <complex-selector>",
	      "relative-selector-list": "<relative-selector>#",
	      "relative-size": "larger|smaller",
	      "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
	      "repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
	      "repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
	      "rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
	      "rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
	      "rotate()": "rotate( [<angle>|<zero>] )",
	      "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
	      "rotateX()": "rotateX( [<angle>|<zero>] )",
	      "rotateY()": "rotateY( [<angle>|<zero>] )",
	      "rotateZ()": "rotateZ( [<angle>|<zero>] )",
	      "saturate()": "saturate( <number-percentage> )",
	      "scale()": "scale( <number> , <number>? )",
	      "scale3d()": "scale3d( <number> , <number> , <number> )",
	      "scaleX()": "scaleX( <number> )",
	      "scaleY()": "scaleY( <number> )",
	      "scaleZ()": "scaleZ( <number> )",
	      "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
	      "shape-radius": "<length-percentage>|closest-side|farthest-side",
	      "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
	      "skewX()": "skewX( [<angle>|<zero>] )",
	      "skewY()": "skewY( [<angle>|<zero>] )",
	      "sepia()": "sepia( <number-percentage> )",
	      "shadow": "inset?&&<length>{2,4}&&<color>?",
	      "shadow-t": "[<length>{2,3}&&<color>?]",
	      "shape": "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
	      "shape-box": "<box>|margin-box",
	      "side-or-corner": "[left|right]||[top|bottom]",
	      "single-animation": "<time>||<timing-function>||<time>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]",
	      "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
	      "single-animation-fill-mode": "none|forwards|backwards|both",
	      "single-animation-iteration-count": "infinite|<number>",
	      "single-animation-play-state": "running|paused",
	      "single-transition": "[none|<single-transition-property>]||<time>||<timing-function>||<time>",
	      "single-transition-property": "all|<custom-ident>",
	      "size": "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
	      "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
	      "step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
	      "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
	      "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
	      "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
	      "supports-feature": "<supports-decl>|<supports-selector-fn>",
	      "supports-decl": "( <declaration> )",
	      "supports-selector-fn": "selector( <complex-selector> )",
	      "symbol": "<string>|<image>|<custom-ident>",
	      "target": "<target-counter()>|<target-counters()>|<target-text()>",
	      "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
	      "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
	      "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
	      "time-percentage": "<time>|<percentage>",
	      "timing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
	      "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
	      "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
	      "track-repeat": "repeat( [<positive-integer>] , [<line-names>? <track-size>]+ <line-names>? )",
	      "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( [<length>|<percentage>] )",
	      "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
	      "transform-list": "<transform-function>+",
	      "translate()": "translate( <length-percentage> , <length-percentage>? )",
	      "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
	      "translateX()": "translateX( <length-percentage> )",
	      "translateY()": "translateY( <length-percentage> )",
	      "translateZ()": "translateZ( <length> )",
	      "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
	      "type-selector": "<wq-name>|<ns-prefix>? '*'",
	      "var()": "var( <custom-property-name> , <declaration-value>? )",
	      "viewport-length": "auto|<length-percentage>",
	      "wq-name": "<ns-prefix>? <ident-token>",
	      "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
	      "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
	      "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
	      "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
	      "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
	      "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
	      "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
	      "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
	      "-legacy-radial-gradient-shape": "circle|ellipse",
	      "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
	      "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
	      "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
	      "-non-standard-overflow": "-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
	      "-non-standard-width": "fill-available|min-intrinsic|intrinsic|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content|-webkit-min-content|-webkit-max-content",
	      "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
	      "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
	      "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
	      "-webkit-gradient-radius": "<length>|<percentage>",
	      "-webkit-gradient-type": "linear|radial",
	      "-webkit-mask-box-repeat": "repeat|stretch|round",
	      "-webkit-mask-clip-style": "border|border-box|padding|padding-box|content|content-box|text",
	      "-ms-filter-function-list": "<-ms-filter-function>+",
	      "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
	      "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
	      "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
	      "-ms-filter": "<string>",
	      "age": "child|young|old",
	      "attr-name": "<wq-name>",
	      "attr-fallback": "<any-value>",
	      "border-radius": "<length-percentage>{1,2}",
	      "bottom": "<length>|auto",
	      "generic-voice": "[<age>? <gender> <integer>?]",
	      "gender": "male|female|neutral",
	      "left": "<length>|auto",
	      "mask-image": "<mask-reference>#",
	      "name-repeat": "repeat( [<positive-integer>|auto-fill] , <line-names>+ )",
	      "paint": "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
	      "page-size": "A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger",
	      "ratio": "<integer> / <integer>",
	      "right": "<length>|auto",
	      "svg-length": "<percentage>|<length>|<number>",
	      "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
	      "top": "<length>|auto",
	      "track-group": "'(' [<string>* <track-minmax> <string>*]+ ')' ['[' <positive-integer> ']']?|<track-minmax>",
	      "track-list-v0": "[<string>* <track-group> <string>*]+|none",
	      "track-minmax": "minmax( <track-breadth> , <track-breadth> )|auto|<track-breadth>|fit-content",
	      "x": "<number>",
	      "y": "<number>",
	      "declaration": "<ident-token> : <declaration-value>? ['!' important]?",
	      "declaration-list": "[<declaration>? ';']* <declaration>?",
	      "url": "url( <string> <url-modifier>* )|<url-token>",
	      "url-modifier": "<ident>|<function-token> <any-value> )",
	      "number-zero-one": "<number [0,1]>",
	      "number-one-or-greater": "<number [1,∞]>",
	      "positive-integer": "<integer [0,∞]>",
	      "-non-standard-display": "-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box"
	  },
	  "properties": {
	      "--*": "<declaration-value>",
	      "-ms-accelerator": "false|true",
	      "-ms-block-progression": "tb|rl|bt|lr",
	      "-ms-content-zoom-chaining": "none|chained",
	      "-ms-content-zooming": "none|zoom",
	      "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
	      "-ms-content-zoom-limit-max": "<percentage>",
	      "-ms-content-zoom-limit-min": "<percentage>",
	      "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
	      "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
	      "-ms-content-zoom-snap-type": "none|proximity|mandatory",
	      "-ms-filter": "<string>",
	      "-ms-flow-from": "[none|<custom-ident>]#",
	      "-ms-flow-into": "[none|<custom-ident>]#",
	      "-ms-grid-columns": "none|<track-list>|<auto-track-list>",
	      "-ms-grid-rows": "none|<track-list>|<auto-track-list>",
	      "-ms-high-contrast-adjust": "auto|none",
	      "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
	      "-ms-hyphenate-limit-lines": "no-limit|<integer>",
	      "-ms-hyphenate-limit-zone": "<percentage>|<length>",
	      "-ms-ime-align": "auto|after",
	      "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
	      "-ms-scrollbar-3dlight-color": "<color>",
	      "-ms-scrollbar-arrow-color": "<color>",
	      "-ms-scrollbar-base-color": "<color>",
	      "-ms-scrollbar-darkshadow-color": "<color>",
	      "-ms-scrollbar-face-color": "<color>",
	      "-ms-scrollbar-highlight-color": "<color>",
	      "-ms-scrollbar-shadow-color": "<color>",
	      "-ms-scrollbar-track-color": "<color>",
	      "-ms-scroll-chaining": "chained|none",
	      "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
	      "-ms-scroll-limit-x-max": "auto|<length>",
	      "-ms-scroll-limit-x-min": "<length>",
	      "-ms-scroll-limit-y-max": "auto|<length>",
	      "-ms-scroll-limit-y-min": "<length>",
	      "-ms-scroll-rails": "none|railed",
	      "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
	      "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
	      "-ms-scroll-snap-type": "none|proximity|mandatory",
	      "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
	      "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
	      "-ms-scroll-translation": "none|vertical-to-horizontal",
	      "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
	      "-ms-touch-select": "grippers|none",
	      "-ms-user-select": "none|element|text",
	      "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
	      "-ms-wrap-margin": "<length>",
	      "-ms-wrap-through": "wrap|none",
	      "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
	      "-moz-binding": "<url>|none",
	      "-moz-border-bottom-colors": "<color>+|none",
	      "-moz-border-left-colors": "<color>+|none",
	      "-moz-border-right-colors": "<color>+|none",
	      "-moz-border-top-colors": "<color>+|none",
	      "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
	      "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
	      "-moz-force-broken-image-icon": "<integer [0,1]>",
	      "-moz-image-region": "<shape>|auto",
	      "-moz-orient": "inline|block|horizontal|vertical",
	      "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
	      "-moz-outline-radius-bottomleft": "<outline-radius>",
	      "-moz-outline-radius-bottomright": "<outline-radius>",
	      "-moz-outline-radius-topleft": "<outline-radius>",
	      "-moz-outline-radius-topright": "<outline-radius>",
	      "-moz-stack-sizing": "ignore|stretch-to-fit",
	      "-moz-text-blink": "none|blink",
	      "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
	      "-moz-user-input": "auto|none|enabled|disabled",
	      "-moz-user-modify": "read-only|read-write|write-only",
	      "-moz-window-dragging": "drag|no-drag",
	      "-moz-window-shadow": "default|menu|tooltip|sheet|none",
	      "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button",
	      "-webkit-border-before": "<'border-width'>||<'border-style'>||<'color'>",
	      "-webkit-border-before-color": "<'color'>",
	      "-webkit-border-before-style": "<'border-style'>",
	      "-webkit-border-before-width": "<'border-width'>",
	      "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
	      "-webkit-line-clamp": "none|<integer>",
	      "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
	      "-webkit-mask-attachment": "<attachment>#",
	      "-webkit-mask-clip": "[<box>|border|padding|content|text]#",
	      "-webkit-mask-composite": "<composite-style>#",
	      "-webkit-mask-image": "<mask-reference>#",
	      "-webkit-mask-origin": "[<box>|border|padding|content]#",
	      "-webkit-mask-position": "<position>#",
	      "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
	      "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
	      "-webkit-mask-repeat": "<repeat-style>#",
	      "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
	      "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
	      "-webkit-mask-size": "<bg-size>#",
	      "-webkit-overflow-scrolling": "auto|touch",
	      "-webkit-tap-highlight-color": "<color>",
	      "-webkit-text-fill-color": "<color>",
	      "-webkit-text-stroke": "<length>||<color>",
	      "-webkit-text-stroke-color": "<color>",
	      "-webkit-text-stroke-width": "<length>",
	      "-webkit-touch-callout": "default|none",
	      "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
	      "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
	      "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
	      "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
	      "align-tracks": "[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#",
	      "all": "initial|inherit|unset|revert",
	      "animation": "<single-animation>#",
	      "animation-delay": "<time>#",
	      "animation-direction": "<single-animation-direction>#",
	      "animation-duration": "<time>#",
	      "animation-fill-mode": "<single-animation-fill-mode>#",
	      "animation-iteration-count": "<single-animation-iteration-count>#",
	      "animation-name": "[none|<keyframes-name>]#",
	      "animation-play-state": "<single-animation-play-state>#",
	      "animation-timing-function": "<timing-function>#",
	      "appearance": "none|auto|textfield|menulist-button|<compat-auto>",
	      "aspect-ratio": "auto|<ratio>",
	      "azimuth": "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
	      "backdrop-filter": "none|<filter-function-list>",
	      "backface-visibility": "visible|hidden",
	      "background": "[<bg-layer> ,]* <final-bg-layer>",
	      "background-attachment": "<attachment>#",
	      "background-blend-mode": "<blend-mode>#",
	      "background-clip": "<box>#",
	      "background-color": "<color>",
	      "background-image": "<bg-image>#",
	      "background-origin": "<box>#",
	      "background-position": "<bg-position>#",
	      "background-position-x": "[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#",
	      "background-position-y": "[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#",
	      "background-repeat": "<repeat-style>#",
	      "background-size": "<bg-size>#",
	      "block-overflow": "clip|ellipsis|<string>",
	      "block-size": "<'width'>",
	      "border": "<line-width>||<line-style>||<color>",
	      "border-block": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	      "border-block-color": "<'border-top-color'>{1,2}",
	      "border-block-style": "<'border-top-style'>",
	      "border-block-width": "<'border-top-width'>",
	      "border-block-end": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	      "border-block-end-color": "<'border-top-color'>",
	      "border-block-end-style": "<'border-top-style'>",
	      "border-block-end-width": "<'border-top-width'>",
	      "border-block-start": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	      "border-block-start-color": "<'border-top-color'>",
	      "border-block-start-style": "<'border-top-style'>",
	      "border-block-start-width": "<'border-top-width'>",
	      "border-bottom": "<line-width>||<line-style>||<color>",
	      "border-bottom-color": "<'border-top-color'>",
	      "border-bottom-left-radius": "<length-percentage>{1,2}",
	      "border-bottom-right-radius": "<length-percentage>{1,2}",
	      "border-bottom-style": "<line-style>",
	      "border-bottom-width": "<line-width>",
	      "border-collapse": "collapse|separate",
	      "border-color": "<color>{1,4}",
	      "border-end-end-radius": "<length-percentage>{1,2}",
	      "border-end-start-radius": "<length-percentage>{1,2}",
	      "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
	      "border-image-outset": "[<length>|<number>]{1,4}",
	      "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
	      "border-image-slice": "<number-percentage>{1,4}&&fill?",
	      "border-image-source": "none|<image>",
	      "border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
	      "border-inline": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	      "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	      "border-inline-color": "<'border-top-color'>{1,2}",
	      "border-inline-style": "<'border-top-style'>",
	      "border-inline-width": "<'border-top-width'>",
	      "border-inline-end-color": "<'border-top-color'>",
	      "border-inline-end-style": "<'border-top-style'>",
	      "border-inline-end-width": "<'border-top-width'>",
	      "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<'color'>",
	      "border-inline-start-color": "<'border-top-color'>",
	      "border-inline-start-style": "<'border-top-style'>",
	      "border-inline-start-width": "<'border-top-width'>",
	      "border-left": "<line-width>||<line-style>||<color>",
	      "border-left-color": "<color>",
	      "border-left-style": "<line-style>",
	      "border-left-width": "<line-width>",
	      "border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
	      "border-right": "<line-width>||<line-style>||<color>",
	      "border-right-color": "<color>",
	      "border-right-style": "<line-style>",
	      "border-right-width": "<line-width>",
	      "border-spacing": "<length> <length>?",
	      "border-start-end-radius": "<length-percentage>{1,2}",
	      "border-start-start-radius": "<length-percentage>{1,2}",
	      "border-style": "<line-style>{1,4}",
	      "border-top": "<line-width>||<line-style>||<color>",
	      "border-top-color": "<color>",
	      "border-top-left-radius": "<length-percentage>{1,2}",
	      "border-top-right-radius": "<length-percentage>{1,2}",
	      "border-top-style": "<line-style>",
	      "border-top-width": "<line-width>",
	      "border-width": "<line-width>{1,4}",
	      "bottom": "<length>|<percentage>|auto",
	      "box-align": "start|center|end|baseline|stretch",
	      "box-decoration-break": "slice|clone",
	      "box-direction": "normal|reverse|inherit",
	      "box-flex": "<number>",
	      "box-flex-group": "<integer>",
	      "box-lines": "single|multiple",
	      "box-ordinal-group": "<integer>",
	      "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
	      "box-pack": "start|center|end|justify",
	      "box-shadow": "none|<shadow>#",
	      "box-sizing": "content-box|border-box",
	      "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
	      "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
	      "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
	      "caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
	      "caret-color": "auto|<color>",
	      "clear": "none|left|right|both|inline-start|inline-end",
	      "clip": "<shape>|auto",
	      "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
	      "color": "<color>",
	      "color-adjust": "economy|exact",
	      "column-count": "<integer>|auto",
	      "column-fill": "auto|balance|balance-all",
	      "column-gap": "normal|<length-percentage>",
	      "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
	      "column-rule-color": "<color>",
	      "column-rule-style": "<'border-style'>",
	      "column-rule-width": "<'border-width'>",
	      "column-span": "none|all",
	      "column-width": "<length>|auto",
	      "columns": "<'column-width'>||<'column-count'>",
	      "contain": "none|strict|content|[size||layout||style||paint]",
	      "content": "normal|none|[<content-replacement>|<content-list>] [/ <string>]?",
	      "counter-increment": "[<custom-ident> <integer>?]+|none",
	      "counter-reset": "[<custom-ident> <integer>?]+|none",
	      "counter-set": "[<custom-ident> <integer>?]+|none",
	      "cursor": "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
	      "direction": "ltr|rtl",
	      "display": "[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>",
	      "empty-cells": "show|hide",
	      "filter": "none|<filter-function-list>|<-ms-filter-function-list>",
	      "flex": "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
	      "flex-basis": "content|<'width'>",
	      "flex-direction": "row|row-reverse|column|column-reverse",
	      "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
	      "flex-grow": "<number>",
	      "flex-shrink": "<number>",
	      "flex-wrap": "nowrap|wrap|wrap-reverse",
	      "float": "left|right|none|inline-start|inline-end",
	      "font": "[[<'font-style'>||<font-variant-css21>||<'font-weight'>||<'font-stretch'>]? <'font-size'> [/ <'line-height'>]? <'font-family'>]|caption|icon|menu|message-box|small-caption|status-bar",
	      "font-family": "[<family-name>|<generic-family>]#",
	      "font-feature-settings": "normal|<feature-tag-value>#",
	      "font-kerning": "auto|normal|none",
	      "font-language-override": "normal|<string>",
	      "font-optical-sizing": "auto|none",
	      "font-variation-settings": "normal|[<string> <number>]#",
	      "font-size": "<absolute-size>|<relative-size>|<length-percentage>",
	      "font-size-adjust": "none|<number>",
	      "font-smooth": "auto|never|always|<absolute-size>|<length>",
	      "font-stretch": "<font-stretch-absolute>",
	      "font-style": "normal|italic|oblique <angle>?",
	      "font-synthesis": "none|[weight||style]",
	      "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
	      "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
	      "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
	      "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
	      "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
	      "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
	      "font-variant-position": "normal|sub|super",
	      "font-weight": "<font-weight-absolute>|bolder|lighter",
	      "gap": "<'row-gap'> <'column-gap'>?",
	      "grid": "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
	      "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
	      "grid-auto-columns": "<track-size>+",
	      "grid-auto-flow": "[row|column]||dense",
	      "grid-auto-rows": "<track-size>+",
	      "grid-column": "<grid-line> [/ <grid-line>]?",
	      "grid-column-end": "<grid-line>",
	      "grid-column-gap": "<length-percentage>",
	      "grid-column-start": "<grid-line>",
	      "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
	      "grid-row": "<grid-line> [/ <grid-line>]?",
	      "grid-row-end": "<grid-line>",
	      "grid-row-gap": "<length-percentage>",
	      "grid-row-start": "<grid-line>",
	      "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
	      "grid-template-areas": "none|<string>+",
	      "grid-template-columns": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
	      "grid-template-rows": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
	      "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
	      "height": "auto|<length>|<percentage>|min-content|max-content|fit-content( <length-percentage> )",
	      "hyphens": "none|manual|auto",
	      "image-orientation": "from-image|<angle>|[<angle>? flip]",
	      "image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
	      "image-resolution": "[from-image||<resolution>]&&snap?",
	      "ime-mode": "auto|normal|active|inactive|disabled",
	      "initial-letter": "normal|[<number> <integer>?]",
	      "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
	      "inline-size": "<'width'>",
	      "inset": "<'top'>{1,4}",
	      "inset-block": "<'top'>{1,2}",
	      "inset-block-end": "<'top'>",
	      "inset-block-start": "<'top'>",
	      "inset-inline": "<'top'>{1,2}",
	      "inset-inline-end": "<'top'>",
	      "inset-inline-start": "<'top'>",
	      "isolation": "auto|isolate",
	      "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
	      "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
	      "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
	      "justify-tracks": "[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#",
	      "left": "<length>|<percentage>|auto",
	      "letter-spacing": "normal|<length-percentage>",
	      "line-break": "auto|loose|normal|strict|anywhere",
	      "line-clamp": "none|<integer>",
	      "line-height": "normal|<number>|<length>|<percentage>",
	      "line-height-step": "<length>",
	      "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
	      "list-style-image": "<url>|none",
	      "list-style-position": "inside|outside",
	      "list-style-type": "<counter-style>|<string>|none",
	      "margin": "[<length>|<percentage>|auto]{1,4}",
	      "margin-block": "<'margin-left'>{1,2}",
	      "margin-block-end": "<'margin-left'>",
	      "margin-block-start": "<'margin-left'>",
	      "margin-bottom": "<length>|<percentage>|auto",
	      "margin-inline": "<'margin-left'>{1,2}",
	      "margin-inline-end": "<'margin-left'>",
	      "margin-inline-start": "<'margin-left'>",
	      "margin-left": "<length>|<percentage>|auto",
	      "margin-right": "<length>|<percentage>|auto",
	      "margin-top": "<length>|<percentage>|auto",
	      "margin-trim": "none|in-flow|all",
	      "mask": "<mask-layer>#",
	      "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
	      "mask-border-mode": "luminance|alpha",
	      "mask-border-outset": "[<length>|<number>]{1,4}",
	      "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
	      "mask-border-slice": "<number-percentage>{1,4} fill?",
	      "mask-border-source": "none|<image>",
	      "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
	      "mask-clip": "[<geometry-box>|no-clip]#",
	      "mask-composite": "<compositing-operator>#",
	      "mask-image": "<mask-reference>#",
	      "mask-mode": "<masking-mode>#",
	      "mask-origin": "<geometry-box>#",
	      "mask-position": "<position>#",
	      "mask-repeat": "<repeat-style>#",
	      "mask-size": "<bg-size>#",
	      "mask-type": "luminance|alpha",
	      "masonry-auto-flow": "[pack|next]||[definite-first|ordered]",
	      "math-style": "normal|compact",
	      "max-block-size": "<'max-width'>",
	      "max-height": "none|<length-percentage>|min-content|max-content|fit-content( <length-percentage> )",
	      "max-inline-size": "<'max-width'>",
	      "max-lines": "none|<integer>",
	      "max-width": "none|<length-percentage>|min-content|max-content|fit-content( <length-percentage> )|<-non-standard-width>",
	      "min-block-size": "<'min-width'>",
	      "min-height": "auto|<length>|<percentage>|min-content|max-content|fit-content( <length-percentage> )",
	      "min-inline-size": "<'min-width'>",
	      "min-width": "auto|<length-percentage>|min-content|max-content|fit-content( <length-percentage> )|<-non-standard-width>",
	      "mix-blend-mode": "<blend-mode>",
	      "object-fit": "fill|contain|cover|none|scale-down",
	      "object-position": "<position>",
	      "offset": "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
	      "offset-anchor": "auto|<position>",
	      "offset-distance": "<length-percentage>",
	      "offset-path": "none|ray( [<angle>&&<size>&&contain?] )|<path()>|<url>|[<basic-shape>||<geometry-box>]",
	      "offset-position": "auto|<position>",
	      "offset-rotate": "[auto|reverse]||<angle>",
	      "opacity": "<alpha-value>",
	      "order": "<integer>",
	      "orphans": "<integer>",
	      "outline": "[<'outline-color'>||<'outline-style'>||<'outline-width'>]",
	      "outline-color": "<color>|invert",
	      "outline-offset": "<length>",
	      "outline-style": "auto|<'border-style'>",
	      "outline-width": "<line-width>",
	      "overflow": "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
	      "overflow-anchor": "auto|none",
	      "overflow-block": "visible|hidden|clip|scroll|auto",
	      "overflow-clip-box": "padding-box|content-box",
	      "overflow-inline": "visible|hidden|clip|scroll|auto",
	      "overflow-wrap": "normal|break-word|anywhere",
	      "overflow-x": "visible|hidden|clip|scroll|auto",
	      "overflow-y": "visible|hidden|clip|scroll|auto",
	      "overscroll-behavior": "[contain|none|auto]{1,2}",
	      "overscroll-behavior-block": "contain|none|auto",
	      "overscroll-behavior-inline": "contain|none|auto",
	      "overscroll-behavior-x": "contain|none|auto",
	      "overscroll-behavior-y": "contain|none|auto",
	      "padding": "[<length>|<percentage>]{1,4}",
	      "padding-block": "<'padding-left'>{1,2}",
	      "padding-block-end": "<'padding-left'>",
	      "padding-block-start": "<'padding-left'>",
	      "padding-bottom": "<length>|<percentage>",
	      "padding-inline": "<'padding-left'>{1,2}",
	      "padding-inline-end": "<'padding-left'>",
	      "padding-inline-start": "<'padding-left'>",
	      "padding-left": "<length>|<percentage>",
	      "padding-right": "<length>|<percentage>",
	      "padding-top": "<length>|<percentage>",
	      "page-break-after": "auto|always|avoid|left|right|recto|verso",
	      "page-break-before": "auto|always|avoid|left|right|recto|verso",
	      "page-break-inside": "auto|avoid",
	      "paint-order": "normal|[fill||stroke||markers]",
	      "perspective": "none|<length>",
	      "perspective-origin": "<position>",
	      "place-content": "<'align-content'> <'justify-content'>?",
	      "place-items": "<'align-items'> <'justify-items'>?",
	      "place-self": "<'align-self'> <'justify-self'>?",
	      "pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
	      "position": "static|relative|absolute|sticky|fixed|-webkit-sticky",
	      "quotes": "none|auto|[<string> <string>]+",
	      "resize": "none|both|horizontal|vertical|block|inline",
	      "right": "<length>|<percentage>|auto",
	      "rotate": "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
	      "row-gap": "normal|<length-percentage>",
	      "ruby-align": "start|center|space-between|space-around",
	      "ruby-merge": "separate|collapse|auto",
	      "ruby-position": "over|under|inter-character",
	      "scale": "none|<number>{1,3}",
	      "scrollbar-color": "auto|dark|light|<color>{2}",
	      "scrollbar-gutter": "auto|[stable|always]&&both?&&force?",
	      "scrollbar-width": "auto|thin|none",
	      "scroll-behavior": "auto|smooth",
	      "scroll-margin": "<length>{1,4}",
	      "scroll-margin-block": "<length>{1,2}",
	      "scroll-margin-block-start": "<length>",
	      "scroll-margin-block-end": "<length>",
	      "scroll-margin-bottom": "<length>",
	      "scroll-margin-inline": "<length>{1,2}",
	      "scroll-margin-inline-start": "<length>",
	      "scroll-margin-inline-end": "<length>",
	      "scroll-margin-left": "<length>",
	      "scroll-margin-right": "<length>",
	      "scroll-margin-top": "<length>",
	      "scroll-padding": "[auto|<length-percentage>]{1,4}",
	      "scroll-padding-block": "[auto|<length-percentage>]{1,2}",
	      "scroll-padding-block-start": "auto|<length-percentage>",
	      "scroll-padding-block-end": "auto|<length-percentage>",
	      "scroll-padding-bottom": "auto|<length-percentage>",
	      "scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
	      "scroll-padding-inline-start": "auto|<length-percentage>",
	      "scroll-padding-inline-end": "auto|<length-percentage>",
	      "scroll-padding-left": "auto|<length-percentage>",
	      "scroll-padding-right": "auto|<length-percentage>",
	      "scroll-padding-top": "auto|<length-percentage>",
	      "scroll-snap-align": "[none|start|end|center]{1,2}",
	      "scroll-snap-coordinate": "none|<position>#",
	      "scroll-snap-destination": "<position>",
	      "scroll-snap-points-x": "none|repeat( <length-percentage> )",
	      "scroll-snap-points-y": "none|repeat( <length-percentage> )",
	      "scroll-snap-stop": "normal|always",
	      "scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
	      "scroll-snap-type-x": "none|mandatory|proximity",
	      "scroll-snap-type-y": "none|mandatory|proximity",
	      "shape-image-threshold": "<alpha-value>",
	      "shape-margin": "<length-percentage>",
	      "shape-outside": "none|<shape-box>||<basic-shape>|<image>",
	      "tab-size": "<integer>|<length>",
	      "table-layout": "auto|fixed",
	      "text-align": "start|end|left|right|center|justify|match-parent",
	      "text-align-last": "auto|start|end|left|right|center|justify",
	      "text-combine-upright": "none|all|[digits <integer>?]",
	      "text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>||<'text-decoration-thickness'>",
	      "text-decoration-color": "<color>",
	      "text-decoration-line": "none|[underline||overline||line-through||blink]|spelling-error|grammar-error",
	      "text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
	      "text-decoration-skip-ink": "auto|all|none",
	      "text-decoration-style": "solid|double|dotted|dashed|wavy",
	      "text-decoration-thickness": "auto|from-font|<length>|<percentage>",
	      "text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
	      "text-emphasis-color": "<color>",
	      "text-emphasis-position": "[over|under]&&[right|left]",
	      "text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
	      "text-indent": "<length-percentage>&&hanging?&&each-line?",
	      "text-justify": "auto|inter-character|inter-word|none",
	      "text-orientation": "mixed|upright|sideways",
	      "text-overflow": "[clip|ellipsis|<string>]{1,2}",
	      "text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
	      "text-shadow": "none|<shadow-t>#",
	      "text-size-adjust": "none|auto|<percentage>",
	      "text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
	      "text-underline-offset": "auto|<length>|<percentage>",
	      "text-underline-position": "auto|from-font|[under||[left|right]]",
	      "top": "<length>|<percentage>|auto",
	      "touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
	      "transform": "none|<transform-list>",
	      "transform-box": "content-box|border-box|fill-box|stroke-box|view-box",
	      "transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
	      "transform-style": "flat|preserve-3d",
	      "transition": "<single-transition>#",
	      "transition-delay": "<time>#",
	      "transition-duration": "<time>#",
	      "transition-property": "none|<single-transition-property>#",
	      "transition-timing-function": "<timing-function>#",
	      "translate": "none|<length-percentage> [<length-percentage> <length>?]?",
	      "unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate|-webkit-isolate-override|-webkit-plaintext",
	      "user-select": "auto|text|none|contain|all",
	      "vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
	      "visibility": "visible|hidden|collapse",
	      "white-space": "normal|pre|nowrap|pre-wrap|pre-line|break-spaces",
	      "widows": "<integer>",
	      "width": "auto|<length>|<percentage>|min-content|max-content|fit-content( <length-percentage> )|fit-content|-moz-fit-content|-webkit-fit-content",
	      "will-change": "auto|<animateable-feature>#",
	      "word-break": "normal|break-all|keep-all|break-word",
	      "word-spacing": "normal|<length-percentage>",
	      "word-wrap": "normal|break-word",
	      "writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
	      "z-index": "auto|<integer>",
	      "zoom": "normal|reset|<number>|<percentage>",
	      "-moz-background-clip": "padding|border",
	      "-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
	      "-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
	      "-moz-border-radius-topleft": "<'border-top-left-radius'>",
	      "-moz-border-radius-topright": "<'border-bottom-right-radius'>",
	      "-moz-control-character-visibility": "visible|hidden",
	      "-moz-osx-font-smoothing": "auto|grayscale",
	      "-moz-user-select": "none|text|all|-moz-none",
	      "-ms-flex-align": "start|end|center|baseline|stretch",
	      "-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
	      "-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
	      "-ms-flex-negative": "<'flex-shrink'>",
	      "-ms-flex-pack": "start|end|center|justify|distribute",
	      "-ms-flex-order": "<integer>",
	      "-ms-flex-positive": "<'flex-grow'>",
	      "-ms-flex-preferred-size": "<'flex-basis'>",
	      "-ms-interpolation-mode": "nearest-neighbor|bicubic",
	      "-ms-grid-column-align": "start|end|center|stretch",
	      "-ms-grid-row-align": "start|end|center|stretch",
	      "-ms-hyphenate-limit-last": "none|always|column|page|spread",
	      "-webkit-background-clip": "[<box>|border|padding|content|text]#",
	      "-webkit-column-break-after": "always|auto|avoid",
	      "-webkit-column-break-before": "always|auto|avoid",
	      "-webkit-column-break-inside": "always|auto|avoid",
	      "-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
	      "-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
	      "-webkit-print-color-adjust": "economy|exact",
	      "-webkit-text-security": "none|circle|disc|square",
	      "-webkit-user-drag": "none|element|auto",
	      "-webkit-user-select": "auto|none|text|all",
	      "alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
	      "baseline-shift": "baseline|sub|super|<svg-length>",
	      "behavior": "<url>+",
	      "clip-rule": "nonzero|evenodd",
	      "cue": "<'cue-before'> <'cue-after'>?",
	      "cue-after": "<url> <decibel>?|none",
	      "cue-before": "<url> <decibel>?|none",
	      "dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
	      "fill": "<paint>",
	      "fill-opacity": "<number-zero-one>",
	      "fill-rule": "nonzero|evenodd",
	      "glyph-orientation-horizontal": "<angle>",
	      "glyph-orientation-vertical": "<angle>",
	      "kerning": "auto|<svg-length>",
	      "marker": "none|<url>",
	      "marker-end": "none|<url>",
	      "marker-mid": "none|<url>",
	      "marker-start": "none|<url>",
	      "pause": "<'pause-before'> <'pause-after'>?",
	      "pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
	      "pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
	      "rest": "<'rest-before'> <'rest-after'>?",
	      "rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
	      "rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
	      "shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
	      "src": "[<url> [format( <string># )]?|local( <family-name> )]#",
	      "speak": "auto|none|normal",
	      "speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
	      "stroke": "<paint>",
	      "stroke-dasharray": "none|[<svg-length>+]#",
	      "stroke-dashoffset": "<svg-length>",
	      "stroke-linecap": "butt|round|square",
	      "stroke-linejoin": "miter|round|bevel",
	      "stroke-miterlimit": "<number-one-or-greater>",
	      "stroke-opacity": "<number-zero-one>",
	      "stroke-width": "<svg-length>",
	      "text-anchor": "start|middle|end",
	      "unicode-range": "<urange>#",
	      "voice-balance": "<number>|left|center|right|leftwards|rightwards",
	      "voice-duration": "auto|<time>",
	      "voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
	      "voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
	      "voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
	      "voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
	      "voice-stress": "normal|strong|moderate|none|reduced",
	      "voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]"
	  },
	  "atrules": {
	      "charset": {
	          "prelude": "<string>",
	          "descriptors": null
	      },
	      "counter-style": {
	          "prelude": "<counter-style-name>",
	          "descriptors": {
	              "additive-symbols": "[<integer>&&<symbol>]#",
	              "fallback": "<counter-style-name>",
	              "negative": "<symbol> <symbol>?",
	              "pad": "<integer>&&<symbol>",
	              "prefix": "<symbol>",
	              "range": "[[<integer>|infinite]{2}]#|auto",
	              "speak-as": "auto|bullets|numbers|words|spell-out|<counter-style-name>",
	              "suffix": "<symbol>",
	              "symbols": "<symbol>+",
	              "system": "cyclic|numeric|alphabetic|symbolic|additive|[fixed <integer>?]|[extends <counter-style-name>]"
	          }
	      },
	      "document": {
	          "prelude": "[<url>|url-prefix( <string> )|domain( <string> )|media-document( <string> )|regexp( <string> )]#",
	          "descriptors": null
	      },
	      "font-face": {
	          "prelude": null,
	          "descriptors": {
	              "font-display": "[auto|block|swap|fallback|optional]",
	              "font-family": "<family-name>",
	              "font-feature-settings": "normal|<feature-tag-value>#",
	              "font-variation-settings": "normal|[<string> <number>]#",
	              "font-stretch": "<font-stretch-absolute>{1,2}",
	              "font-style": "normal|italic|oblique <angle>{0,2}",
	              "font-weight": "<font-weight-absolute>{1,2}",
	              "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
	              "src": "[<url> [format( <string># )]?|local( <family-name> )]#",
	              "unicode-range": "<urange>#"
	          }
	      },
	      "font-feature-values": {
	          "prelude": "<family-name>#",
	          "descriptors": null
	      },
	      "import": {
	          "prelude": "[<string>|<url>] [<media-query-list>]?",
	          "descriptors": null
	      },
	      "keyframes": {
	          "prelude": "<keyframes-name>",
	          "descriptors": null
	      },
	      "media": {
	          "prelude": "<media-query-list>",
	          "descriptors": null
	      },
	      "namespace": {
	          "prelude": "<namespace-prefix>? [<string>|<url>]",
	          "descriptors": null
	      },
	      "page": {
	          "prelude": "<page-selector-list>",
	          "descriptors": {
	              "bleed": "auto|<length>",
	              "marks": "none|[crop||cross]",
	              "size": "<length>{1,2}|auto|[<page-size>||[portrait|landscape]]"
	          }
	      },
	      "property": {
	          "prelude": "<custom-property-name>",
	          "descriptors": {
	              "syntax": "<string>",
	              "inherits": "true|false",
	              "initial-value": "<string>"
	          }
	      },
	      "supports": {
	          "prelude": "<supports-condition>",
	          "descriptors": null
	      },
	      "viewport": {
	          "prelude": null,
	          "descriptors": {
	              "height": "<viewport-length>{1,2}",
	              "max-height": "<viewport-length>",
	              "max-width": "<viewport-length>",
	              "max-zoom": "auto|<number>|<percentage>",
	              "min-height": "<viewport-length>",
	              "min-width": "<viewport-length>",
	              "min-zoom": "auto|<number>|<percentage>",
	              "orientation": "auto|portrait|landscape",
	              "user-zoom": "zoom|fixed",
	              "viewport-fit": "auto|contain|cover",
	              "width": "<viewport-length>{1,2}",
	              "zoom": "auto|<number>|<percentage>"
	          }
	      }
	  }
	};

	var cmpChar$3 = tokenizer.cmpChar;
	var isDigit$4 = tokenizer.isDigit;
	var TYPE$9 = tokenizer.TYPE;

	var WHITESPACE$4 = TYPE$9.WhiteSpace;
	var COMMENT$4 = TYPE$9.Comment;
	var IDENT$3 = TYPE$9.Ident;
	var NUMBER$3 = TYPE$9.Number;
	var DIMENSION$2 = TYPE$9.Dimension;
	var PLUSSIGN$3 = 0x002B;    // U+002B PLUS SIGN (+)
	var HYPHENMINUS$3 = 0x002D; // U+002D HYPHEN-MINUS (-)
	var N$4 = 0x006E;           // U+006E LATIN SMALL LETTER N (n)
	var DISALLOW_SIGN$1 = true;
	var ALLOW_SIGN$1 = false;

	function checkInteger$1(offset, disallowSign) {
	  var pos = this.scanner.tokenStart + offset;
	  var code = this.scanner.source.charCodeAt(pos);

	  if (code === PLUSSIGN$3 || code === HYPHENMINUS$3) {
	      if (disallowSign) {
	          this.error('Number sign is not allowed');
	      }
	      pos++;
	  }

	  for (; pos < this.scanner.tokenEnd; pos++) {
	      if (!isDigit$4(this.scanner.source.charCodeAt(pos))) {
	          this.error('Integer is expected', pos);
	      }
	  }
	}

	function checkTokenIsInteger(disallowSign) {
	  return checkInteger$1.call(this, 0, disallowSign);
	}

	function expectCharCode(offset, code) {
	  if (!cmpChar$3(this.scanner.source, this.scanner.tokenStart + offset, code)) {
	      var msg = '';

	      switch (code) {
	          case N$4:
	              msg = 'N is expected';
	              break;
	          case HYPHENMINUS$3:
	              msg = 'HyphenMinus is expected';
	              break;
	      }

	      this.error(msg, this.scanner.tokenStart + offset);
	  }
	}

	// ... <signed-integer>
	// ... ['+' | '-'] <signless-integer>
	function consumeB$1() {
	  var offset = 0;
	  var sign = 0;
	  var type = this.scanner.tokenType;

	  while (type === WHITESPACE$4 || type === COMMENT$4) {
	      type = this.scanner.lookupType(++offset);
	  }

	  if (type !== NUMBER$3) {
	      if (this.scanner.isDelim(PLUSSIGN$3, offset) ||
	          this.scanner.isDelim(HYPHENMINUS$3, offset)) {
	          sign = this.scanner.isDelim(PLUSSIGN$3, offset) ? PLUSSIGN$3 : HYPHENMINUS$3;

	          do {
	              type = this.scanner.lookupType(++offset);
	          } while (type === WHITESPACE$4 || type === COMMENT$4);

	          if (type !== NUMBER$3) {
	              this.scanner.skip(offset);
	              checkTokenIsInteger.call(this, DISALLOW_SIGN$1);
	          }
	      } else {
	          return null;
	      }
	  }

	  if (offset > 0) {
	      this.scanner.skip(offset);
	  }

	  if (sign === 0) {
	      type = this.scanner.source.charCodeAt(this.scanner.tokenStart);
	      if (type !== PLUSSIGN$3 && type !== HYPHENMINUS$3) {
	          this.error('Number sign is expected');
	      }
	  }

	  checkTokenIsInteger.call(this, sign !== 0);
	  return sign === HYPHENMINUS$3 ? '-' + this.consume(NUMBER$3) : this.consume(NUMBER$3);
	}

	// An+B microsyntax https://www.w3.org/TR/css-syntax-3/#anb
	var AnPlusB = {
	  name: 'AnPlusB',
	  structure: {
	      a: [String, null],
	      b: [String, null]
	  },
	  parse: function() {
	      /* eslint-disable brace-style*/
	      var start = this.scanner.tokenStart;
	      var a = null;
	      var b = null;

	      // <integer>
	      if (this.scanner.tokenType === NUMBER$3) {
	          checkTokenIsInteger.call(this, ALLOW_SIGN$1);
	          b = this.consume(NUMBER$3);
	      }

	      // -n
	      // -n <signed-integer>
	      // -n ['+' | '-'] <signless-integer>
	      // -n- <signless-integer>
	      // <dashndashdigit-ident>
	      else if (this.scanner.tokenType === IDENT$3 && cmpChar$3(this.scanner.source, this.scanner.tokenStart, HYPHENMINUS$3)) {
	          a = '-1';

	          expectCharCode.call(this, 1, N$4);

	          switch (this.scanner.getTokenLength()) {
	              // -n
	              // -n <signed-integer>
	              // -n ['+' | '-'] <signless-integer>
	              case 2:
	                  this.scanner.next();
	                  b = consumeB$1.call(this);
	                  break;

	              // -n- <signless-integer>
	              case 3:
	                  expectCharCode.call(this, 2, HYPHENMINUS$3);

	                  this.scanner.next();
	                  this.scanner.skipSC();

	                  checkTokenIsInteger.call(this, DISALLOW_SIGN$1);

	                  b = '-' + this.consume(NUMBER$3);
	                  break;

	              // <dashndashdigit-ident>
	              default:
	                  expectCharCode.call(this, 2, HYPHENMINUS$3);
	                  checkInteger$1.call(this, 3, DISALLOW_SIGN$1);
	                  this.scanner.next();

	                  b = this.scanner.substrToCursor(start + 2);
	          }
	      }

	      // '+'? n
	      // '+'? n <signed-integer>
	      // '+'? n ['+' | '-'] <signless-integer>
	      // '+'? n- <signless-integer>
	      // '+'? <ndashdigit-ident>
	      else if (this.scanner.tokenType === IDENT$3 || (this.scanner.isDelim(PLUSSIGN$3) && this.scanner.lookupType(1) === IDENT$3)) {
	          var sign = 0;
	          a = '1';

	          // just ignore a plus
	          if (this.scanner.isDelim(PLUSSIGN$3)) {
	              sign = 1;
	              this.scanner.next();
	          }

	          expectCharCode.call(this, 0, N$4);

	          switch (this.scanner.getTokenLength()) {
	              // '+'? n
	              // '+'? n <signed-integer>
	              // '+'? n ['+' | '-'] <signless-integer>
	              case 1:
	                  this.scanner.next();
	                  b = consumeB$1.call(this);
	                  break;

	              // '+'? n- <signless-integer>
	              case 2:
	                  expectCharCode.call(this, 1, HYPHENMINUS$3);

	                  this.scanner.next();
	                  this.scanner.skipSC();

	                  checkTokenIsInteger.call(this, DISALLOW_SIGN$1);

	                  b = '-' + this.consume(NUMBER$3);
	                  break;

	              // '+'? <ndashdigit-ident>
	              default:
	                  expectCharCode.call(this, 1, HYPHENMINUS$3);
	                  checkInteger$1.call(this, 2, DISALLOW_SIGN$1);
	                  this.scanner.next();

	                  b = this.scanner.substrToCursor(start + sign + 1);
	          }
	      }

	      // <ndashdigit-dimension>
	      // <ndash-dimension> <signless-integer>
	      // <n-dimension>
	      // <n-dimension> <signed-integer>
	      // <n-dimension> ['+' | '-'] <signless-integer>
	      else if (this.scanner.tokenType === DIMENSION$2) {
	          var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);
	          var sign = code === PLUSSIGN$3 || code === HYPHENMINUS$3;

	          for (var i = this.scanner.tokenStart + sign; i < this.scanner.tokenEnd; i++) {
	              if (!isDigit$4(this.scanner.source.charCodeAt(i))) {
	                  break;
	              }
	          }

	          if (i === this.scanner.tokenStart + sign) {
	              this.error('Integer is expected', this.scanner.tokenStart + sign);
	          }

	          expectCharCode.call(this, i - this.scanner.tokenStart, N$4);
	          a = this.scanner.source.substring(start, i);

	          // <n-dimension>
	          // <n-dimension> <signed-integer>
	          // <n-dimension> ['+' | '-'] <signless-integer>
	          if (i + 1 === this.scanner.tokenEnd) {
	              this.scanner.next();
	              b = consumeB$1.call(this);
	          } else {
	              expectCharCode.call(this, i - this.scanner.tokenStart + 1, HYPHENMINUS$3);

	              // <ndash-dimension> <signless-integer>
	              if (i + 2 === this.scanner.tokenEnd) {
	                  this.scanner.next();
	                  this.scanner.skipSC();
	                  checkTokenIsInteger.call(this, DISALLOW_SIGN$1);
	                  b = '-' + this.consume(NUMBER$3);
	              }
	              // <ndashdigit-dimension>
	              else {
	                  checkInteger$1.call(this, i - this.scanner.tokenStart + 2, DISALLOW_SIGN$1);
	                  this.scanner.next();
	                  b = this.scanner.substrToCursor(i + 1);
	              }
	          }
	      } else {
	          this.error();
	      }

	      if (a !== null && a.charCodeAt(0) === PLUSSIGN$3) {
	          a = a.substr(1);
	      }

	      if (b !== null && b.charCodeAt(0) === PLUSSIGN$3) {
	          b = b.substr(1);
	      }

	      return {
	          type: 'AnPlusB',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          a: a,
	          b: b
	      };
	  },
	  generate: function(node) {
	      var a = node.a !== null && node.a !== undefined;
	      var b = node.b !== null && node.b !== undefined;

	      if (a) {
	          this.chunk(
	              node.a === '+1' ? '+n' : // eslint-disable-line operator-linebreak, indent
	              node.a ===  '1' ?  'n' : // eslint-disable-line operator-linebreak, indent
	              node.a === '-1' ? '-n' : // eslint-disable-line operator-linebreak, indent
	              node.a + 'n'             // eslint-disable-line operator-linebreak, indent
	          );

	          if (b) {
	              b = String(node.b);
	              if (b.charAt(0) === '-' || b.charAt(0) === '+') {
	                  this.chunk(b.charAt(0));
	                  this.chunk(b.substr(1));
	              } else {
	                  this.chunk('+');
	                  this.chunk(b);
	              }
	          }
	      } else {
	          this.chunk(String(node.b));
	      }
	  }
	};

	var TYPE$a = tokenizer.TYPE;

	var WhiteSpace = TYPE$a.WhiteSpace;
	var Semicolon = TYPE$a.Semicolon;
	var LeftCurlyBracket = TYPE$a.LeftCurlyBracket;
	var Delim = TYPE$a.Delim;
	var EXCLAMATIONMARK$1 = 0x0021; // U+0021 EXCLAMATION MARK (!)

	function getOffsetExcludeWS() {
	  if (this.scanner.tokenIndex > 0) {
	      if (this.scanner.lookupType(-1) === WhiteSpace) {
	          return this.scanner.tokenIndex > 1
	              ? this.scanner.getTokenStart(this.scanner.tokenIndex - 1)
	              : this.scanner.firstCharOffset;
	      }
	  }

	  return this.scanner.tokenStart;
	}

	// 0, 0, false
	function balanceEnd() {
	  return 0;
	}

	// LEFTCURLYBRACKET, 0, false
	function leftCurlyBracket(tokenType) {
	  return tokenType === LeftCurlyBracket ? 1 : 0;
	}

	// LEFTCURLYBRACKET, SEMICOLON, false
	function leftCurlyBracketOrSemicolon(tokenType) {
	  return tokenType === LeftCurlyBracket || tokenType === Semicolon ? 1 : 0;
	}

	// EXCLAMATIONMARK, SEMICOLON, false
	function exclamationMarkOrSemicolon(tokenType, source, offset) {
	  if (tokenType === Delim && source.charCodeAt(offset) === EXCLAMATIONMARK$1) {
	      return 1;
	  }

	  return tokenType === Semicolon ? 1 : 0;
	}

	// 0, SEMICOLON, true
	function semicolonIncluded(tokenType) {
	  return tokenType === Semicolon ? 2 : 0;
	}

	var Raw = {
	  name: 'Raw',
	  structure: {
	      value: String
	  },
	  parse: function(startToken, mode, excludeWhiteSpace) {
	      var startOffset = this.scanner.getTokenStart(startToken);
	      var endOffset;

	      this.scanner.skip(
	          this.scanner.getRawLength(startToken, mode || balanceEnd)
	      );

	      if (excludeWhiteSpace && this.scanner.tokenStart > startOffset) {
	          endOffset = getOffsetExcludeWS.call(this);
	      } else {
	          endOffset = this.scanner.tokenStart;
	      }

	      return {
	          type: 'Raw',
	          loc: this.getLocation(startOffset, endOffset),
	          value: this.scanner.source.substring(startOffset, endOffset)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	  },

	  mode: {
	      default: balanceEnd,
	      leftCurlyBracket: leftCurlyBracket,
	      leftCurlyBracketOrSemicolon: leftCurlyBracketOrSemicolon,
	      exclamationMarkOrSemicolon: exclamationMarkOrSemicolon,
	      semicolonIncluded: semicolonIncluded
	  }
	};

	var TYPE$b = tokenizer.TYPE;
	var rawMode = Raw.mode;

	var ATKEYWORD = TYPE$b.AtKeyword;
	var SEMICOLON = TYPE$b.Semicolon;
	var LEFTCURLYBRACKET$1 = TYPE$b.LeftCurlyBracket;
	var RIGHTCURLYBRACKET$1 = TYPE$b.RightCurlyBracket;

	function consumeRaw(startToken) {
	  return this.Raw(startToken, rawMode.leftCurlyBracketOrSemicolon, true);
	}

	function isDeclarationBlockAtrule() {
	  for (var offset = 1, type; type = this.scanner.lookupType(offset); offset++) {
	      if (type === RIGHTCURLYBRACKET$1) {
	          return true;
	      }

	      if (type === LEFTCURLYBRACKET$1 ||
	          type === ATKEYWORD) {
	          return false;
	      }
	  }

	  return false;
	}

	var Atrule = {
	  name: 'Atrule',
	  structure: {
	      name: String,
	      prelude: ['AtrulePrelude', 'Raw', null],
	      block: ['Block', null]
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var name;
	      var nameLowerCase;
	      var prelude = null;
	      var block = null;

	      this.eat(ATKEYWORD);

	      name = this.scanner.substrToCursor(start + 1);
	      nameLowerCase = name.toLowerCase();
	      this.scanner.skipSC();

	      // parse prelude
	      if (this.scanner.eof === false &&
	          this.scanner.tokenType !== LEFTCURLYBRACKET$1 &&
	          this.scanner.tokenType !== SEMICOLON) {
	          if (this.parseAtrulePrelude) {
	              prelude = this.parseWithFallback(this.AtrulePrelude.bind(this, name), consumeRaw);

	              // turn empty AtrulePrelude into null
	              if (prelude.type === 'AtrulePrelude' && prelude.children.head === null) {
	                  prelude = null;
	              }
	          } else {
	              prelude = consumeRaw.call(this, this.scanner.tokenIndex);
	          }

	          this.scanner.skipSC();
	      }

	      switch (this.scanner.tokenType) {
	          case SEMICOLON:
	              this.scanner.next();
	              break;

	          case LEFTCURLYBRACKET$1:
	              if (this.atrule.hasOwnProperty(nameLowerCase) &&
	                  typeof this.atrule[nameLowerCase].block === 'function') {
	                  block = this.atrule[nameLowerCase].block.call(this);
	              } else {
	                  // TODO: should consume block content as Raw?
	                  block = this.Block(isDeclarationBlockAtrule.call(this));
	              }

	              break;
	      }

	      return {
	          type: 'Atrule',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: name,
	          prelude: prelude,
	          block: block
	      };
	  },
	  generate: function(node) {
	      this.chunk('@');
	      this.chunk(node.name);

	      if (node.prelude !== null) {
	          this.chunk(' ');
	          this.node(node.prelude);
	      }

	      if (node.block) {
	          this.node(node.block);
	      } else {
	          this.chunk(';');
	      }
	  },
	  walkContext: 'atrule'
	};

	var TYPE$c = tokenizer.TYPE;

	var SEMICOLON$1 = TYPE$c.Semicolon;
	var LEFTCURLYBRACKET$2 = TYPE$c.LeftCurlyBracket;

	var AtrulePrelude = {
	  name: 'AtrulePrelude',
	  structure: {
	      children: [[]]
	  },
	  parse: function(name) {
	      var children = null;

	      if (name !== null) {
	          name = name.toLowerCase();
	      }

	      this.scanner.skipSC();

	      if (this.atrule.hasOwnProperty(name) &&
	          typeof this.atrule[name].prelude === 'function') {
	          // custom consumer
	          children = this.atrule[name].prelude.call(this);
	      } else {
	          // default consumer
	          children = this.readSequence(this.scope.AtrulePrelude);
	      }

	      this.scanner.skipSC();

	      if (this.scanner.eof !== true &&
	          this.scanner.tokenType !== LEFTCURLYBRACKET$2 &&
	          this.scanner.tokenType !== SEMICOLON$1) {
	          this.error('Semicolon or block is expected');
	      }

	      if (children === null) {
	          children = this.createList();
	      }

	      return {
	          type: 'AtrulePrelude',
	          loc: this.getLocationFromList(children),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node);
	  },
	  walkContext: 'atrulePrelude'
	};

	var TYPE$d = tokenizer.TYPE;

	var IDENT$4 = TYPE$d.Ident;
	var STRING = TYPE$d.String;
	var COLON = TYPE$d.Colon;
	var LEFTSQUAREBRACKET$1 = TYPE$d.LeftSquareBracket;
	var RIGHTSQUAREBRACKET$1 = TYPE$d.RightSquareBracket;
	var DOLLARSIGN = 0x0024;       // U+0024 DOLLAR SIGN ($)
	var ASTERISK$1 = 0x002A;         // U+002A ASTERISK (*)
	var EQUALSSIGN = 0x003D;       // U+003D EQUALS SIGN (=)
	var CIRCUMFLEXACCENT = 0x005E; // U+005E (^)
	var VERTICALLINE$1 = 0x007C;     // U+007C VERTICAL LINE (|)
	var TILDE = 0x007E;            // U+007E TILDE (~)

	function getAttributeName() {
	  if (this.scanner.eof) {
	      this.error('Unexpected end of input');
	  }

	  var start = this.scanner.tokenStart;
	  var expectIdent = false;
	  var checkColon = true;

	  if (this.scanner.isDelim(ASTERISK$1)) {
	      expectIdent = true;
	      checkColon = false;
	      this.scanner.next();
	  } else if (!this.scanner.isDelim(VERTICALLINE$1)) {
	      this.eat(IDENT$4);
	  }

	  if (this.scanner.isDelim(VERTICALLINE$1)) {
	      if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 1) !== EQUALSSIGN) {
	          this.scanner.next();
	          this.eat(IDENT$4);
	      } else if (expectIdent) {
	          this.error('Identifier is expected', this.scanner.tokenEnd);
	      }
	  } else if (expectIdent) {
	      this.error('Vertical line is expected');
	  }

	  if (checkColon && this.scanner.tokenType === COLON) {
	      this.scanner.next();
	      this.eat(IDENT$4);
	  }

	  return {
	      type: 'Identifier',
	      loc: this.getLocation(start, this.scanner.tokenStart),
	      name: this.scanner.substrToCursor(start)
	  };
	}

	function getOperator() {
	  var start = this.scanner.tokenStart;
	  var code = this.scanner.source.charCodeAt(start);

	  if (code !== EQUALSSIGN &&        // =
	      code !== TILDE &&             // ~=
	      code !== CIRCUMFLEXACCENT &&  // ^=
	      code !== DOLLARSIGN &&        // $=
	      code !== ASTERISK$1 &&          // *=
	      code !== VERTICALLINE$1         // |=
	  ) {
	      this.error('Attribute selector (=, ~=, ^=, $=, *=, |=) is expected');
	  }

	  this.scanner.next();

	  if (code !== EQUALSSIGN) {
	      if (!this.scanner.isDelim(EQUALSSIGN)) {
	          this.error('Equal sign is expected');
	      }

	      this.scanner.next();
	  }

	  return this.scanner.substrToCursor(start);
	}

	// '[' <wq-name> ']'
	// '[' <wq-name> <attr-matcher> [ <string-token> | <ident-token> ] <attr-modifier>? ']'
	var AttributeSelector = {
	  name: 'AttributeSelector',
	  structure: {
	      name: 'Identifier',
	      matcher: [String, null],
	      value: ['String', 'Identifier', null],
	      flags: [String, null]
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var name;
	      var matcher = null;
	      var value = null;
	      var flags = null;

	      this.eat(LEFTSQUAREBRACKET$1);
	      this.scanner.skipSC();

	      name = getAttributeName.call(this);
	      this.scanner.skipSC();

	      if (this.scanner.tokenType !== RIGHTSQUAREBRACKET$1) {
	          // avoid case `[name i]`
	          if (this.scanner.tokenType !== IDENT$4) {
	              matcher = getOperator.call(this);

	              this.scanner.skipSC();

	              value = this.scanner.tokenType === STRING
	                  ? this.String()
	                  : this.Identifier();

	              this.scanner.skipSC();
	          }

	          // attribute flags
	          if (this.scanner.tokenType === IDENT$4) {
	              flags = this.scanner.getTokenValue();
	              this.scanner.next();

	              this.scanner.skipSC();
	          }
	      }

	      this.eat(RIGHTSQUAREBRACKET$1);

	      return {
	          type: 'AttributeSelector',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: name,
	          matcher: matcher,
	          value: value,
	          flags: flags
	      };
	  },
	  generate: function(node) {
	      var flagsPrefix = ' ';

	      this.chunk('[');
	      this.node(node.name);

	      if (node.matcher !== null) {
	          this.chunk(node.matcher);

	          if (node.value !== null) {
	              this.node(node.value);

	              // space between string and flags is not required
	              if (node.value.type === 'String') {
	                  flagsPrefix = '';
	              }
	          }
	      }

	      if (node.flags !== null) {
	          this.chunk(flagsPrefix);
	          this.chunk(node.flags);
	      }

	      this.chunk(']');
	  }
	};

	var TYPE$e = tokenizer.TYPE;
	var rawMode$1 = Raw.mode;

	var WHITESPACE$5 = TYPE$e.WhiteSpace;
	var COMMENT$5 = TYPE$e.Comment;
	var SEMICOLON$2 = TYPE$e.Semicolon;
	var ATKEYWORD$1 = TYPE$e.AtKeyword;
	var LEFTCURLYBRACKET$3 = TYPE$e.LeftCurlyBracket;
	var RIGHTCURLYBRACKET$2 = TYPE$e.RightCurlyBracket;

	function consumeRaw$1(startToken) {
	  return this.Raw(startToken, null, true);
	}
	function consumeRule() {
	  return this.parseWithFallback(this.Rule, consumeRaw$1);
	}
	function consumeRawDeclaration(startToken) {
	  return this.Raw(startToken, rawMode$1.semicolonIncluded, true);
	}
	function consumeDeclaration() {
	  if (this.scanner.tokenType === SEMICOLON$2) {
	      return consumeRawDeclaration.call(this, this.scanner.tokenIndex);
	  }

	  var node = this.parseWithFallback(this.Declaration, consumeRawDeclaration);

	  if (this.scanner.tokenType === SEMICOLON$2) {
	      this.scanner.next();
	  }

	  return node;
	}

	var Block = {
	  name: 'Block',
	  structure: {
	      children: [[
	          'Atrule',
	          'Rule',
	          'Declaration'
	      ]]
	  },
	  parse: function(isDeclaration) {
	      var consumer = isDeclaration ? consumeDeclaration : consumeRule;

	      var start = this.scanner.tokenStart;
	      var children = this.createList();

	      this.eat(LEFTCURLYBRACKET$3);

	      scan:
	      while (!this.scanner.eof) {
	          switch (this.scanner.tokenType) {
	              case RIGHTCURLYBRACKET$2:
	                  break scan;

	              case WHITESPACE$5:
	              case COMMENT$5:
	                  this.scanner.next();
	                  break;

	              case ATKEYWORD$1:
	                  children.push(this.parseWithFallback(this.Atrule, consumeRaw$1));
	                  break;

	              default:
	                  children.push(consumer.call(this));
	          }
	      }

	      if (!this.scanner.eof) {
	          this.eat(RIGHTCURLYBRACKET$2);
	      }

	      return {
	          type: 'Block',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.chunk('{');
	      this.children(node, function(prev) {
	          if (prev.type === 'Declaration') {
	              this.chunk(';');
	          }
	      });
	      this.chunk('}');
	  },
	  walkContext: 'block'
	};

	var TYPE$f = tokenizer.TYPE;

	var LEFTSQUAREBRACKET$2 = TYPE$f.LeftSquareBracket;
	var RIGHTSQUAREBRACKET$2 = TYPE$f.RightSquareBracket;

	var Brackets = {
	  name: 'Brackets',
	  structure: {
	      children: [[]]
	  },
	  parse: function(readSequence, recognizer) {
	      var start = this.scanner.tokenStart;
	      var children = null;

	      this.eat(LEFTSQUAREBRACKET$2);

	      children = readSequence.call(this, recognizer);

	      if (!this.scanner.eof) {
	          this.eat(RIGHTSQUAREBRACKET$2);
	      }

	      return {
	          type: 'Brackets',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.chunk('[');
	      this.children(node);
	      this.chunk(']');
	  }
	};

	var CDC = tokenizer.TYPE.CDC;

	var CDC_1 = {
	  name: 'CDC',
	  structure: [],
	  parse: function() {
	      var start = this.scanner.tokenStart;

	      this.eat(CDC); // -->

	      return {
	          type: 'CDC',
	          loc: this.getLocation(start, this.scanner.tokenStart)
	      };
	  },
	  generate: function() {
	      this.chunk('-->');
	  }
	};

	var CDO = tokenizer.TYPE.CDO;

	var CDO_1 = {
	  name: 'CDO',
	  structure: [],
	  parse: function() {
	      var start = this.scanner.tokenStart;

	      this.eat(CDO); // <!--

	      return {
	          type: 'CDO',
	          loc: this.getLocation(start, this.scanner.tokenStart)
	      };
	  },
	  generate: function() {
	      this.chunk('<!--');
	  }
	};

	var TYPE$g = tokenizer.TYPE;

	var IDENT$5 = TYPE$g.Ident;
	var FULLSTOP = 0x002E; // U+002E FULL STOP (.)

	// '.' ident
	var ClassSelector = {
	  name: 'ClassSelector',
	  structure: {
	      name: String
	  },
	  parse: function() {
	      if (!this.scanner.isDelim(FULLSTOP)) {
	          this.error('Full stop is expected');
	      }

	      this.scanner.next();

	      return {
	          type: 'ClassSelector',
	          loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
	          name: this.consume(IDENT$5)
	      };
	  },
	  generate: function(node) {
	      this.chunk('.');
	      this.chunk(node.name);
	  }
	};

	var TYPE$h = tokenizer.TYPE;

	var IDENT$6 = TYPE$h.Ident;
	var PLUSSIGN$4 = 0x002B;        // U+002B PLUS SIGN (+)
	var SOLIDUS = 0x002F;         // U+002F SOLIDUS (/)
	var GREATERTHANSIGN$1 = 0x003E; // U+003E GREATER-THAN SIGN (>)
	var TILDE$1 = 0x007E;           // U+007E TILDE (~)

	// + | > | ~ | /deep/
	var Combinator = {
	  name: 'Combinator',
	  structure: {
	      name: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

	      switch (code) {
	          case GREATERTHANSIGN$1:
	          case PLUSSIGN$4:
	          case TILDE$1:
	              this.scanner.next();
	              break;

	          case SOLIDUS:
	              this.scanner.next();

	              if (this.scanner.tokenType !== IDENT$6 || this.scanner.lookupValue(0, 'deep') === false) {
	                  this.error('Identifier `deep` is expected');
	              }

	              this.scanner.next();

	              if (!this.scanner.isDelim(SOLIDUS)) {
	                  this.error('Solidus is expected');
	              }

	              this.scanner.next();
	              break;

	          default:
	              this.error('Combinator is expected');
	      }

	      return {
	          type: 'Combinator',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: this.scanner.substrToCursor(start)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.name);
	  }
	};

	var TYPE$i = tokenizer.TYPE;

	var COMMENT$6 = TYPE$i.Comment;
	var ASTERISK$2 = 0x002A;        // U+002A ASTERISK (*)
	var SOLIDUS$1 = 0x002F;         // U+002F SOLIDUS (/)

	// '/*' .* '*/'
	var Comment = {
	  name: 'Comment',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var end = this.scanner.tokenEnd;

	      this.eat(COMMENT$6);

	      if ((end - start + 2) >= 2 &&
	          this.scanner.source.charCodeAt(end - 2) === ASTERISK$2 &&
	          this.scanner.source.charCodeAt(end - 1) === SOLIDUS$1) {
	          end -= 2;
	      }

	      return {
	          type: 'Comment',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          value: this.scanner.source.substring(start + 2, end)
	      };
	  },
	  generate: function(node) {
	      this.chunk('/*');
	      this.chunk(node.value);
	      this.chunk('*/');
	  }
	};

	var isCustomProperty$1 = names.isCustomProperty;
	var TYPE$j = tokenizer.TYPE;
	var rawMode$2 = Raw.mode;

	var IDENT$7 = TYPE$j.Ident;
	var HASH$1 = TYPE$j.Hash;
	var COLON$1 = TYPE$j.Colon;
	var SEMICOLON$3 = TYPE$j.Semicolon;
	var DELIM$2 = TYPE$j.Delim;
	var WHITESPACE$6 = TYPE$j.WhiteSpace;
	var EXCLAMATIONMARK$2 = 0x0021; // U+0021 EXCLAMATION MARK (!)
	var NUMBERSIGN$2 = 0x0023;      // U+0023 NUMBER SIGN (#)
	var DOLLARSIGN$1 = 0x0024;      // U+0024 DOLLAR SIGN ($)
	var AMPERSAND$1 = 0x0026;       // U+0026 ANPERSAND (&)
	var ASTERISK$3 = 0x002A;        // U+002A ASTERISK (*)
	var PLUSSIGN$5 = 0x002B;        // U+002B PLUS SIGN (+)
	var SOLIDUS$2 = 0x002F;         // U+002F SOLIDUS (/)

	function consumeValueRaw(startToken) {
	  return this.Raw(startToken, rawMode$2.exclamationMarkOrSemicolon, true);
	}

	function consumeCustomPropertyRaw(startToken) {
	  return this.Raw(startToken, rawMode$2.exclamationMarkOrSemicolon, false);
	}

	function consumeValue() {
	  var startValueToken = this.scanner.tokenIndex;
	  var value = this.Value();

	  if (value.type !== 'Raw' &&
	      this.scanner.eof === false &&
	      this.scanner.tokenType !== SEMICOLON$3 &&
	      this.scanner.isDelim(EXCLAMATIONMARK$2) === false &&
	      this.scanner.isBalanceEdge(startValueToken) === false) {
	      this.error();
	  }

	  return value;
	}

	var Declaration = {
	  name: 'Declaration',
	  structure: {
	      important: [Boolean, String],
	      property: String,
	      value: ['Value', 'Raw']
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var startToken = this.scanner.tokenIndex;
	      var property = readProperty$1.call(this);
	      var customProperty = isCustomProperty$1(property);
	      var parseValue = customProperty ? this.parseCustomProperty : this.parseValue;
	      var consumeRaw = customProperty ? consumeCustomPropertyRaw : consumeValueRaw;
	      var important = false;
	      var value;

	      this.scanner.skipSC();
	      this.eat(COLON$1);

	      const valueStart = this.scanner.tokenIndex;

	      if (!customProperty) {
	          this.scanner.skipSC();
	      }

	      if (parseValue) {
	          value = this.parseWithFallback(consumeValue, consumeRaw);
	      } else {
	          value = consumeRaw.call(this, this.scanner.tokenIndex);
	      }

	      if (customProperty && value.type === 'Value' && value.children.isEmpty()) {
	          for (let offset = valueStart - this.scanner.tokenIndex; offset <= 0; offset++) {
	              if (this.scanner.lookupType(offset) === WHITESPACE$6) {
	                  value.children.appendData({
	                      type: 'WhiteSpace',
	                      loc: null,
	                      value: ' '
	                  });
	                  break;
	              }
	          }
	      }

	      if (this.scanner.isDelim(EXCLAMATIONMARK$2)) {
	          important = getImportant.call(this);
	          this.scanner.skipSC();
	      }

	      // Do not include semicolon to range per spec
	      // https://drafts.csswg.org/css-syntax/#declaration-diagram

	      if (this.scanner.eof === false &&
	          this.scanner.tokenType !== SEMICOLON$3 &&
	          this.scanner.isBalanceEdge(startToken) === false) {
	          this.error();
	      }

	      return {
	          type: 'Declaration',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          important: important,
	          property: property,
	          value: value
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.property);
	      this.chunk(':');
	      this.node(node.value);

	      if (node.important) {
	          this.chunk(node.important === true ? '!important' : '!' + node.important);
	      }
	  },
	  walkContext: 'declaration'
	};

	function readProperty$1() {
	  var start = this.scanner.tokenStart;

	  // hacks
	  if (this.scanner.tokenType === DELIM$2) {
	      switch (this.scanner.source.charCodeAt(this.scanner.tokenStart)) {
	          case ASTERISK$3:
	          case DOLLARSIGN$1:
	          case PLUSSIGN$5:
	          case NUMBERSIGN$2:
	          case AMPERSAND$1:
	              this.scanner.next();
	              break;

	          // TODO: not sure we should support this hack
	          case SOLIDUS$2:
	              this.scanner.next();
	              if (this.scanner.isDelim(SOLIDUS$2)) {
	                  this.scanner.next();
	              }
	              break;
	      }
	  }

	  if (this.scanner.tokenType === HASH$1) {
	      this.eat(HASH$1);
	  } else {
	      this.eat(IDENT$7);
	  }

	  return this.scanner.substrToCursor(start);
	}

	// ! ws* important
	function getImportant() {
	  this.eat(DELIM$2);
	  this.scanner.skipSC();

	  var important = this.consume(IDENT$7);

	  // store original value in case it differ from `important`
	  // for better original source restoring and hacks like `!ie` support
	  return important === 'important' ? true : important;
	}

	var TYPE$k = tokenizer.TYPE;
	var rawMode$3 = Raw.mode;

	var WHITESPACE$7 = TYPE$k.WhiteSpace;
	var COMMENT$7 = TYPE$k.Comment;
	var SEMICOLON$4 = TYPE$k.Semicolon;

	function consumeRaw$2(startToken) {
	  return this.Raw(startToken, rawMode$3.semicolonIncluded, true);
	}

	var DeclarationList = {
	  name: 'DeclarationList',
	  structure: {
	      children: [[
	          'Declaration'
	      ]]
	  },
	  parse: function() {
	      var children = this.createList();

	      
	      while (!this.scanner.eof) {
	          switch (this.scanner.tokenType) {
	              case WHITESPACE$7:
	              case COMMENT$7:
	              case SEMICOLON$4:
	                  this.scanner.next();
	                  break;

	              default:
	                  children.push(this.parseWithFallback(this.Declaration, consumeRaw$2));
	          }
	      }

	      return {
	          type: 'DeclarationList',
	          loc: this.getLocationFromList(children),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node, function(prev) {
	          if (prev.type === 'Declaration') {
	              this.chunk(';');
	          }
	      });
	  }
	};

	var consumeNumber$3 = utils$1.consumeNumber;
	var TYPE$l = tokenizer.TYPE;

	var DIMENSION$3 = TYPE$l.Dimension;

	var Dimension = {
	  name: 'Dimension',
	  structure: {
	      value: String,
	      unit: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var numberEnd = consumeNumber$3(this.scanner.source, start);

	      this.eat(DIMENSION$3);

	      return {
	          type: 'Dimension',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          value: this.scanner.source.substring(start, numberEnd),
	          unit: this.scanner.source.substring(numberEnd, this.scanner.tokenStart)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	      this.chunk(node.unit);
	  }
	};

	var TYPE$m = tokenizer.TYPE;

	var RIGHTPARENTHESIS$2 = TYPE$m.RightParenthesis;

	// <function-token> <sequence> )
	var _Function = {
	  name: 'Function',
	  structure: {
	      name: String,
	      children: [[]]
	  },
	  parse: function(readSequence, recognizer) {
	      var start = this.scanner.tokenStart;
	      var name = this.consumeFunctionName();
	      var nameLowerCase = name.toLowerCase();
	      var children;

	      children = recognizer.hasOwnProperty(nameLowerCase)
	          ? recognizer[nameLowerCase].call(this, recognizer)
	          : readSequence.call(this, recognizer);

	      if (!this.scanner.eof) {
	          this.eat(RIGHTPARENTHESIS$2);
	      }

	      return {
	          type: 'Function',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: name,
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.name);
	      this.chunk('(');
	      this.children(node);
	      this.chunk(')');
	  },
	  walkContext: 'function'
	};

	var TYPE$n = tokenizer.TYPE;

	var HASH$2 = TYPE$n.Hash;

	// '#' ident
	var Hash = {
	  name: 'Hash',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;

	      this.eat(HASH$2);

	      return {
	          type: 'Hash',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          value: this.scanner.substrToCursor(start + 1)
	      };
	  },
	  generate: function(node) {
	      this.chunk('#');
	      this.chunk(node.value);
	  }
	};

	var TYPE$o = tokenizer.TYPE;

	var IDENT$8 = TYPE$o.Ident;

	var Identifier = {
	  name: 'Identifier',
	  structure: {
	      name: String
	  },
	  parse: function() {
	      return {
	          type: 'Identifier',
	          loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	          name: this.consume(IDENT$8)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.name);
	  }
	};

	var TYPE$p = tokenizer.TYPE;

	var HASH$3 = TYPE$p.Hash;

	// <hash-token>
	var IdSelector = {
	  name: 'IdSelector',
	  structure: {
	      name: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;

	      // TODO: check value is an ident
	      this.eat(HASH$3);

	      return {
	          type: 'IdSelector',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: this.scanner.substrToCursor(start + 1)
	      };
	  },
	  generate: function(node) {
	      this.chunk('#');
	      this.chunk(node.name);
	  }
	};

	var TYPE$q = tokenizer.TYPE;

	var IDENT$9 = TYPE$q.Ident;
	var NUMBER$4 = TYPE$q.Number;
	var DIMENSION$4 = TYPE$q.Dimension;
	var LEFTPARENTHESIS$2 = TYPE$q.LeftParenthesis;
	var RIGHTPARENTHESIS$3 = TYPE$q.RightParenthesis;
	var COLON$2 = TYPE$q.Colon;
	var DELIM$3 = TYPE$q.Delim;

	var MediaFeature = {
	  name: 'MediaFeature',
	  structure: {
	      name: String,
	      value: ['Identifier', 'Number', 'Dimension', 'Ratio', null]
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var name;
	      var value = null;

	      this.eat(LEFTPARENTHESIS$2);
	      this.scanner.skipSC();

	      name = this.consume(IDENT$9);
	      this.scanner.skipSC();

	      if (this.scanner.tokenType !== RIGHTPARENTHESIS$3) {
	          this.eat(COLON$2);
	          this.scanner.skipSC();

	          switch (this.scanner.tokenType) {
	              case NUMBER$4:
	                  if (this.lookupNonWSType(1) === DELIM$3) {
	                      value = this.Ratio();
	                  } else {
	                      value = this.Number();
	                  }

	                  break;

	              case DIMENSION$4:
	                  value = this.Dimension();
	                  break;

	              case IDENT$9:
	                  value = this.Identifier();

	                  break;

	              default:
	                  this.error('Number, dimension, ratio or identifier is expected');
	          }

	          this.scanner.skipSC();
	      }

	      this.eat(RIGHTPARENTHESIS$3);

	      return {
	          type: 'MediaFeature',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: name,
	          value: value
	      };
	  },
	  generate: function(node) {
	      this.chunk('(');
	      this.chunk(node.name);
	      if (node.value !== null) {
	          this.chunk(':');
	          this.node(node.value);
	      }
	      this.chunk(')');
	  }
	};

	var TYPE$r = tokenizer.TYPE;

	var WHITESPACE$8 = TYPE$r.WhiteSpace;
	var COMMENT$8 = TYPE$r.Comment;
	var IDENT$a = TYPE$r.Ident;
	var LEFTPARENTHESIS$3 = TYPE$r.LeftParenthesis;

	var MediaQuery = {
	  name: 'MediaQuery',
	  structure: {
	      children: [[
	          'Identifier',
	          'MediaFeature',
	          'WhiteSpace'
	      ]]
	  },
	  parse: function() {
	      this.scanner.skipSC();

	      var children = this.createList();
	      var child = null;
	      var space = null;

	      scan:
	      while (!this.scanner.eof) {
	          switch (this.scanner.tokenType) {
	              case COMMENT$8:
	                  this.scanner.next();
	                  continue;

	              case WHITESPACE$8:
	                  space = this.WhiteSpace();
	                  continue;

	              case IDENT$a:
	                  child = this.Identifier();
	                  break;

	              case LEFTPARENTHESIS$3:
	                  child = this.MediaFeature();
	                  break;

	              default:
	                  break scan;
	          }

	          if (space !== null) {
	              children.push(space);
	              space = null;
	          }

	          children.push(child);
	      }

	      if (child === null) {
	          this.error('Identifier or parenthesis is expected');
	      }

	      return {
	          type: 'MediaQuery',
	          loc: this.getLocationFromList(children),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node);
	  }
	};

	var COMMA$1 = tokenizer.TYPE.Comma;

	var MediaQueryList = {
	  name: 'MediaQueryList',
	  structure: {
	      children: [[
	          'MediaQuery'
	      ]]
	  },
	  parse: function(relative) {
	      var children = this.createList();

	      this.scanner.skipSC();

	      while (!this.scanner.eof) {
	          children.push(this.MediaQuery(relative));

	          if (this.scanner.tokenType !== COMMA$1) {
	              break;
	          }

	          this.scanner.next();
	      }

	      return {
	          type: 'MediaQueryList',
	          loc: this.getLocationFromList(children),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node, function() {
	          this.chunk(',');
	      });
	  }
	};

	var Nth = {
	  name: 'Nth',
	  structure: {
	      nth: ['AnPlusB', 'Identifier'],
	      selector: ['SelectorList', null]
	  },
	  parse: function(allowOfClause) {
	      this.scanner.skipSC();

	      var start = this.scanner.tokenStart;
	      var end = start;
	      var selector = null;
	      var query;

	      if (this.scanner.lookupValue(0, 'odd') || this.scanner.lookupValue(0, 'even')) {
	          query = this.Identifier();
	      } else {
	          query = this.AnPlusB();
	      }

	      this.scanner.skipSC();

	      if (allowOfClause && this.scanner.lookupValue(0, 'of')) {
	          this.scanner.next();

	          selector = this.SelectorList();

	          if (this.needPositions) {
	              end = this.getLastListNode(selector.children).loc.end.offset;
	          }
	      } else {
	          if (this.needPositions) {
	              end = query.loc.end.offset;
	          }
	      }

	      return {
	          type: 'Nth',
	          loc: this.getLocation(start, end),
	          nth: query,
	          selector: selector
	      };
	  },
	  generate: function(node) {
	      this.node(node.nth);
	      if (node.selector !== null) {
	          this.chunk(' of ');
	          this.node(node.selector);
	      }
	  }
	};

	var NUMBER$5 = tokenizer.TYPE.Number;

	var _Number = {
	  name: 'Number',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      return {
	          type: 'Number',
	          loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	          value: this.consume(NUMBER$5)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	  }
	};

	// '/' | '*' | ',' | ':' | '+' | '-'
	var Operator = {
	  name: 'Operator',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;

	      this.scanner.next();

	      return {
	          type: 'Operator',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          value: this.scanner.substrToCursor(start)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	  }
	};

	var TYPE$s = tokenizer.TYPE;

	var LEFTPARENTHESIS$4 = TYPE$s.LeftParenthesis;
	var RIGHTPARENTHESIS$4 = TYPE$s.RightParenthesis;

	var Parentheses = {
	  name: 'Parentheses',
	  structure: {
	      children: [[]]
	  },
	  parse: function(readSequence, recognizer) {
	      var start = this.scanner.tokenStart;
	      var children = null;

	      this.eat(LEFTPARENTHESIS$4);

	      children = readSequence.call(this, recognizer);

	      if (!this.scanner.eof) {
	          this.eat(RIGHTPARENTHESIS$4);
	      }

	      return {
	          type: 'Parentheses',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.chunk('(');
	      this.children(node);
	      this.chunk(')');
	  }
	};

	var consumeNumber$4 = utils$1.consumeNumber;
	var TYPE$t = tokenizer.TYPE;

	var PERCENTAGE$1 = TYPE$t.Percentage;

	var Percentage = {
	  name: 'Percentage',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var numberEnd = consumeNumber$4(this.scanner.source, start);

	      this.eat(PERCENTAGE$1);

	      return {
	          type: 'Percentage',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          value: this.scanner.source.substring(start, numberEnd)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	      this.chunk('%');
	  }
	};

	var TYPE$u = tokenizer.TYPE;

	var IDENT$b = TYPE$u.Ident;
	var FUNCTION$1 = TYPE$u.Function;
	var COLON$3 = TYPE$u.Colon;
	var RIGHTPARENTHESIS$5 = TYPE$u.RightParenthesis;

	// : [ <ident> | <function-token> <any-value>? ) ]
	var PseudoClassSelector = {
	  name: 'PseudoClassSelector',
	  structure: {
	      name: String,
	      children: [['Raw'], null]
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var children = null;
	      var name;
	      var nameLowerCase;

	      this.eat(COLON$3);

	      if (this.scanner.tokenType === FUNCTION$1) {
	          name = this.consumeFunctionName();
	          nameLowerCase = name.toLowerCase();

	          if (this.pseudo.hasOwnProperty(nameLowerCase)) {
	              this.scanner.skipSC();
	              children = this.pseudo[nameLowerCase].call(this);
	              this.scanner.skipSC();
	          } else {
	              children = this.createList();
	              children.push(
	                  this.Raw(this.scanner.tokenIndex, null, false)
	              );
	          }

	          this.eat(RIGHTPARENTHESIS$5);
	      } else {
	          name = this.consume(IDENT$b);
	      }

	      return {
	          type: 'PseudoClassSelector',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: name,
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.chunk(':');
	      this.chunk(node.name);

	      if (node.children !== null) {
	          this.chunk('(');
	          this.children(node);
	          this.chunk(')');
	      }
	  },
	  walkContext: 'function'
	};

	var TYPE$v = tokenizer.TYPE;

	var IDENT$c = TYPE$v.Ident;
	var FUNCTION$2 = TYPE$v.Function;
	var COLON$4 = TYPE$v.Colon;
	var RIGHTPARENTHESIS$6 = TYPE$v.RightParenthesis;

	// :: [ <ident> | <function-token> <any-value>? ) ]
	var PseudoElementSelector = {
	  name: 'PseudoElementSelector',
	  structure: {
	      name: String,
	      children: [['Raw'], null]
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var children = null;
	      var name;
	      var nameLowerCase;

	      this.eat(COLON$4);
	      this.eat(COLON$4);

	      if (this.scanner.tokenType === FUNCTION$2) {
	          name = this.consumeFunctionName();
	          nameLowerCase = name.toLowerCase();

	          if (this.pseudo.hasOwnProperty(nameLowerCase)) {
	              this.scanner.skipSC();
	              children = this.pseudo[nameLowerCase].call(this);
	              this.scanner.skipSC();
	          } else {
	              children = this.createList();
	              children.push(
	                  this.Raw(this.scanner.tokenIndex, null, false)
	              );
	          }

	          this.eat(RIGHTPARENTHESIS$6);
	      } else {
	          name = this.consume(IDENT$c);
	      }

	      return {
	          type: 'PseudoElementSelector',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: name,
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.chunk('::');
	      this.chunk(node.name);

	      if (node.children !== null) {
	          this.chunk('(');
	          this.children(node);
	          this.chunk(')');
	      }
	  },
	  walkContext: 'function'
	};

	var isDigit$5 = tokenizer.isDigit;
	var TYPE$w = tokenizer.TYPE;

	var NUMBER$6 = TYPE$w.Number;
	var DELIM$4 = TYPE$w.Delim;
	var SOLIDUS$3 = 0x002F;  // U+002F SOLIDUS (/)
	var FULLSTOP$1 = 0x002E; // U+002E FULL STOP (.)

	// Terms of <ratio> should be a positive numbers (not zero or negative)
	// (see https://drafts.csswg.org/mediaqueries-3/#values)
	// However, -o-min-device-pixel-ratio takes fractional values as a ratio's term
	// and this is using by various sites. Therefore we relax checking on parse
	// to test a term is unsigned number without an exponent part.
	// Additional checking may be applied on lexer validation.
	function consumeNumber$5() {
	  this.scanner.skipWS();

	  var value = this.consume(NUMBER$6);

	  for (var i = 0; i < value.length; i++) {
	      var code = value.charCodeAt(i);
	      if (!isDigit$5(code) && code !== FULLSTOP$1) {
	          this.error('Unsigned number is expected', this.scanner.tokenStart - value.length + i);
	      }
	  }

	  if (Number(value) === 0) {
	      this.error('Zero number is not allowed', this.scanner.tokenStart - value.length);
	  }

	  return value;
	}

	// <positive-integer> S* '/' S* <positive-integer>
	var Ratio = {
	  name: 'Ratio',
	  structure: {
	      left: String,
	      right: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var left = consumeNumber$5.call(this);
	      var right;

	      this.scanner.skipWS();

	      if (!this.scanner.isDelim(SOLIDUS$3)) {
	          this.error('Solidus is expected');
	      }
	      this.eat(DELIM$4);
	      right = consumeNumber$5.call(this);

	      return {
	          type: 'Ratio',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          left: left,
	          right: right
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.left);
	      this.chunk('/');
	      this.chunk(node.right);
	  }
	};

	var TYPE$x = tokenizer.TYPE;
	var rawMode$4 = Raw.mode;

	var LEFTCURLYBRACKET$4 = TYPE$x.LeftCurlyBracket;

	function consumeRaw$3(startToken) {
	  return this.Raw(startToken, rawMode$4.leftCurlyBracket, true);
	}

	function consumePrelude() {
	  var prelude = this.SelectorList();

	  if (prelude.type !== 'Raw' &&
	      this.scanner.eof === false &&
	      this.scanner.tokenType !== LEFTCURLYBRACKET$4) {
	      this.error();
	  }

	  return prelude;
	}

	var Rule = {
	  name: 'Rule',
	  structure: {
	      prelude: ['SelectorList', 'Raw'],
	      block: ['Block']
	  },
	  parse: function() {
	      var startToken = this.scanner.tokenIndex;
	      var startOffset = this.scanner.tokenStart;
	      var prelude;
	      var block;

	      if (this.parseRulePrelude) {
	          prelude = this.parseWithFallback(consumePrelude, consumeRaw$3);
	      } else {
	          prelude = consumeRaw$3.call(this, startToken);
	      }

	      block = this.Block(true);

	      return {
	          type: 'Rule',
	          loc: this.getLocation(startOffset, this.scanner.tokenStart),
	          prelude: prelude,
	          block: block
	      };
	  },
	  generate: function(node) {
	      this.node(node.prelude);
	      this.node(node.block);
	  },
	  walkContext: 'rule'
	};

	var Selector = {
	  name: 'Selector',
	  structure: {
	      children: [[
	          'TypeSelector',
	          'IdSelector',
	          'ClassSelector',
	          'AttributeSelector',
	          'PseudoClassSelector',
	          'PseudoElementSelector',
	          'Combinator',
	          'WhiteSpace'
	      ]]
	  },
	  parse: function() {
	      var children = this.readSequence(this.scope.Selector);

	      // nothing were consumed
	      if (this.getFirstListNode(children) === null) {
	          this.error('Selector is expected');
	      }

	      return {
	          type: 'Selector',
	          loc: this.getLocationFromList(children),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node);
	  }
	};

	var TYPE$y = tokenizer.TYPE;

	var COMMA$2 = TYPE$y.Comma;

	var SelectorList = {
	  name: 'SelectorList',
	  structure: {
	      children: [[
	          'Selector',
	          'Raw'
	      ]]
	  },
	  parse: function() {
	      var children = this.createList();

	      while (!this.scanner.eof) {
	          children.push(this.Selector());

	          if (this.scanner.tokenType === COMMA$2) {
	              this.scanner.next();
	              continue;
	          }

	          break;
	      }

	      return {
	          type: 'SelectorList',
	          loc: this.getLocationFromList(children),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node, function() {
	          this.chunk(',');
	      });
	  },
	  walkContext: 'selector'
	};

	var STRING$1 = tokenizer.TYPE.String;

	var _String = {
	  name: 'String',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      return {
	          type: 'String',
	          loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	          value: this.consume(STRING$1)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	  }
	};

	var TYPE$z = tokenizer.TYPE;

	var WHITESPACE$9 = TYPE$z.WhiteSpace;
	var COMMENT$9 = TYPE$z.Comment;
	var ATKEYWORD$2 = TYPE$z.AtKeyword;
	var CDO$1 = TYPE$z.CDO;
	var CDC$1 = TYPE$z.CDC;
	var EXCLAMATIONMARK$3 = 0x0021; // U+0021 EXCLAMATION MARK (!)

	function consumeRaw$4(startToken) {
	  return this.Raw(startToken, null, false);
	}

	var StyleSheet = {
	  name: 'StyleSheet',
	  structure: {
	      children: [[
	          'Comment',
	          'CDO',
	          'CDC',
	          'Atrule',
	          'Rule',
	          'Raw'
	      ]]
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var children = this.createList();
	      var child;

	      
	      while (!this.scanner.eof) {
	          switch (this.scanner.tokenType) {
	              case WHITESPACE$9:
	                  this.scanner.next();
	                  continue;

	              case COMMENT$9:
	                  // ignore comments except exclamation comments (i.e. /*! .. */) on top level
	                  if (this.scanner.source.charCodeAt(this.scanner.tokenStart + 2) !== EXCLAMATIONMARK$3) {
	                      this.scanner.next();
	                      continue;
	                  }

	                  child = this.Comment();
	                  break;

	              case CDO$1: // <!--
	                  child = this.CDO();
	                  break;

	              case CDC$1: // -->
	                  child = this.CDC();
	                  break;

	              // CSS Syntax Module Level 3
	              // §2.2 Error handling
	              // At the "top level" of a stylesheet, an <at-keyword-token> starts an at-rule.
	              case ATKEYWORD$2:
	                  child = this.parseWithFallback(this.Atrule, consumeRaw$4);
	                  break;

	              // Anything else starts a qualified rule ...
	              default:
	                  child = this.parseWithFallback(this.Rule, consumeRaw$4);
	          }

	          children.push(child);
	      }

	      return {
	          type: 'StyleSheet',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node);
	  },
	  walkContext: 'stylesheet'
	};

	var TYPE$A = tokenizer.TYPE;

	var IDENT$d = TYPE$A.Ident;
	var ASTERISK$4 = 0x002A;     // U+002A ASTERISK (*)
	var VERTICALLINE$2 = 0x007C; // U+007C VERTICAL LINE (|)

	function eatIdentifierOrAsterisk() {
	  if (this.scanner.tokenType !== IDENT$d &&
	      this.scanner.isDelim(ASTERISK$4) === false) {
	      this.error('Identifier or asterisk is expected');
	  }

	  this.scanner.next();
	}

	// ident
	// ident|ident
	// ident|*
	// *
	// *|ident
	// *|*
	// |ident
	// |*
	var TypeSelector = {
	  name: 'TypeSelector',
	  structure: {
	      name: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;

	      if (this.scanner.isDelim(VERTICALLINE$2)) {
	          this.scanner.next();
	          eatIdentifierOrAsterisk.call(this);
	      } else {
	          eatIdentifierOrAsterisk.call(this);

	          if (this.scanner.isDelim(VERTICALLINE$2)) {
	              this.scanner.next();
	              eatIdentifierOrAsterisk.call(this);
	          }
	      }

	      return {
	          type: 'TypeSelector',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          name: this.scanner.substrToCursor(start)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.name);
	  }
	};

	var isHexDigit$4 = tokenizer.isHexDigit;
	var cmpChar$4 = tokenizer.cmpChar;
	var TYPE$B = tokenizer.TYPE;
	var NAME$3 = tokenizer.NAME;

	var IDENT$e = TYPE$B.Ident;
	var NUMBER$7 = TYPE$B.Number;
	var DIMENSION$5 = TYPE$B.Dimension;
	var PLUSSIGN$6 = 0x002B;     // U+002B PLUS SIGN (+)
	var HYPHENMINUS$4 = 0x002D;  // U+002D HYPHEN-MINUS (-)
	var QUESTIONMARK$2 = 0x003F; // U+003F QUESTION MARK (?)
	var U$1 = 0x0075;            // U+0075 LATIN SMALL LETTER U (u)

	function eatHexSequence(offset, allowDash) {
	  for (var pos = this.scanner.tokenStart + offset, len = 0; pos < this.scanner.tokenEnd; pos++) {
	      var code = this.scanner.source.charCodeAt(pos);

	      if (code === HYPHENMINUS$4 && allowDash && len !== 0) {
	          if (eatHexSequence.call(this, offset + len + 1, false) === 0) {
	              this.error();
	          }

	          return -1;
	      }

	      if (!isHexDigit$4(code)) {
	          this.error(
	              allowDash && len !== 0
	                  ? 'HyphenMinus' + (len < 6 ? ' or hex digit' : '') + ' is expected'
	                  : (len < 6 ? 'Hex digit is expected' : 'Unexpected input'),
	              pos
	          );
	      }

	      if (++len > 6) {
	          this.error('Too many hex digits', pos);
	      }    }

	  this.scanner.next();
	  return len;
	}

	function eatQuestionMarkSequence(max) {
	  var count = 0;

	  while (this.scanner.isDelim(QUESTIONMARK$2)) {
	      if (++count > max) {
	          this.error('Too many question marks');
	      }

	      this.scanner.next();
	  }
	}

	function startsWith$1(code) {
	  if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== code) {
	      this.error(NAME$3[code] + ' is expected');
	  }
	}

	// https://drafts.csswg.org/css-syntax/#urange
	// Informally, the <urange> production has three forms:
	// U+0001
	//      Defines a range consisting of a single code point, in this case the code point "1".
	// U+0001-00ff
	//      Defines a range of codepoints between the first and the second value, in this case
	//      the range between "1" and "ff" (255 in decimal) inclusive.
	// U+00??
	//      Defines a range of codepoints where the "?" characters range over all hex digits,
	//      in this case defining the same as the value U+0000-00ff.
	// In each form, a maximum of 6 digits is allowed for each hexadecimal number (if you treat "?" as a hexadecimal digit).
	//
	// <urange> =
	//   u '+' <ident-token> '?'* |
	//   u <dimension-token> '?'* |
	//   u <number-token> '?'* |
	//   u <number-token> <dimension-token> |
	//   u <number-token> <number-token> |
	//   u '+' '?'+
	function scanUnicodeRange() {
	  var hexLength = 0;

	  // u '+' <ident-token> '?'*
	  // u '+' '?'+
	  if (this.scanner.isDelim(PLUSSIGN$6)) {
	      this.scanner.next();

	      if (this.scanner.tokenType === IDENT$e) {
	          hexLength = eatHexSequence.call(this, 0, true);
	          if (hexLength > 0) {
	              eatQuestionMarkSequence.call(this, 6 - hexLength);
	          }
	          return;
	      }

	      if (this.scanner.isDelim(QUESTIONMARK$2)) {
	          this.scanner.next();
	          eatQuestionMarkSequence.call(this, 5);
	          return;
	      }

	      this.error('Hex digit or question mark is expected');
	      return;
	  }

	  // u <number-token> '?'*
	  // u <number-token> <dimension-token>
	  // u <number-token> <number-token>
	  if (this.scanner.tokenType === NUMBER$7) {
	      startsWith$1.call(this, PLUSSIGN$6);
	      hexLength = eatHexSequence.call(this, 1, true);

	      if (this.scanner.isDelim(QUESTIONMARK$2)) {
	          eatQuestionMarkSequence.call(this, 6 - hexLength);
	          return;
	      }

	      if (this.scanner.tokenType === DIMENSION$5 ||
	          this.scanner.tokenType === NUMBER$7) {
	          startsWith$1.call(this, HYPHENMINUS$4);
	          eatHexSequence.call(this, 1, false);
	          return;
	      }

	      return;
	  }

	  // u <dimension-token> '?'*
	  if (this.scanner.tokenType === DIMENSION$5) {
	      startsWith$1.call(this, PLUSSIGN$6);
	      hexLength = eatHexSequence.call(this, 1, true);

	      if (hexLength > 0) {
	          eatQuestionMarkSequence.call(this, 6 - hexLength);
	      }

	      return;
	  }

	  this.error();
	}

	var UnicodeRange = {
	  name: 'UnicodeRange',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;

	      // U or u
	      if (!cmpChar$4(this.scanner.source, start, U$1)) {
	          this.error('U is expected');
	      }

	      if (!cmpChar$4(this.scanner.source, start + 1, PLUSSIGN$6)) {
	          this.error('Plus sign is expected');
	      }

	      this.scanner.next();
	      scanUnicodeRange.call(this);

	      return {
	          type: 'UnicodeRange',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          value: this.scanner.substrToCursor(start)
	      };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	  }
	};

	var isWhiteSpace$2 = tokenizer.isWhiteSpace;
	var cmpStr$5 = tokenizer.cmpStr;
	var TYPE$C = tokenizer.TYPE;

	var FUNCTION$3 = TYPE$C.Function;
	var URL$1$1 = TYPE$C.Url;
	var RIGHTPARENTHESIS$7 = TYPE$C.RightParenthesis;

	// <url-token> | <function-token> <string> )
	var Url = {
	  name: 'Url',
	  structure: {
	      value: ['String', 'Raw']
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var value;

	      switch (this.scanner.tokenType) {
	          case URL$1$1:
	              var rawStart = start + 4;
	              var rawEnd = this.scanner.tokenEnd - 1;

	              while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawStart))) {
	                  rawStart++;
	              }

	              while (rawStart < rawEnd && isWhiteSpace$2(this.scanner.source.charCodeAt(rawEnd - 1))) {
	                  rawEnd--;
	              }

	              value = {
	                  type: 'Raw',
	                  loc: this.getLocation(rawStart, rawEnd),
	                  value: this.scanner.source.substring(rawStart, rawEnd)
	              };

	              this.eat(URL$1$1);
	              break;

	          case FUNCTION$3:
	              if (!cmpStr$5(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')) {
	                  this.error('Function name must be `url`');
	              }

	              this.eat(FUNCTION$3);
	              this.scanner.skipSC();
	              value = this.String();
	              this.scanner.skipSC();
	              this.eat(RIGHTPARENTHESIS$7);
	              break;

	          default:
	              this.error('Url or Function is expected');
	      }

	      return {
	          type: 'Url',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          value: value
	      };
	  },
	  generate: function(node) {
	      this.chunk('url');
	      this.chunk('(');
	      this.node(node.value);
	      this.chunk(')');
	  }
	};

	var Value = {
	  name: 'Value',
	  structure: {
	      children: [[]]
	  },
	  parse: function() {
	      var start = this.scanner.tokenStart;
	      var children = this.readSequence(this.scope.Value);

	      return {
	          type: 'Value',
	          loc: this.getLocation(start, this.scanner.tokenStart),
	          children: children
	      };
	  },
	  generate: function(node) {
	      this.children(node);
	  }
	};

	var WHITESPACE$a = tokenizer.TYPE.WhiteSpace;
	var SPACE$2 = Object.freeze({
	  type: 'WhiteSpace',
	  loc: null,
	  value: ' '
	});

	var WhiteSpace$1 = {
	  name: 'WhiteSpace',
	  structure: {
	      value: String
	  },
	  parse: function() {
	      this.eat(WHITESPACE$a);
	      return SPACE$2;

	      // return {
	      //     type: 'WhiteSpace',
	      //     loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
	      //     value: this.consume(WHITESPACE)
	      // };
	  },
	  generate: function(node) {
	      this.chunk(node.value);
	  }
	};

	var node = {
	  AnPlusB: AnPlusB,
	  Atrule: Atrule,
	  AtrulePrelude: AtrulePrelude,
	  AttributeSelector: AttributeSelector,
	  Block: Block,
	  Brackets: Brackets,
	  CDC: CDC_1,
	  CDO: CDO_1,
	  ClassSelector: ClassSelector,
	  Combinator: Combinator,
	  Comment: Comment,
	  Declaration: Declaration,
	  DeclarationList: DeclarationList,
	  Dimension: Dimension,
	  Function: _Function,
	  Hash: Hash,
	  Identifier: Identifier,
	  IdSelector: IdSelector,
	  MediaFeature: MediaFeature,
	  MediaQuery: MediaQuery,
	  MediaQueryList: MediaQueryList,
	  Nth: Nth,
	  Number: _Number,
	  Operator: Operator,
	  Parentheses: Parentheses,
	  Percentage: Percentage,
	  PseudoClassSelector: PseudoClassSelector,
	  PseudoElementSelector: PseudoElementSelector,
	  Ratio: Ratio,
	  Raw: Raw,
	  Rule: Rule,
	  Selector: Selector,
	  SelectorList: SelectorList,
	  String: _String,
	  StyleSheet: StyleSheet,
	  TypeSelector: TypeSelector,
	  UnicodeRange: UnicodeRange,
	  Url: Url,
	  Value: Value,
	  WhiteSpace: WhiteSpace$1
	};

	var lexer = {
	  generic: true,
	  types: data.types,
	  atrules: data.atrules,
	  properties: data.properties,
	  node: node
	};

	var cmpChar$5 = tokenizer.cmpChar;
	var cmpStr$6 = tokenizer.cmpStr;
	var TYPE$D = tokenizer.TYPE;

	var IDENT$f = TYPE$D.Ident;
	var STRING$2 = TYPE$D.String;
	var NUMBER$8 = TYPE$D.Number;
	var FUNCTION$4 = TYPE$D.Function;
	var URL$2 = TYPE$D.Url;
	var HASH$4 = TYPE$D.Hash;
	var DIMENSION$6 = TYPE$D.Dimension;
	var PERCENTAGE$2 = TYPE$D.Percentage;
	var LEFTPARENTHESIS$5 = TYPE$D.LeftParenthesis;
	var LEFTSQUAREBRACKET$3 = TYPE$D.LeftSquareBracket;
	var COMMA$3 = TYPE$D.Comma;
	var DELIM$5 = TYPE$D.Delim;
	var NUMBERSIGN$3 = 0x0023;  // U+0023 NUMBER SIGN (#)
	var ASTERISK$5 = 0x002A;    // U+002A ASTERISK (*)
	var PLUSSIGN$7 = 0x002B;    // U+002B PLUS SIGN (+)
	var HYPHENMINUS$5 = 0x002D; // U+002D HYPHEN-MINUS (-)
	var SOLIDUS$4 = 0x002F;     // U+002F SOLIDUS (/)
	var U$2 = 0x0075;           // U+0075 LATIN SMALL LETTER U (u)

	var _default = function defaultRecognizer(context) {
	  switch (this.scanner.tokenType) {
	      case HASH$4:
	          return this.Hash();

	      case COMMA$3:
	          context.space = null;
	          context.ignoreWSAfter = true;
	          return this.Operator();

	      case LEFTPARENTHESIS$5:
	          return this.Parentheses(this.readSequence, context.recognizer);

	      case LEFTSQUAREBRACKET$3:
	          return this.Brackets(this.readSequence, context.recognizer);

	      case STRING$2:
	          return this.String();

	      case DIMENSION$6:
	          return this.Dimension();

	      case PERCENTAGE$2:
	          return this.Percentage();

	      case NUMBER$8:
	          return this.Number();

	      case FUNCTION$4:
	          return cmpStr$6(this.scanner.source, this.scanner.tokenStart, this.scanner.tokenEnd, 'url(')
	              ? this.Url()
	              : this.Function(this.readSequence, context.recognizer);

	      case URL$2:
	          return this.Url();

	      case IDENT$f:
	          // check for unicode range, it should start with u+ or U+
	          if (cmpChar$5(this.scanner.source, this.scanner.tokenStart, U$2) &&
	              cmpChar$5(this.scanner.source, this.scanner.tokenStart + 1, PLUSSIGN$7)) {
	              return this.UnicodeRange();
	          } else {
	              return this.Identifier();
	          }

	      case DELIM$5:
	          var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

	          if (code === SOLIDUS$4 ||
	              code === ASTERISK$5 ||
	              code === PLUSSIGN$7 ||
	              code === HYPHENMINUS$5) {
	              return this.Operator(); // TODO: replace with Delim
	          }

	          // TODO: produce a node with Delim node type

	          if (code === NUMBERSIGN$3) {
	              this.error('Hex or identifier is expected', this.scanner.tokenStart + 1);
	          }

	          break;
	  }
	};

	var atrulePrelude = {
	  getNode: _default
	};

	var TYPE$E = tokenizer.TYPE;

	var DELIM$6 = TYPE$E.Delim;
	var IDENT$g = TYPE$E.Ident;
	var DIMENSION$7 = TYPE$E.Dimension;
	var PERCENTAGE$3 = TYPE$E.Percentage;
	var NUMBER$9 = TYPE$E.Number;
	var HASH$5 = TYPE$E.Hash;
	var COLON$5 = TYPE$E.Colon;
	var LEFTSQUAREBRACKET$4 = TYPE$E.LeftSquareBracket;
	var NUMBERSIGN$4 = 0x0023;      // U+0023 NUMBER SIGN (#)
	var ASTERISK$6 = 0x002A;        // U+002A ASTERISK (*)
	var PLUSSIGN$8 = 0x002B;        // U+002B PLUS SIGN (+)
	var SOLIDUS$5 = 0x002F;         // U+002F SOLIDUS (/)
	var FULLSTOP$2 = 0x002E;        // U+002E FULL STOP (.)
	var GREATERTHANSIGN$2 = 0x003E; // U+003E GREATER-THAN SIGN (>)
	var VERTICALLINE$3 = 0x007C;    // U+007C VERTICAL LINE (|)
	var TILDE$2 = 0x007E;           // U+007E TILDE (~)

	function getNode(context) {
	  switch (this.scanner.tokenType) {
	      case LEFTSQUAREBRACKET$4:
	          return this.AttributeSelector();

	      case HASH$5:
	          return this.IdSelector();

	      case COLON$5:
	          if (this.scanner.lookupType(1) === COLON$5) {
	              return this.PseudoElementSelector();
	          } else {
	              return this.PseudoClassSelector();
	          }

	      case IDENT$g:
	          return this.TypeSelector();

	      case NUMBER$9:
	      case PERCENTAGE$3:
	          return this.Percentage();

	      case DIMENSION$7:
	          // throws when .123ident
	          if (this.scanner.source.charCodeAt(this.scanner.tokenStart) === FULLSTOP$2) {
	              this.error('Identifier is expected', this.scanner.tokenStart + 1);
	          }
	          break;

	      case DELIM$6:
	          var code = this.scanner.source.charCodeAt(this.scanner.tokenStart);

	          switch (code) {
	              case PLUSSIGN$8:
	              case GREATERTHANSIGN$2:
	              case TILDE$2:
	                  context.space = null;
	                  context.ignoreWSAfter = true;
	                  return this.Combinator();

	              case SOLIDUS$5:  // /deep/
	                  return this.Combinator();

	              case FULLSTOP$2:
	                  return this.ClassSelector();

	              case ASTERISK$6:
	              case VERTICALLINE$3:
	                  return this.TypeSelector();

	              case NUMBERSIGN$4:
	                  return this.IdSelector();
	          }

	          break;
	  }
	}
	var selector = {
	  getNode: getNode
	};

	// legacy IE function
	// expression( <any-value> )
	var expression = function() {
	  return this.createSingleNodeList(
	      this.Raw(this.scanner.tokenIndex, null, false)
	  );
	};

	var TYPE$F = tokenizer.TYPE;
	var rawMode$5 = Raw.mode;

	var COMMA$4 = TYPE$F.Comma;
	var WHITESPACE$b = TYPE$F.WhiteSpace;

	// var( <ident> , <value>? )
	var _var = function() {
	  var children = this.createList();

	  this.scanner.skipSC();

	  // NOTE: Don't check more than a first argument is an ident, rest checks are for lexer
	  children.push(this.Identifier());

	  this.scanner.skipSC();

	  if (this.scanner.tokenType === COMMA$4) {
	      children.push(this.Operator());

	      const startIndex = this.scanner.tokenIndex;
	      const value = this.parseCustomProperty
	          ? this.Value(null)
	          : this.Raw(this.scanner.tokenIndex, rawMode$5.exclamationMarkOrSemicolon, false);

	      if (value.type === 'Value' && value.children.isEmpty()) {
	          for (let offset = startIndex - this.scanner.tokenIndex; offset <= 0; offset++) {
	              if (this.scanner.lookupType(offset) === WHITESPACE$b) {
	                  value.children.appendData({
	                      type: 'WhiteSpace',
	                      loc: null,
	                      value: ' '
	                  });
	                  break;
	              }
	          }
	      }

	      children.push(value);
	  }

	  return children;
	};

	var value = {
	  getNode: _default,
	  'expression': expression,
	  'var': _var
	};

	var scope = {
	  AtrulePrelude: atrulePrelude,
	  Selector: selector,
	  Value: value
	};

	var fontFace = {
	  parse: {
	      prelude: null,
	      block: function() {
	          return this.Block(true);
	      }
	  }
	};

	var TYPE$G = tokenizer.TYPE;

	var STRING$3 = TYPE$G.String;
	var IDENT$h = TYPE$G.Ident;
	var URL$3 = TYPE$G.Url;
	var FUNCTION$5 = TYPE$G.Function;
	var LEFTPARENTHESIS$6 = TYPE$G.LeftParenthesis;

	var _import = {
	  parse: {
	      prelude: function() {
	          var children = this.createList();

	          this.scanner.skipSC();

	          switch (this.scanner.tokenType) {
	              case STRING$3:
	                  children.push(this.String());
	                  break;

	              case URL$3:
	              case FUNCTION$5:
	                  children.push(this.Url());
	                  break;

	              default:
	                  this.error('String or url() is expected');
	          }

	          if (this.lookupNonWSType(0) === IDENT$h ||
	              this.lookupNonWSType(0) === LEFTPARENTHESIS$6) {
	              children.push(this.WhiteSpace());
	              children.push(this.MediaQueryList());
	          }

	          return children;
	      },
	      block: null
	  }
	};

	var media = {
	  parse: {
	      prelude: function() {
	          return this.createSingleNodeList(
	              this.MediaQueryList()
	          );
	      },
	      block: function() {
	          return this.Block(false);
	      }
	  }
	};

	var page = {
	  parse: {
	      prelude: function() {
	          return this.createSingleNodeList(
	              this.SelectorList()
	          );
	      },
	      block: function() {
	          return this.Block(true);
	      }
	  }
	};

	var TYPE$H = tokenizer.TYPE;

	var WHITESPACE$c = TYPE$H.WhiteSpace;
	var COMMENT$a = TYPE$H.Comment;
	var IDENT$i = TYPE$H.Ident;
	var FUNCTION$6 = TYPE$H.Function;
	var COLON$6 = TYPE$H.Colon;
	var LEFTPARENTHESIS$7 = TYPE$H.LeftParenthesis;

	function consumeRaw$5() {
	  return this.createSingleNodeList(
	      this.Raw(this.scanner.tokenIndex, null, false)
	  );
	}

	function parentheses() {
	  this.scanner.skipSC();

	  if (this.scanner.tokenType === IDENT$i &&
	      this.lookupNonWSType(1) === COLON$6) {
	      return this.createSingleNodeList(
	          this.Declaration()
	      );
	  }

	  return readSequence.call(this);
	}

	function readSequence() {
	  var children = this.createList();
	  var space = null;
	  var child;

	  this.scanner.skipSC();

	  scan:
	  while (!this.scanner.eof) {
	      switch (this.scanner.tokenType) {
	          case WHITESPACE$c:
	              space = this.WhiteSpace();
	              continue;

	          case COMMENT$a:
	              this.scanner.next();
	              continue;

	          case FUNCTION$6:
	              child = this.Function(consumeRaw$5, this.scope.AtrulePrelude);
	              break;

	          case IDENT$i:
	              child = this.Identifier();
	              break;

	          case LEFTPARENTHESIS$7:
	              child = this.Parentheses(parentheses, this.scope.AtrulePrelude);
	              break;

	          default:
	              break scan;
	      }

	      if (space !== null) {
	          children.push(space);
	          space = null;
	      }

	      children.push(child);
	  }

	  return children;
	}

	var supports = {
	  parse: {
	      prelude: function() {
	          var children = readSequence.call(this);

	          if (this.getFirstListNode(children) === null) {
	              this.error('Condition is expected');
	          }

	          return children;
	      },
	      block: function() {
	          return this.Block(false);
	      }
	  }
	};

	var atrule = {
	  'font-face': fontFace,
	  'import': _import,
	  'media': media,
	  'page': page,
	  'supports': supports
	};

	var dir = {
	  parse: function() {
	      return this.createSingleNodeList(
	          this.Identifier()
	      );
	  }
	};

	var has$1 = {
	  parse: function() {
	      return this.createSingleNodeList(
	          this.SelectorList()
	      );
	  }
	};

	var lang = {
	  parse: function() {
	      return this.createSingleNodeList(
	          this.Identifier()
	      );
	  }
	};

	var selectorList = {
	  parse: function selectorList() {
	      return this.createSingleNodeList(
	          this.SelectorList()
	      );
	  }
	};

	var matches = selectorList;

	var not = selectorList;

	var ALLOW_OF_CLAUSE = true;

	var nthWithOfClause = {
	  parse: function nthWithOfClause() {
	      return this.createSingleNodeList(
	          this.Nth(ALLOW_OF_CLAUSE)
	      );
	  }
	};

	var nthChild = nthWithOfClause;

	var nthLastChild = nthWithOfClause;

	var DISALLOW_OF_CLAUSE = false;

	var nth = {
	  parse: function nth() {
	      return this.createSingleNodeList(
	          this.Nth(DISALLOW_OF_CLAUSE)
	      );
	  }
	};

	var nthLastOfType = nth;

	var nthOfType = nth;

	var slotted = {
	  parse: function compoundSelector() {
	      return this.createSingleNodeList(
	          this.Selector()
	      );
	  }
	};

	var pseudo = {
	  'dir': dir,
	  'has': has$1,
	  'lang': lang,
	  'matches': matches,
	  'not': not,
	  'nth-child': nthChild,
	  'nth-last-child': nthLastChild,
	  'nth-last-of-type': nthLastOfType,
	  'nth-of-type': nthOfType,
	  'slotted': slotted
	};

	var parser$1 = {
	  parseContext: {
	      default: 'StyleSheet',
	      stylesheet: 'StyleSheet',
	      atrule: 'Atrule',
	      atrulePrelude: function(options) {
	          return this.AtrulePrelude(options.atrule ? String(options.atrule) : null);
	      },
	      mediaQueryList: 'MediaQueryList',
	      mediaQuery: 'MediaQuery',
	      rule: 'Rule',
	      selectorList: 'SelectorList',
	      selector: 'Selector',
	      block: function() {
	          return this.Block(true);
	      },
	      declarationList: 'DeclarationList',
	      declaration: 'Declaration',
	      value: 'Value'
	  },
	  scope: scope,
	  atrule: atrule,
	  pseudo: pseudo,
	  node: node
	};

	var walker = {
	  node: node
	};

	var version = "1.1.3";
	var _package = {
	version: version
	};

	var _package$1 = /*#__PURE__*/Object.freeze({
	  __proto__: null,
	  version: version,
	  'default': _package
	});

	var require$$4 = getCjsExportFromNamespace(_package$1);

	function merge() {
	  var dest = {};

	  for (var i = 0; i < arguments.length; i++) {
	      var src = arguments[i];
	      for (var key in src) {
	          dest[key] = src[key];
	      }
	  }

	  return dest;
	}

	var syntax = create$4.create(
	  merge(
	      lexer,
	      parser$1,
	      walker
	  )
	);
	var version$1 = require$$4.version;
	syntax.version = version$1;

	var lib = syntax;

	const libGenerate = lib.generate;
	const libParse = lib.parse;

	var cssTree$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		generate: libGenerate,
		parse: libParse
	});

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

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	// 1. Let input be the value passed to this algorithm.
	function process$7(input) {

		// UTILITY FUNCTIONS

		// Manual is faster than RegEx
		// http://bjorn.tipling.com/state-and-regular-expressions-in-javascript
		// http://jsperf.com/whitespace-character/5
		function isSpace(c) {
			return (c === "\u0020" || // space
				c === "\u0009" || // horizontal tab
				c === "\u000A" || // new line
				c === "\u000C" || // form feed
				c === "\u000D");  // carriage return
		}

		function collectCharacters(regEx) {
			let chars;
			const match = regEx.exec(input.substring(pos));
			if (match) {
				chars = match[0];
				pos += chars.length;
				return chars;
			}
		}

		const inputLength = input.length;

		// (Don"t use \s, to avoid matching non-breaking space)
		/* eslint-disable no-control-regex */
		const regexLeadingSpaces = /^[ \t\n\r\u000c]+/;
		const regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/;
		const regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/;
		const regexTrailingCommas = /[,]+$/;
		const regexNonNegativeInteger = /^\d+$/;
		/* eslint-enable no-control-regex */

		// ( Positive or negative or unsigned integers or decimals, without or without exponents.
		// Must include at least one digit.
		// According to spec tests any decimal point must be followed by a digit.
		// No leading plus sign is allowed.)
		// https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
		const regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

		let url, descriptors, currentDescriptor, state, c,
			// 2. Let position be a pointer into input, initially pointing at the start
			//    of the string.
			pos = 0;
		// 3. Let candidates be an initially empty source set.
		const candidates = [];

		// 4. Splitting loop: Collect a sequence of characters that are space
		//    characters or U+002C COMMA characters. If any U+002C COMMA characters
		//    were collected, that is a parse error.		
		while (true) { // eslint-disable-line no-constant-condition
			collectCharacters(regexLeadingCommasOrSpaces);

			// 5. If position is past the end of input, return candidates and abort these steps.
			if (pos >= inputLength) {
				return candidates; // (we"re done, this is the sole return path)
			}

			// 6. Collect a sequence of characters that are not space characters,
			//    and let that be url.
			url = collectCharacters(regexLeadingNotSpaces);

			// 7. Let descriptors be a new empty list.
			descriptors = [];

			// 8. If url ends with a U+002C COMMA character (,), follow these substeps:
			//		(1). Remove all trailing U+002C COMMA characters from url. If this removed
			//         more than one character, that is a parse error.
			if (url.slice(-1) === ",") {
				url = url.replace(regexTrailingCommas, "");
				// (Jump ahead to step 9 to skip tokenization and just push the candidate).
				parseDescriptors();

				//	Otherwise, follow these substeps:
			} else {
				tokenize();
			} // (close else of step 8)

			// 16. Return to the step labeled splitting loop.
		} // (Close of big while loop.)

		/**
		 * Tokenizes descriptor properties prior to parsing
		 * Returns undefined.
		 */
		function tokenize() {

			// 8.1. Descriptor tokeniser: Skip whitespace
			collectCharacters(regexLeadingSpaces);

			// 8.2. Let current descriptor be the empty string.
			currentDescriptor = "";

			// 8.3. Let state be in descriptor.
			state = "in descriptor";

			while (true) { // eslint-disable-line no-constant-condition

				// 8.4. Let c be the character at position.
				c = input.charAt(pos);

				//  Do the following depending on the value of state.
				//  For the purpose of this step, "EOF" is a special character representing
				//  that position is past the end of input.

				// In descriptor
				if (state === "in descriptor") {
					// Do the following, depending on the value of c:

					// Space character
					// If current descriptor is not empty, append current descriptor to
					// descriptors and let current descriptor be the empty string.
					// Set state to after descriptor.
					if (isSpace(c)) {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
							currentDescriptor = "";
							state = "after descriptor";
						}

						// U+002C COMMA (,)
						// Advance position to the next character in input. If current descriptor
						// is not empty, append current descriptor to descriptors. Jump to the step
						// labeled descriptor parser.
					} else if (c === ",") {
						pos += 1;
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

						// U+0028 LEFT PARENTHESIS (()
						// Append c to current descriptor. Set state to in parens.
					} else if (c === "\u0028") {
						currentDescriptor = currentDescriptor + c;
						state = "in parens";

						// EOF
						// If current descriptor is not empty, append current descriptor to
						// descriptors. Jump to the step labeled descriptor parser.
					} else if (c === "") {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

						// Anything else
						// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}
					// (end "in descriptor"

					// In parens
				} else if (state === "in parens") {

					// U+0029 RIGHT PARENTHESIS ())
					// Append c to current descriptor. Set state to in descriptor.
					if (c === ")") {
						currentDescriptor = currentDescriptor + c;
						state = "in descriptor";

						// EOF
						// Append current descriptor to descriptors. Jump to the step labeled
						// descriptor parser.
					} else if (c === "") {
						descriptors.push(currentDescriptor);
						parseDescriptors();
						return;

						// Anything else
						// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}

					// After descriptor
				} else if (state === "after descriptor") {

					// Do the following, depending on the value of c:
					// Space character: Stay in this state.
					if (isSpace(c)) ; else if (c === "") {
						parseDescriptors();
						return;

						// Anything else
						// Set state to in descriptor. Set position to the previous character in input.
					} else {
						state = "in descriptor";
						pos -= 1;

					}
				}

				// Advance position to the next character in input.
				pos += 1;

				// Repeat this step.
			} // (close while true loop)
		}

		/**
		 * Adds descriptor properties to a candidate, pushes to the candidates array
		 * @return undefined
		 */
		// Declared outside of the while loop so that it"s only created once.
		function parseDescriptors() {

			// 9. Descriptor parser: Let error be no.
			let pError = false,

				// 10. Let width be absent.
				// 11. Let density be absent.
				// 12. Let future-compat-h be absent. (We"re implementing it now as h)
				w, d, h, i,
				desc, lastChar, value, intVal, floatVal;
			const candidate = {};

			// 13. For each descriptor in descriptors, run the appropriate set of steps
			// from the following list:
			for (i = 0; i < descriptors.length; i++) {
				desc = descriptors[i];

				lastChar = desc[desc.length - 1];
				value = desc.substring(0, desc.length - 1);
				intVal = parseInt(value, 10);
				floatVal = parseFloat(value);

				// If the descriptor consists of a valid non-negative integer followed by
				// a U+0077 LATIN SMALL LETTER W character
				if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

					// If width and density are not both absent, then let error be yes.
					if (w || d) { pError = true; }

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes.
					// Otherwise, let width be the result.
					if (intVal === 0) { pError = true; } else { w = intVal; }

					// If the descriptor consists of a valid floating-point number followed by
					// a U+0078 LATIN SMALL LETTER X character
				} else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

					// If width, density and future-compat-h are not all absent, then let error
					// be yes.
					if (w || d || h) { pError = true; }

					// Apply the rules for parsing floating-point number values to the descriptor.
					// If the result is less than zero, let error be yes. Otherwise, let density
					// be the result.
					if (floatVal < 0) { pError = true; } else { d = floatVal; }

					// If the descriptor consists of a valid non-negative integer followed by
					// a U+0068 LATIN SMALL LETTER H character
				} else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

					// If height and density are not both absent, then let error be yes.
					if (h || d) { pError = true; }

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes. Otherwise, let future-compat-h
					// be the result.
					if (intVal === 0) { pError = true; } else { h = intVal; }

					// Anything else, Let error be yes.
				} else { pError = true; }
			} // (close step 13 for loop)

			// 15. If error is still no, then append a new image source to candidates whose
			// URL is url, associated with a width width if not absent and a pixel
			// density density if not absent. Otherwise, there is a parse error.
			if (!pError) {
				candidate.url = url;
				if (w) { candidate.w = w; }
				if (d) { candidate.d = d; }
				if (h) { candidate.h = h; }
				candidates.push(candidate);
			} else if (console && console.log) {  // eslint-disable-line no-console
				console.log("Invalid srcset descriptor found in \"" + input + "\" at \"" + desc + "\"."); // eslint-disable-line no-console
			}
		} // (close parseDescriptors fn)

	}

	var htmlSrcsetParser = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$7
	});

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

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	// derived from https://github.com/jsdom/whatwg-mimetype

	/* 
	 * Copyright © 2017–2018 Domenic Denicola <d@domenic.me>
	 *
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:

	 * The above copyright notice and this permission notice shall be included in all
	 * copies or substantial portions of the Software.

	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	 * SOFTWARE.
	 */

	let utils, parser, serializer, MIMEType;

	// lib/utils.js
	{
		utils = {};
		utils.removeLeadingAndTrailingHTTPWhitespace = string => {
			return string.replace(/^[ \t\n\r]+/, "").replace(/[ \t\n\r]+$/, "");
		};

		utils.removeTrailingHTTPWhitespace = string => {
			return string.replace(/[ \t\n\r]+$/, "");
		};

		utils.isHTTPWhitespaceChar = char => {
			return char === " " || char === "\t" || char === "\n" || char === "\r";
		};

		utils.solelyContainsHTTPTokenCodePoints = string => {
			return /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/.test(string);
		};

		utils.soleyContainsHTTPQuotedStringTokenCodePoints = string => {
			return /^[\t\u0020-\u007E\u0080-\u00FF]*$/.test(string);
		};

		utils.asciiLowercase = string => {
			return string.replace(/[A-Z]/g, l => l.toLowerCase());
		};

		// This variant only implements it with the extract-value flag set.
		utils.collectAnHTTPQuotedString = (input, position) => {
			let value = "";

			position++;

			// eslint-disable-next-line no-constant-condition
			while (true) {
				while (position < input.length && input[position] !== "\"" && input[position] !== "\\") {
					value += input[position];
					++position;
				}

				if (position >= input.length) {
					break;
				}

				const quoteOrBackslash = input[position];
				++position;

				if (quoteOrBackslash === "\\") {
					if (position >= input.length) {
						value += "\\";
						break;
					}

					value += input[position];
					++position;
				} else {
					break;
				}
			}

			return [value, position];
		};
	}

	// lib/serializer.js
	{
		const { solelyContainsHTTPTokenCodePoints } = utils;
		serializer = mimeType => {
			let serialization = `${mimeType.type}/${mimeType.subtype}`;

			if (mimeType.parameters.size === 0) {
				return serialization;
			}

			for (let [name, value] of mimeType.parameters) {
				serialization += ";";
				serialization += name;
				serialization += "=";

				if (!solelyContainsHTTPTokenCodePoints(value) || value.length === 0) {
					value = value.replace(/(["\\])/g, "\\$1");
					value = `"${value}"`;
				}

				serialization += value;
			}

			return serialization;
		};
	}

	// lib/parser.js
	{
		const {
			removeLeadingAndTrailingHTTPWhitespace,
			removeTrailingHTTPWhitespace,
			isHTTPWhitespaceChar,
			solelyContainsHTTPTokenCodePoints,
			soleyContainsHTTPQuotedStringTokenCodePoints,
			asciiLowercase,
			collectAnHTTPQuotedString
		} = utils;

		parser = input => {
			input = removeLeadingAndTrailingHTTPWhitespace(input);

			let position = 0;
			let type = "";
			while (position < input.length && input[position] !== "/") {
				type += input[position];
				++position;
			}

			if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
				return null;
			}

			if (position >= input.length) {
				return null;
			}

			// Skips past "/"
			++position;

			let subtype = "";
			while (position < input.length && input[position] !== ";") {
				subtype += input[position];
				++position;
			}

			subtype = removeTrailingHTTPWhitespace(subtype);

			if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
				return null;
			}

			const mimeType = {
				type: asciiLowercase(type),
				subtype: asciiLowercase(subtype),
				parameters: new Map()
			};

			while (position < input.length) {
				// Skip past ";"
				++position;

				while (isHTTPWhitespaceChar(input[position])) {
					++position;
				}

				let parameterName = "";
				while (position < input.length && input[position] !== ";" && input[position] !== "=") {
					parameterName += input[position];
					++position;
				}
				parameterName = asciiLowercase(parameterName);

				if (position < input.length) {
					if (input[position] === ";") {
						continue;
					}

					// Skip past "="
					++position;
				}

				let parameterValue = null;
				if (input[position] === "\"") {
					[parameterValue, position] = collectAnHTTPQuotedString(input, position);

					while (position < input.length && input[position] !== ";") {
						++position;
					}
				} else {
					parameterValue = "";
					while (position < input.length && input[position] !== ";") {
						parameterValue += input[position];
						++position;
					}

					parameterValue = removeTrailingHTTPWhitespace(parameterValue);

					if (parameterValue === "") {
						continue;
					}
				}

				if (parameterName.length > 0 &&
					solelyContainsHTTPTokenCodePoints(parameterName) &&
					soleyContainsHTTPQuotedStringTokenCodePoints(parameterValue) &&
					!mimeType.parameters.has(parameterName)) {
					mimeType.parameters.set(parameterName, parameterValue);
				}
			}

			return mimeType;
		};
	}

	// lib/mime-type.js
	{
		const parse = parser;
		const serialize = serializer;
		const {
			asciiLowercase,
			solelyContainsHTTPTokenCodePoints,
			soleyContainsHTTPQuotedStringTokenCodePoints
		} = utils;

		MIMEType = class MIMEType {
			constructor(string) {
				string = String(string);
				const result = parse(string);
				if (result === null) {
					throw new Error(`Could not parse MIME type string "${string}"`);
				}

				this._type = result.type;
				this._subtype = result.subtype;
				this._parameters = new MIMETypeParameters(result.parameters);
			}

			static parse(string) {
				try {
					return new this(string);
				} catch (e) {
					return null;
				}
			}

			get essence() {
				return `${this.type}/${this.subtype}`;
			}

			get type() {
				return this._type;
			}

			set type(value) {
				value = asciiLowercase(String(value));

				if (value.length === 0) {
					throw new Error("Invalid type: must be a non-empty string");
				}
				if (!solelyContainsHTTPTokenCodePoints(value)) {
					throw new Error(`Invalid type ${value}: must contain only HTTP token code points`);
				}

				this._type = value;
			}

			get subtype() {
				return this._subtype;
			}

			set subtype(value) {
				value = asciiLowercase(String(value));

				if (value.length === 0) {
					throw new Error("Invalid subtype: must be a non-empty string");
				}
				if (!solelyContainsHTTPTokenCodePoints(value)) {
					throw new Error(`Invalid subtype ${value}: must contain only HTTP token code points`);
				}

				this._subtype = value;
			}

			get parameters() {
				return this._parameters;
			}

			toString() {
				// The serialize function works on both "MIME type records" (i.e. the results of parse) and on this class, since
				// this class's interface is identical.
				return serialize(this);
			}

			isJavaScript({ allowParameters = false } = {}) {
				switch (this._type) {
					case "text": {
						switch (this._subtype) {
							case "ecmascript":
							case "javascript":
							case "javascript1.0":
							case "javascript1.1":
							case "javascript1.2":
							case "javascript1.3":
							case "javascript1.4":
							case "javascript1.5":
							case "jscript":
							case "livescript":
							case "x-ecmascript":
							case "x-javascript": {
								return allowParameters || this._parameters.size === 0;
							}
							default: {
								return false;
							}
						}
					}
					case "application": {
						switch (this._subtype) {
							case "ecmascript":
							case "javascript":
							case "x-ecmascript":
							case "x-javascript": {
								return allowParameters || this._parameters.size === 0;
							}
							default: {
								return false;
							}
						}
					}
					default: {
						return false;
					}
				}
			}
			isXML() {
				return (this._subtype === "xml" && (this._type === "text" || this._type === "application")) ||
					this._subtype.endsWith("+xml");
			}
			isHTML() {
				return this._subtype === "html" && this._type === "text";
			}
		};

		class MIMETypeParameters {
			constructor(map) {
				this._map = map;
			}

			get size() {
				return this._map.size;
			}

			get(name) {
				name = asciiLowercase(String(name));
				return this._map.get(name);
			}

			has(name) {
				name = asciiLowercase(String(name));
				return this._map.has(name);
			}

			set(name, value) {
				name = asciiLowercase(String(name));
				value = String(value);

				if (!solelyContainsHTTPTokenCodePoints(name)) {
					throw new Error(`Invalid MIME type parameter name "${name}": only HTTP token code points are valid.`);
				}
				if (!soleyContainsHTTPQuotedStringTokenCodePoints(value)) {
					throw new Error(`Invalid MIME type parameter value "${value}": only HTTP quoted-string token code points are valid.`);
				}

				return this._map.set(name, value);
			}

			clear() {
				this._map.clear();
			}

			delete(name) {
				name = asciiLowercase(String(name));
				return this._map.delete(name);
			}

			forEach(callbackFn, thisArg) {
				this._map.forEach(callbackFn, thisArg);
			}

			keys() {
				return this._map.keys();
			}

			values() {
				return this._map.values();
			}

			entries() {
				return this._map.entries();
			}

			[Symbol.iterator]() {
				return this._map[Symbol.iterator]();
			}
		}

	}

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

	var index$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fontPropertyParser: cssFontPropertyParser,
		mediaQueryParser: cssMediaQueryParser,
		cssMinifier: cssMinifier,
		cssTree: cssTree$1,
		cssUnescape: cssUnescape,
		srcsetParser: htmlSrcsetParser,
		get MIMEType () { return MIMEType; }
	});

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

	const helper$2 = {
		normalizeFontFamily,
		getFontWeight
	};

	const FontFace = globalThis.FontFace;

	const REGEXP_URL_SIMPLE_QUOTES_FN$1 = /url\s*\(\s*'(.*?)'\s*\)/i;
	const REGEXP_URL_DOUBLE_QUOTES_FN$1 = /url\s*\(\s*"(.*?)"\s*\)/i;
	const REGEXP_URL_NO_QUOTES_FN$1 = /url\s*\(\s*(.*?)\s*\)/i;
	const REGEXP_URL_FUNCTION = /(url|local|-sf-url-original)\(.*?\)\s*(,|$)/g;
	const REGEXP_SIMPLE_QUOTES_STRING = /^'(.*?)'$/;
	const REGEXP_DOUBLE_QUOTES_STRING = /^"(.*?)"$/;
	const REGEXP_URL_FUNCTION_WOFF = /^url\(\s*["']?data:font\/(woff2?)/;
	const REGEXP_URL_FUNCTION_WOFF_ALT = /^url\(\s*["']?data:application\/x-font-(woff)/;
	const REGEXP_FONT_FORMAT = /\.([^.?#]+)((\?|#).*?)?$/;
	const REGEXP_FONT_FORMAT_VALUE = /format\((.*?)\)\s*,?$/;
	const REGEXP_FONT_SRC = /(.*?)\s*,?$/;
	const EMPTY_URL_SOURCE = /^url\(["']?data:[^,]*,?["']?\)/;
	const LOCAL_SOURCE = "local(";
	const MEDIA_ALL$2 = "all";
	const FONT_STRETCHES = {
		"ultra-condensed": "50%",
		"extra-condensed": "62.5%",
		"condensed": "75%",
		"semi-condensed": "87.5%",
		"normal": "100%",
		"semi-expanded": "112.5%",
		"expanded": "125%",
		"extra-expanded": "150%",
		"ultra-expanded": "200%"
	};
	const FONT_MAX_LOAD_DELAY = 5000;

	async function process$6(doc, stylesheets, fontURLs, fontTests) {
		const fontsDetails = {
			fonts: new Map(),
			medias: new Map(),
			supports: new Map()
		};
		const stats = { rules: { processed: 0, discarded: 0 }, fonts: { processed: 0, discarded: 0 } };
		let sheetIndex = 0;
		stylesheets.forEach(stylesheetInfo => {
			const cssRules = stylesheetInfo.stylesheet.children;
			if (cssRules) {
				stats.rules.processed += cssRules.getSize();
				stats.rules.discarded += cssRules.getSize();
				if (stylesheetInfo.mediaText && stylesheetInfo.mediaText != MEDIA_ALL$2) {
					const mediaFontsDetails = createFontsDetailsInfo();
					fontsDetails.medias.set("media-" + sheetIndex + "-" + stylesheetInfo.mediaText, mediaFontsDetails);
					getFontsDetails(doc, cssRules, sheetIndex, mediaFontsDetails);
				} else {
					getFontsDetails(doc, cssRules, sheetIndex, fontsDetails);
				}
			}
			sheetIndex++;
		});
		processFontDetails(fontsDetails);
		await Promise.all([...stylesheets].map(async ([, stylesheetInfo], sheetIndex) => {
			const cssRules = stylesheetInfo.stylesheet.children;
			const media = stylesheetInfo.mediaText;
			if (cssRules) {
				if (media && media != MEDIA_ALL$2) {
					await processFontFaceRules(cssRules, sheetIndex, fontsDetails.medias.get("media-" + sheetIndex + "-" + media), fontURLs, fontTests, stats);
				} else {
					await processFontFaceRules(cssRules, sheetIndex, fontsDetails, fontURLs, fontTests, stats);
				}
				stats.rules.discarded -= cssRules.getSize();
			}
		}));
		return stats;
	}

	function getFontsDetails(doc, cssRules, sheetIndex, mediaFontsDetails) {
		let mediaIndex = 0, supportsIndex = 0;
		cssRules.forEach(ruleData => {
			if (ruleData.type == "Atrule" && ruleData.name == "media" && ruleData.block && ruleData.block.children && ruleData.prelude) {
				const mediaText = libGenerate(ruleData.prelude);
				const fontsDetails = createFontsDetailsInfo();
				mediaFontsDetails.medias.set("media-" + sheetIndex + "-" + mediaIndex + "-" + mediaText, fontsDetails);
				mediaIndex++;
				getFontsDetails(doc, ruleData.block.children, sheetIndex, fontsDetails);
			} else if (ruleData.type == "Atrule" && ruleData.name == "supports" && ruleData.block && ruleData.block.children && ruleData.prelude) {
				const supportsText = libGenerate(ruleData.prelude);
				const fontsDetails = createFontsDetailsInfo();
				mediaFontsDetails.supports.set("supports-" + sheetIndex + "-" + supportsIndex + "-" + supportsText, fontsDetails);
				supportsIndex++;
				getFontsDetails(doc, ruleData.block.children, sheetIndex, fontsDetails);
			} else if (ruleData.type == "Atrule" && ruleData.name == "font-face" && ruleData.block && ruleData.block.children) {
				const fontKey = getFontKey(ruleData);
				let fontInfo = mediaFontsDetails.fonts.get(fontKey);
				if (!fontInfo) {
					fontInfo = [];
					mediaFontsDetails.fonts.set(fontKey, fontInfo);
				}
				const src = getPropertyValue(ruleData, "src");
				if (src) {
					const fontSources = src.match(REGEXP_URL_FUNCTION);
					if (fontSources) {
						fontSources.forEach(source => fontInfo.unshift(source));
					}
				}
			}
		});
	}

	function processFontDetails(fontsDetails) {
		fontsDetails.fonts.forEach((fontInfo, fontKey) => {
			fontsDetails.fonts.set(fontKey, fontInfo.map(fontSource => {
				const fontFormatMatch = fontSource.match(REGEXP_FONT_FORMAT_VALUE);
				let fontFormat;
				const urlMatch = fontSource.match(REGEXP_URL_SIMPLE_QUOTES_FN$1) ||
					fontSource.match(REGEXP_URL_DOUBLE_QUOTES_FN$1) ||
					fontSource.match(REGEXP_URL_NO_QUOTES_FN$1);
				const fontUrl = urlMatch && urlMatch[1];
				if (fontFormatMatch && fontFormatMatch[1]) {
					fontFormat = fontFormatMatch[1].replace(REGEXP_SIMPLE_QUOTES_STRING, "$1").replace(REGEXP_DOUBLE_QUOTES_STRING, "$1").toLowerCase();
				}
				if (!fontFormat) {
					const fontFormatMatch = fontSource.match(REGEXP_URL_FUNCTION_WOFF);
					if (fontFormatMatch && fontFormatMatch[1]) {
						fontFormat = fontFormatMatch[1];
					} else {
						const fontFormatMatch = fontSource.match(REGEXP_URL_FUNCTION_WOFF_ALT);
						if (fontFormatMatch && fontFormatMatch[1]) {
							fontFormat = fontFormatMatch[1];
						}
					}
				}
				if (!fontFormat && fontUrl) {
					const fontFormatMatch = fontUrl.match(REGEXP_FONT_FORMAT);
					if (fontFormatMatch && fontFormatMatch[1]) {
						fontFormat = fontFormatMatch[1];
					}
				}
				return { src: fontSource.match(REGEXP_FONT_SRC)[1], fontUrl, format: fontFormat };
			}));
		});
		fontsDetails.medias.forEach(mediaFontsDetails => processFontDetails(mediaFontsDetails));
		fontsDetails.supports.forEach(supportsFontsDetails => processFontDetails(supportsFontsDetails));
	}

	async function processFontFaceRules(cssRules, sheetIndex, fontsDetails, fontURLs, fontTests, stats) {
		const removedRules = [];
		let mediaIndex = 0, supportsIndex = 0;
		for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
			const ruleData = cssRule.data;
			if (ruleData.type == "Atrule" && ruleData.name == "media" && ruleData.block && ruleData.block.children && ruleData.prelude) {
				const mediaText = libGenerate(ruleData.prelude);
				await processFontFaceRules(ruleData.block.children, sheetIndex, fontsDetails.medias.get("media-" + sheetIndex + "-" + mediaIndex + "-" + mediaText), fontURLs, fontTests, stats);
				mediaIndex++;
			} else if (ruleData.type == "Atrule" && ruleData.name == "supports" && ruleData.block && ruleData.block.children && ruleData.prelude) {
				const supportsText = libGenerate(ruleData.prelude);
				await processFontFaceRules(ruleData.block.children, sheetIndex, fontsDetails.supports.get("supports-" + sheetIndex + "-" + supportsIndex + "-" + supportsText), fontURLs, fontTests, stats);
				supportsIndex++;
			} else if (ruleData.type == "Atrule" && ruleData.name == "font-face") {
				const key = getFontKey(ruleData);
				const fontInfo = fontsDetails.fonts.get(key);
				if (fontInfo) {
					const processed = await processFontFaceRule(ruleData, fontInfo, fontURLs, fontTests, stats);
					if (processed) {
						fontsDetails.fonts.delete(key);
					}
				} else {
					removedRules.push(cssRule);
				}
			}
		}
		removedRules.forEach(cssRule => cssRules.remove(cssRule));
	}

	async function processFontFaceRule(ruleData, fontInfo, fontURLs, fontTests, stats) {
		const removedNodes = [];
		for (let node = ruleData.block.children.head; node; node = node.next) {
			if (node.data.property == "src") {
				removedNodes.push(node);
			}
		}
		removedNodes.pop();
		removedNodes.forEach(node => ruleData.block.children.remove(node));
		const srcDeclaration = ruleData.block.children.filter(node => node.property == "src").tail;
		if (srcDeclaration) {
			await Promise.all(fontInfo.map(async (source, sourceIndex) => {
				if (fontTests.has(source.src)) {
					source.valid = fontTests.get(source.src);
				} else {
					if (FontFace) {
						const fontFace = new FontFace("test-font", source.src);
						try {
							let timeout;
							await Promise.race([
								fontFace.load().then(() => fontFace.loaded).then(() => { source.valid = true; globalThis.clearTimeout(timeout); }),
								new Promise(resolve => timeout = globalThis.setTimeout(() => { source.valid = true; resolve(); }, FONT_MAX_LOAD_DELAY))
							]);
						} catch (error) {
							const declarationFontURLs = fontURLs.get(srcDeclaration.data);
							if (declarationFontURLs) {
								const fontURL = declarationFontURLs[declarationFontURLs.length - sourceIndex - 1];
								if (fontURL) {
									const fontFace = new FontFace("test-font", "url(" + fontURL + ")");
									try {
										let timeout;
										await Promise.race([
											fontFace.load().then(() => fontFace.loaded).then(() => { source.valid = true; globalThis.clearTimeout(timeout); }),
											new Promise(resolve => timeout = globalThis.setTimeout(() => { source.valid = true; resolve(); }, FONT_MAX_LOAD_DELAY))
										]);
									} catch (error) {
										// ignored
									}
								}
							} else {
								source.valid = true;
							}
						}
					} else {
						source.valid = true;
					}
					fontTests.set(source.src, source.valid);
				}
			}));
			const findSource = (fontFormat, testValidity) => fontInfo.find(source => !source.src.match(EMPTY_URL_SOURCE) && source.format == fontFormat && (!testValidity || source.valid));
			const filterSource = fontSource => fontInfo.filter(source => source == fontSource || source.src.startsWith(LOCAL_SOURCE));
			stats.fonts.processed += fontInfo.length;
			stats.fonts.discarded += fontInfo.length;
			const woffFontFound = findSource("woff2-variations", true) || findSource("woff2", true) || findSource("woff", true);
			if (woffFontFound) {
				fontInfo = filterSource(woffFontFound);
			} else {
				const ttfFontFound = findSource("truetype-variations", true) || findSource("truetype", true);
				if (ttfFontFound) {
					fontInfo = filterSource(ttfFontFound);
				} else {
					const otfFontFound = findSource("opentype") || findSource("embedded-opentype");
					if (otfFontFound) {
						fontInfo = filterSource(otfFontFound);
					} else {
						fontInfo = fontInfo.filter(source => !source.src.match(EMPTY_URL_SOURCE) && (source.valid) || source.src.startsWith(LOCAL_SOURCE));
					}
				}
			}
			stats.fonts.discarded -= fontInfo.length;
			fontInfo.reverse();
			try {
				srcDeclaration.data.value = libParse(fontInfo.map(fontSource => fontSource.src).join(","), { context: "value" });
			}
			catch (error) {
				// ignored
			}
			return true;
		} else {
			return false;
		}
	}

	function getPropertyValue(ruleData, propertyName) {
		let property;
		if (ruleData.block.children) {
			property = ruleData.block.children.filter(node => {
				try {
					return node.property == propertyName && !libGenerate(node.value).match(/\\9$/);
				} catch (error) {
					return node.property == propertyName;
				}
			}).tail;
		}
		if (property) {
			try {
				return libGenerate(property.data.value);
			} catch (error) {
				// ignored
			}
		}
	}

	function getFontKey(ruleData) {
		return JSON.stringify([
			helper$2.normalizeFontFamily(getPropertyValue(ruleData, "font-family")),
			helper$2.getFontWeight(getPropertyValue(ruleData, "font-weight") || "400"),
			getPropertyValue(ruleData, "font-style") || "normal",
			getPropertyValue(ruleData, "unicode-range"),
			getFontStretch(getPropertyValue(ruleData, "font-stretch")),
			getPropertyValue(ruleData, "font-variant") || "normal",
			getPropertyValue(ruleData, "font-feature-settings"),
			getPropertyValue(ruleData, "font-variation-settings")
		]);
	}

	function getFontStretch(stretch) {
		return FONT_STRETCHES[stretch] || stretch;
	}

	function createFontsDetailsInfo() {
		return {
			fonts: new Map(),
			medias: new Map(),
			supports: new Map()
		};
	}

	var cssFontsAltMinifier = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$6
	});

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

	const helper$1 = {
		normalizeFontFamily,
		flatten,
		getFontWeight,
		removeQuotes: removeQuotes$1
	};

	const REGEXP_COMMA = /\s*,\s*/;
	const REGEXP_DASH = /-/;
	const REGEXP_QUESTION_MARK = /\?/g;
	const REGEXP_STARTS_U_PLUS = /^U\+/i;
	const VALID_FONT_STYLES = [/^normal$/, /^italic$/, /^oblique$/, /^oblique\s+/];

	function process$5(doc, stylesheets, styles, options) {
		const stats = { rules: { processed: 0, discarded: 0 }, fonts: { processed: 0, discarded: 0 } };
		const fontsInfo = { declared: [], used: [] };
		const workStyleElement = doc.createElement("style");
		let docContent = "";
		doc.body.appendChild(workStyleElement);
		stylesheets.forEach(stylesheetInfo => {
			const cssRules = stylesheetInfo.stylesheet.children;
			if (cssRules) {
				stats.processed += cssRules.getSize();
				stats.discarded += cssRules.getSize();
				getFontsInfo(cssRules, fontsInfo);
				docContent = getRulesTextContent(doc, cssRules, workStyleElement, docContent);
			}
		});
		styles.forEach(declarations => {
			const fontFamilyNames = getFontFamilyNames(declarations);
			if (fontFamilyNames.length) {
				fontsInfo.used.push(fontFamilyNames);
			}
			docContent = getDeclarationsTextContent(declarations.children, workStyleElement, docContent);
		});
		workStyleElement.remove();
		docContent += doc.body.innerText;
		if (globalThis.getComputedStyle && options.doc) {
			fontsInfo.used = fontsInfo.used.map(fontNames => fontNames.map(familyName => {
				const matchedVar = familyName.match(/^var\((--.*)\)$/);
				if (matchedVar && matchedVar[1]) {
					const computedFamilyName = globalThis.getComputedStyle(options.doc.body).getPropertyValue(matchedVar[1]);
					return (computedFamilyName && computedFamilyName.split(",").map(name => helper$1.normalizeFontFamily(name))) || familyName;
				}
				return familyName;
			}));
			fontsInfo.used = fontsInfo.used.map(fontNames => helper$1.flatten(fontNames));
		}
		const variableFound = fontsInfo.used.find(fontNames => fontNames.find(fontName => fontName.startsWith("var(--")));
		let unusedFonts, filteredUsedFonts;
		if (variableFound) {
			unusedFonts = [];
		} else {
			filteredUsedFonts = new Map();
			fontsInfo.used.forEach(fontNames => fontNames.forEach(familyName => {
				if (fontsInfo.declared.find(fontInfo => fontInfo.fontFamily == familyName)) {
					const optionalData = options.usedFonts && options.usedFonts.filter(fontInfo => fontInfo[0] == familyName);
					if (optionalData && optionalData.length) {
						filteredUsedFonts.set(familyName, optionalData);
					}
				}
			}));
			unusedFonts = fontsInfo.declared.filter(fontInfo => !filteredUsedFonts.has(fontInfo.fontFamily));
		}
		stylesheets.forEach(stylesheetInfo => {
			const cssRules = stylesheetInfo.stylesheet.children;
			if (cssRules) {
				filterUnusedFonts(cssRules, fontsInfo.declared, unusedFonts, filteredUsedFonts, docContent);
				stats.rules.discarded -= cssRules.getSize();
			}
		});
		return stats;
	}

	function getFontsInfo(cssRules, fontsInfo) {
		cssRules.forEach(ruleData => {
			if (ruleData.type == "Atrule" && (ruleData.name == "media" || ruleData.name == "supports") && ruleData.block && ruleData.block.children) {
				getFontsInfo(ruleData.block.children, fontsInfo);
			} else if (ruleData.type == "Rule") {
				const fontFamilyNames = getFontFamilyNames(ruleData.block);
				if (fontFamilyNames.length) {
					fontsInfo.used.push(fontFamilyNames);
				}
			} else {
				if (ruleData.type == "Atrule" && ruleData.name == "font-face") {
					const fontFamily = helper$1.normalizeFontFamily(getDeclarationValue(ruleData.block.children, "font-family"));
					if (fontFamily) {
						const fontWeight = getDeclarationValue(ruleData.block.children, "font-weight") || "400";
						const fontStyle = getDeclarationValue(ruleData.block.children, "font-style") || "normal";
						const fontVariant = getDeclarationValue(ruleData.block.children, "font-variant") || "normal";
						fontWeight.split(",").forEach(weightValue =>
							fontsInfo.declared.push({ fontFamily, fontWeight: helper$1.getFontWeight(helper$1.removeQuotes(weightValue)), fontStyle, fontVariant }));
					}
				}
			}
		});
	}

	function filterUnusedFonts(cssRules, declaredFonts, unusedFonts, filteredUsedFonts, docContent) {
		const removedRules = [];
		for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
			const ruleData = cssRule.data;
			if (ruleData.type == "Atrule" && (ruleData.name == "media" || ruleData.name == "supports") && ruleData.block && ruleData.block.children) {
				filterUnusedFonts(ruleData.block.children, declaredFonts, unusedFonts, filteredUsedFonts, docContent);
			} else if (ruleData.type == "Atrule" && ruleData.name == "font-face") {
				const fontFamily = helper$1.normalizeFontFamily(getDeclarationValue(ruleData.block.children, "font-family"));
				if (fontFamily) {
					const unicodeRange = getDeclarationValue(ruleData.block.children, "unicode-range");
					if (unusedFonts.find(fontInfo => fontInfo.fontFamily == fontFamily) || !testUnicodeRange(docContent, unicodeRange) || !testUsedFont(ruleData, fontFamily, declaredFonts, filteredUsedFonts)) {
						removedRules.push(cssRule);
					}
				}
				const removedDeclarations = [];
				for (let declaration = ruleData.block.children.head; declaration; declaration = declaration.next) {
					if (declaration.data.property == "font-display") {
						removedDeclarations.push(declaration);
					}
				}
				if (removedDeclarations.length) {
					removedDeclarations.forEach(removedDeclaration => ruleData.block.children.remove(removedDeclaration));
				}
			}
		}
		removedRules.forEach(cssRule => cssRules.remove(cssRule));
	}

	function testUsedFont(ruleData, familyName, declaredFonts, filteredUsedFonts) {
		let test;
		const optionalUsedFonts = filteredUsedFonts && filteredUsedFonts.get(familyName);
		if (optionalUsedFonts && optionalUsedFonts.length) {
			let fontStyle = getDeclarationValue(ruleData.block.children, "font-style") || "normal";
			if (VALID_FONT_STYLES.find(rule => fontStyle.trim().match(rule))) {
				const fontWeight = helper$1.getFontWeight(getDeclarationValue(ruleData.block.children, "font-weight") || "400");
				const declaredFontsWeights = declaredFonts
					.filter(fontInfo => fontInfo.fontFamily == familyName && fontInfo.fontStyle == fontStyle)
					.map(fontInfo => fontInfo.fontWeight)
					.sort((weight1, weight2) => weight1 - weight2);
				let usedFontWeights = optionalUsedFonts.map(fontInfo => getUsedFontWeight(fontInfo, fontStyle, declaredFontsWeights));
				test = testFontweight(fontWeight, usedFontWeights);
				if (!test) {
					usedFontWeights = optionalUsedFonts.map(fontInfo => {
						fontInfo = Array.from(fontInfo);
						fontInfo[2] = "normal";
						return getUsedFontWeight(fontInfo, fontStyle, declaredFontsWeights);
					});
				}
				test = testFontweight(fontWeight, usedFontWeights);
			} else {
				test = true;
			}
		} else {
			test = true;
		}
		return test;
	}

	function testFontweight(fontWeight, usedFontWeights) {
		return fontWeight.split(",").find(weightValue => usedFontWeights.includes(helper$1.getFontWeight(helper$1.removeQuotes(weightValue))));
	}

	function getDeclarationValue(declarations, propertyName) {
		let property;
		if (declarations) {
			property = declarations.filter(declaration => declaration.property == propertyName).tail;
		}
		if (property) {
			try {
				return helper$1.removeQuotes(libGenerate(property.data.value)).toLowerCase();
			} catch (error) {
				// ignored
			}
		}
	}

	function getFontFamilyNames(declarations) {
		let fontFamilyName = declarations.children.filter(node => node.property == "font-family").tail;
		let fontFamilyNames = [];
		if (fontFamilyName) {
			let familyName = "";
			if (fontFamilyName.data.value.children) {
				fontFamilyName.data.value.children.forEach(node => {
					if (node.type == "Operator" && node.value == "," && familyName) {
						fontFamilyNames.push(helper$1.normalizeFontFamily(familyName));
						familyName = "";
					} else {
						familyName += libGenerate(node);
					}
				});
			} else {
				fontFamilyName = libGenerate(fontFamilyName.data.value);
			}
			if (familyName) {
				fontFamilyNames.push(helper$1.normalizeFontFamily(familyName));
			}
		}
		const font = declarations.children.filter(node => node.property == "font").tail;
		if (font && font.data && font.data.value) {
			try {
				const parsedFont = parse$1(libGenerate(font.data.value));
				parsedFont.family.forEach(familyName => fontFamilyNames.push(helper$1.normalizeFontFamily(familyName)));
			} catch (error) {
				// ignored				
			}
		}
		return fontFamilyNames;
	}

	function getUsedFontWeight(fontInfo, fontStyle, fontWeights) {
		let foundWeight;
		if (fontInfo[2] == fontStyle) {
			let fontWeight = Number(fontInfo[1]);
			if (fontWeights.length > 1) {
				if (fontWeight >= 400 && fontWeight <= 500) {
					foundWeight = fontWeights.find(weight => weight >= fontWeight && weight <= 500);
					if (!foundWeight) {
						foundWeight = findDescendingFontWeight(fontWeight, fontWeights);
					}
					if (!foundWeight) {
						foundWeight = findAscendingFontWeight(fontWeight, fontWeights);
					}
				}
				if (fontWeight < 400) {
					foundWeight = fontWeights.slice().reverse().find(weight => weight <= fontWeight);
					if (!foundWeight) {
						foundWeight = findAscendingFontWeight(fontWeight, fontWeights);
					}
				}
				if (fontWeight > 500) {
					foundWeight = fontWeights.find(weight => weight >= fontWeight);
					if (!foundWeight) {
						foundWeight = findDescendingFontWeight(fontWeight, fontWeights);
					}
				}
			} else {
				foundWeight = fontWeights[0];
			}
		}
		return foundWeight;
	}

	function findDescendingFontWeight(fontWeight, fontWeights) {
		return fontWeights.slice().reverse().find(weight => weight < fontWeight);
	}

	function findAscendingFontWeight(fontWeight, fontWeights) {
		return fontWeights.find(weight => weight > fontWeight);
	}

	function getRulesTextContent(doc, cssRules, workStylesheet, content) {
		cssRules.forEach(ruleData => {
			if (ruleData.block && ruleData.block.children && ruleData.prelude && ruleData.prelude.children) {
				if (ruleData.type == "Atrule" && (ruleData.name == "media" || ruleData.name == "supports")) {
					content = getRulesTextContent(doc, ruleData.block.children, workStylesheet, content);
				} else if (ruleData.type == "Rule") {
					content = getDeclarationsTextContent(ruleData.block.children, workStylesheet, content);
				}
			}
		});
		return content;
	}

	function getDeclarationsTextContent(declarations, workStylesheet, content) {
		const contentText = getDeclarationUnescapedValue(declarations, "content", workStylesheet);
		const quotesText = getDeclarationUnescapedValue(declarations, "quotes", workStylesheet);
		if (!content.includes(contentText)) {
			content += contentText;
		}
		if (!content.includes(quotesText)) {
			content += quotesText;
		}
		return content;
	}

	function getDeclarationUnescapedValue(declarations, property, workStylesheet) {
		const rawValue = getDeclarationValue(declarations, property) || "";
		if (rawValue) {
			workStylesheet.textContent = "tmp { content:\"" + rawValue + "\"}";
			if (workStylesheet.sheet && workStylesheet.sheet.cssRules) {
				return helper$1.removeQuotes(workStylesheet.sheet.cssRules[0].style.getPropertyValue("content"));
			} else {
				return rawValue;
			}
		}
		return "";
	}

	function testUnicodeRange(docContent, unicodeRange) {
		if (unicodeRange) {
			const unicodeRanges = unicodeRange.split(REGEXP_COMMA);
			let invalid;
			const result = unicodeRanges.filter(rangeValue => {
				const range = rangeValue.split(REGEXP_DASH);
				let regExpString;
				if (range.length == 2) {
					range[0] = transformRange(range[0]);
					regExpString = "[" + range[0] + "-" + transformRange("U+" + range[1]) + "]";
				}
				if (range.length == 1) {
					if (range[0].includes("?")) {
						const firstRange = transformRange(range[0]);
						const secondRange = firstRange;
						regExpString = "[" + firstRange.replace(REGEXP_QUESTION_MARK, "0") + "-" + secondRange.replace(REGEXP_QUESTION_MARK, "F") + "]";
					} else if (range[0]) {
						regExpString = "[" + transformRange(range[0]) + "]";
					}
				}
				if (regExpString) {
					try {
						return (new RegExp(regExpString, "u")).test(docContent);
					} catch (error) {
						invalid = true;
						return false;
					}
				}
				return true;
			});
			return !invalid && (!unicodeRanges.length || result.length);
		}
		return true;
	}

	function transformRange(range) {
		range = range.replace(REGEXP_STARTS_U_PLUS, "");
		while (range.length < 6) {
			range = "0" + range;
		}
		return "\\u{" + range + "}";
	}

	var cssFontsMinifier = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$5
	});

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

	const MEDIA_ALL$1 = "all";
	const IGNORED_PSEUDO_ELEMENTS = ["after", "before", "first-letter", "first-line", "placeholder", "selection", "part", "marker"];
	const SINGLE_FILE_HIDDEN_CLASS_NAME = "sf-hidden";
	const DISPLAY_STYLE = "display";
	const REGEXP_VENDOR_IDENTIFIER = /-(ms|webkit|moz|o)-/;

	class MatchedRules {
		constructor(doc, stylesheets, styles) {
			this.doc = doc;
			this.mediaAllInfo = createMediaInfo(MEDIA_ALL$1);
			const matchedElementsCache = new Map();
			let sheetIndex = 0;
			const workStyleElement = doc.createElement("style");
			doc.body.appendChild(workStyleElement);
			stylesheets.forEach(stylesheetInfo => {
				if (!stylesheetInfo.scoped) {
					const cssRules = stylesheetInfo.stylesheet.children;
					if (cssRules) {
						if (stylesheetInfo.mediaText && stylesheetInfo.mediaText != MEDIA_ALL$1) {
							const mediaInfo = createMediaInfo(stylesheetInfo.mediaText);
							this.mediaAllInfo.medias.set("style-" + sheetIndex + "-" + stylesheetInfo.mediaText, mediaInfo);
							getMatchedElementsRules(doc, cssRules, mediaInfo, sheetIndex, styles, matchedElementsCache, workStyleElement);
						} else {
							getMatchedElementsRules(doc, cssRules, this.mediaAllInfo, sheetIndex, styles, matchedElementsCache, workStyleElement);
						}
					}
				}
				sheetIndex++;
			});
			sortRules(this.mediaAllInfo);
			computeCascade(this.mediaAllInfo, [], this.mediaAllInfo, workStyleElement);
			workStyleElement.remove();
		}

		getMediaAllInfo() {
			return this.mediaAllInfo;
		}
	}

	function getMediaAllInfo(doc, stylesheets, styles) {
		return new MatchedRules(doc, stylesheets, styles).getMediaAllInfo();
	}

	function createMediaInfo(media) {
		const mediaInfo = { media: media, elements: new Map(), medias: new Map(), rules: new Map(), pseudoRules: new Map() };
		if (media == MEDIA_ALL$1) {
			mediaInfo.matchedStyles = new Map();
		}
		return mediaInfo;
	}

	function getMatchedElementsRules(doc, cssRules, mediaInfo, sheetIndex, styles, matchedElementsCache, workStylesheet) {
		let mediaIndex = 0;
		let ruleIndex = 0;
		cssRules.forEach(ruleData => {
			if (ruleData.block && ruleData.block.children && ruleData.prelude && ruleData.prelude.children) {
				if (ruleData.type == "Atrule" && ruleData.name == "media") {
					const mediaText = libGenerate(ruleData.prelude);
					const ruleMediaInfo = createMediaInfo(mediaText);
					mediaInfo.medias.set("rule-" + sheetIndex + "-" + mediaIndex + "-" + mediaText, ruleMediaInfo);
					mediaIndex++;
					getMatchedElementsRules(doc, ruleData.block.children, ruleMediaInfo, sheetIndex, styles, matchedElementsCache, workStylesheet);
				} else if (ruleData.type == "Rule") {
					const selectors = ruleData.prelude.children.toArray();
					const selectorsText = ruleData.prelude.children.toArray().map(selector => libGenerate(selector));
					const ruleInfo = { ruleData, mediaInfo, ruleIndex, sheetIndex, matchedSelectors: new Set(), declarations: new Set(), selectors, selectorsText };
					if (!invalidSelector(selectorsText.join(","), workStylesheet)) {
						for (let selector = ruleData.prelude.children.head, selectorIndex = 0; selector; selector = selector.next, selectorIndex++) {
							const selectorText = selectorsText[selectorIndex];
							const selectorInfo = { selector, selectorText, ruleInfo };
							getMatchedElementsSelector(doc, selectorInfo, styles, matchedElementsCache);
						}
					}
					ruleIndex++;
				}
			}
		});
	}

	function invalidSelector(selectorText, workStylesheet) {
		workStylesheet.textContent = selectorText + "{}";
		return workStylesheet.sheet ? !workStylesheet.sheet.cssRules.length : workStylesheet.sheet;
	}

	function getMatchedElementsSelector(doc, selectorInfo, styles, matchedElementsCache) {
		const filteredSelectorText = getFilteredSelector(selectorInfo.selector, selectorInfo.selectorText);
		const selectorText = filteredSelectorText != selectorInfo.selectorText ? filteredSelectorText : selectorInfo.selectorText;
		const cachedMatchedElements = matchedElementsCache.get(selectorText);
		let matchedElements = cachedMatchedElements;
		if (!matchedElements) {
			try {
				matchedElements = doc.querySelectorAll(selectorText);
				if (selectorText != "." + SINGLE_FILE_HIDDEN_CLASS_NAME) {
					matchedElements = Array.from(doc.querySelectorAll(selectorText)).filter(matchedElement =>
						!matchedElement.classList.contains(SINGLE_FILE_HIDDEN_CLASS_NAME) &&
						(matchedElement.style.getPropertyValue(DISPLAY_STYLE) != "none" || matchedElement.style.getPropertyPriority("display") != "important")
					);
				}
			} catch (error) {
				// ignored				
			}
		}
		if (matchedElements) {
			if (!cachedMatchedElements) {
				matchedElementsCache.set(selectorText, matchedElements);
			}
			if (matchedElements.length) {
				if (filteredSelectorText == selectorInfo.selectorText) {
					matchedElements.forEach(element => addRule(element, selectorInfo, styles));
				} else {
					let pseudoSelectors = selectorInfo.ruleInfo.mediaInfo.pseudoRules.get(selectorInfo.ruleInfo.ruleData);
					if (!pseudoSelectors) {
						pseudoSelectors = new Set();
						selectorInfo.ruleInfo.mediaInfo.pseudoRules.set(selectorInfo.ruleInfo.ruleData, pseudoSelectors);
					}
					pseudoSelectors.add(selectorInfo.selectorText);
				}
			}
		}
	}

	function getFilteredSelector(selector, selectorText) {
		const removedSelectors = [];
		selector = { data: libParse(libGenerate(selector.data), { context: "selector" }) };
		filterPseudoClasses(selector);
		if (removedSelectors.length) {
			removedSelectors.forEach(({ parentSelector, selector }) => {
				if (parentSelector.data.children.getSize() == 0 || !selector.prev || selector.prev.data.type == "Combinator" || selector.prev.data.type == "WhiteSpace") {
					parentSelector.data.children.replace(selector, libParse("*", { context: "selector" }).children.head);
				} else {
					parentSelector.data.children.remove(selector);
				}
			});
			selectorText = libGenerate(selector.data).trim();
		}
		return selectorText;

		function filterPseudoClasses(selector, parentSelector) {
			if (selector.data.children) {
				for (let childSelector = selector.data.children.head; childSelector; childSelector = childSelector.next) {
					filterPseudoClasses(childSelector, selector);
				}
			}
			if ((selector.data.type == "PseudoClassSelector") ||
				(selector.data.type == "PseudoElementSelector" && (testVendorPseudo(selector) || IGNORED_PSEUDO_ELEMENTS.includes(selector.data.name)))) {
				removedSelectors.push({ parentSelector, selector });
			}
		}

		function testVendorPseudo(selector) {
			const name = selector.data.name;
			return name.startsWith("-") || name.startsWith("\\-");
		}
	}

	function addRule(element, selectorInfo, styles) {
		const mediaInfo = selectorInfo.ruleInfo.mediaInfo;
		const elementStyle = styles.get(element);
		let elementInfo = mediaInfo.elements.get(element);
		if (!elementInfo) {
			elementInfo = [];
			if (elementStyle) {
				elementInfo.push({ styleInfo: { styleData: elementStyle, declarations: new Set() } });
			}
			mediaInfo.elements.set(element, elementInfo);
		}
		const specificity = computeSpecificity(selectorInfo.selector.data);
		specificity.ruleIndex = selectorInfo.ruleInfo.ruleIndex;
		specificity.sheetIndex = selectorInfo.ruleInfo.sheetIndex;
		selectorInfo.specificity = specificity;
		elementInfo.push(selectorInfo);
	}

	function computeCascade(mediaInfo, parentMediaInfo, mediaAllInfo, workStylesheet) {
		mediaInfo.elements.forEach((elementInfo/*, element*/) =>
			getDeclarationsInfo(elementInfo, workStylesheet/*, element*/).forEach((declarationsInfo, property) => {
				if (declarationsInfo.selectorInfo.ruleInfo || mediaInfo == mediaAllInfo) {
					let info;
					if (declarationsInfo.selectorInfo.ruleInfo) {
						info = declarationsInfo.selectorInfo.ruleInfo;
						const ruleData = info.ruleData;
						const ascendantMedia = [mediaInfo, ...parentMediaInfo].find(media => media.rules.get(ruleData)) || mediaInfo;
						ascendantMedia.rules.set(ruleData, info);
						if (ruleData) {
							info.matchedSelectors.add(declarationsInfo.selectorInfo.selectorText);
						}
					} else {
						info = declarationsInfo.selectorInfo.styleInfo;
						const styleData = info.styleData;
						const matchedStyleInfo = mediaAllInfo.matchedStyles.get(styleData);
						if (!matchedStyleInfo) {
							mediaAllInfo.matchedStyles.set(styleData, info);
						}
					}
					if (!info.declarations.has(property)) {
						info.declarations.add(property);
					}
				}
			}));
		delete mediaInfo.elements;
		mediaInfo.medias.forEach(childMediaInfo => computeCascade(childMediaInfo, [mediaInfo, ...parentMediaInfo], mediaAllInfo, workStylesheet));
	}

	function getDeclarationsInfo(elementInfo, workStylesheet/*, element*/) {
		const declarationsInfo = new Map();
		const processedProperties = new Set();
		elementInfo.forEach(selectorInfo => {
			let declarations;
			if (selectorInfo.styleInfo) {
				declarations = selectorInfo.styleInfo.styleData.children;
			} else {
				declarations = selectorInfo.ruleInfo.ruleData.block.children;
			}
			processDeclarations(declarationsInfo, declarations, selectorInfo, processedProperties, workStylesheet);
		});
		return declarationsInfo;
	}

	function processDeclarations(declarationsInfo, declarations, selectorInfo, processedProperties, workStylesheet) {
		for (let declaration = declarations.tail; declaration; declaration = declaration.prev) {
			const declarationData = declaration.data;
			const declarationText = libGenerate(declarationData);
			if (declarationData.type == "Declaration" &&
				(declarationText.match(REGEXP_VENDOR_IDENTIFIER) || !processedProperties.has(declarationData.property) || declarationData.important) && !invalidDeclaration(declarationText, workStylesheet)) {
				const declarationInfo = declarationsInfo.get(declarationData);
				if (!declarationInfo || (declarationData.important && !declarationInfo.important)) {
					declarationsInfo.set(declarationData, { selectorInfo, important: declarationData.important });
					if (!declarationText.match(REGEXP_VENDOR_IDENTIFIER)) {
						processedProperties.add(declarationData.property);
					}
				}
			}
		}
	}

	function invalidDeclaration(declarationText, workStylesheet) {
		let invalidDeclaration;
		workStylesheet.textContent = "single-file-declaration { " + declarationText + "}";
		if (workStylesheet.sheet && !workStylesheet.sheet.cssRules[0].style.length) {
			if (!declarationText.match(REGEXP_VENDOR_IDENTIFIER)) {
				invalidDeclaration = true;
			}
		}
		return invalidDeclaration;
	}

	function sortRules(media) {
		media.elements.forEach(elementRules => elementRules.sort((ruleInfo1, ruleInfo2) =>
			ruleInfo1.styleInfo && !ruleInfo2.styleInfo ? -1 :
				!ruleInfo1.styleInfo && ruleInfo2.styleInfo ? 1 :
					compareSpecificity(ruleInfo1.specificity, ruleInfo2.specificity)));
		media.medias.forEach(sortRules);
	}

	function computeSpecificity(selector, specificity = { a: 0, b: 0, c: 0 }) {
		if (selector.type == "IdSelector") {
			specificity.a++;
		}
		if (selector.type == "ClassSelector" || selector.type == "AttributeSelector" || (selector.type == "PseudoClassSelector" && selector.name != "not")) {
			specificity.b++;
		}
		if ((selector.type == "TypeSelector" && selector.name != "*") || selector.type == "PseudoElementSelector") {
			specificity.c++;
		}
		if (selector.children) {
			selector.children.forEach(selector => computeSpecificity(selector, specificity));
		}
		return specificity;
	}

	function compareSpecificity(specificity1, specificity2) {
		if (specificity1.a > specificity2.a) {
			return -1;
		} else if (specificity1.a < specificity2.a) {
			return 1;
		} else if (specificity1.b > specificity2.b) {
			return -1;
		} else if (specificity1.b < specificity2.b) {
			return 1;
		} else if (specificity1.c > specificity2.c) {
			return -1;
		} else if (specificity1.c < specificity2.c) {
			return 1;
		} else if (specificity1.sheetIndex > specificity2.sheetIndex) {
			return -1;
		} else if (specificity1.sheetIndex < specificity2.sheetIndex) {
			return 1;
		} else if (specificity1.ruleIndex > specificity2.ruleIndex) {
			return -1;
		} else if (specificity1.ruleIndex < specificity2.ruleIndex) {
			return 1;
		} else {
			return -1;
		}
	}

	var cssMatchedRules = /*#__PURE__*/Object.freeze({
		__proto__: null,
		getMediaAllInfo: getMediaAllInfo
	});

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

	const helper = {
		flatten
	};

	const MEDIA_ALL = "all";
	const MEDIA_SCREEN = "screen";

	function process$4(stylesheets) {
		const stats = { processed: 0, discarded: 0 };
		stylesheets.forEach((stylesheetInfo, element) => {
			if (matchesMediaType(stylesheetInfo.mediaText || MEDIA_ALL, MEDIA_SCREEN) && stylesheetInfo.stylesheet.children) {
				const removedRules = processRules$1(stylesheetInfo.stylesheet.children, stats);
				removedRules.forEach(({ cssRules, cssRule }) => cssRules.remove(cssRule));
			} else {
				stylesheets.delete(element);
			}
		});
		return stats;
	}

	function processRules$1(cssRules, stats, removedRules = []) {
		for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
			const ruleData = cssRule.data;
			if (ruleData.type == "Atrule" && ruleData.name == "media" && ruleData.block && ruleData.block.children && ruleData.prelude && ruleData.prelude.children) {
				stats.processed++;
				if (matchesMediaType(libGenerate(ruleData.prelude), MEDIA_SCREEN)) {
					processRules$1(ruleData.block.children, stats, removedRules);
				} else {
					removedRules.push({ cssRules, cssRule });
					stats.discarded++;
				}
			}
		}
		return removedRules;
	}

	function matchesMediaType(mediaText, mediaType) {
		const foundMediaTypes = helper.flatten(parseMediaList(mediaText).map(node => getMediaTypes(node, mediaType)));
		return foundMediaTypes.find(mediaTypeInfo => (!mediaTypeInfo.not && (mediaTypeInfo.value == mediaType || mediaTypeInfo.value == MEDIA_ALL))
			|| (mediaTypeInfo.not && (mediaTypeInfo.value == MEDIA_ALL || mediaTypeInfo.value != mediaType)));
	}

	function getMediaTypes(parentNode, mediaType, mediaTypes = []) {
		parentNode.nodes.map((node, indexNode) => {
			if (node.type == "media-query") {
				return getMediaTypes(node, mediaType, mediaTypes);
			} else {
				if (node.type == "media-type") {
					const nodeMediaType = { not: Boolean(indexNode && parentNode.nodes[0].type == "keyword" && parentNode.nodes[0].value == "not"), value: node.value };
					if (!mediaTypes.find(mediaType => nodeMediaType.not == mediaType.not && nodeMediaType.value == mediaType.value)) {
						mediaTypes.push(nodeMediaType);
					}
				}
			}
		});
		if (!mediaTypes.length) {
			mediaTypes.push({ not: false, value: MEDIA_ALL });
		}
		return mediaTypes;
	}

	var cssMediasAltMinifier = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$4
	});

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

	function process$3(stylesheets, styles, mediaAllInfo) {
		const stats = { processed: 0, discarded: 0 };
		let sheetIndex = 0;
		stylesheets.forEach(stylesheetInfo => {
			if (!stylesheetInfo.scoped) {
				const cssRules = stylesheetInfo.stylesheet.children;
				if (cssRules) {
					stats.processed += cssRules.getSize();
					stats.discarded += cssRules.getSize();
					let mediaInfo;
					if (stylesheetInfo.mediaText && stylesheetInfo.mediaText != "all") {
						mediaInfo = mediaAllInfo.medias.get("style-" + sheetIndex + "-" + stylesheetInfo.mediaText);
					} else {
						mediaInfo = mediaAllInfo;
					}
					processRules(cssRules, sheetIndex, mediaInfo);
					stats.discarded -= cssRules.getSize();
				}
			}
			sheetIndex++;
		});
		styles.forEach(style => processStyleAttribute(style, mediaAllInfo));
		return stats;
	}

	function processRules(cssRules, sheetIndex, mediaInfo) {
		let mediaRuleIndex = 0;
		const removedCssRules = [];
		for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
			const ruleData = cssRule.data;
			if (ruleData.block && ruleData.block.children && ruleData.prelude && ruleData.prelude.children) {
				if (ruleData.type == "Atrule" && ruleData.name == "media") {
					const mediaText = libGenerate(ruleData.prelude);
					processRules(ruleData.block.children, sheetIndex, mediaInfo.medias.get("rule-" + sheetIndex + "-" + mediaRuleIndex + "-" + mediaText));
					if (!ruleData.prelude.children.getSize() || !ruleData.block.children.getSize()) {
						removedCssRules.push(cssRule);
					}
					mediaRuleIndex++;
				} else if (ruleData.type == "Rule") {
					const ruleInfo = mediaInfo.rules.get(ruleData);
					const pseudoSelectors = mediaInfo.pseudoRules.get(ruleData);
					if (!ruleInfo && !pseudoSelectors) {
						removedCssRules.push(cssRule);
					} else if (ruleInfo) {
						processRuleInfo(ruleData, ruleInfo, pseudoSelectors);
						if (!ruleData.prelude.children.getSize() || !ruleData.block.children.getSize()) {
							removedCssRules.push(cssRule);
						}
					}
				}
			} else {
				if (!ruleData || ruleData.type == "Raw" || (ruleData.type == "Rule" && (!ruleData.prelude || ruleData.prelude.type == "Raw"))) {
					removedCssRules.push(cssRule);
				}
			}
		}
		removedCssRules.forEach(cssRule => cssRules.remove(cssRule));
	}

	function processRuleInfo(ruleData, ruleInfo, pseudoSelectors) {
		const removedDeclarations = [];
		const removedSelectors = [];
		let pseudoSelectorFound;
		for (let selector = ruleData.prelude.children.head; selector; selector = selector.next) {
			const selectorText = libGenerate(selector.data);
			if (pseudoSelectors && pseudoSelectors.has(selectorText)) {
				pseudoSelectorFound = true;
			}
			if (!ruleInfo.matchedSelectors.has(selectorText) && (!pseudoSelectors || !pseudoSelectors.has(selectorText))) {
				removedSelectors.push(selector);
			}
		}
		if (!pseudoSelectorFound) {
			for (let declaration = ruleData.block.children.tail; declaration; declaration = declaration.prev) {
				if (!ruleInfo.declarations.has(declaration.data)) {
					removedDeclarations.push(declaration);
				}
			}
		}
		removedDeclarations.forEach(declaration => ruleData.block.children.remove(declaration));
		removedSelectors.forEach(selector => ruleData.prelude.children.remove(selector));
	}

	function processStyleAttribute(styleData, mediaAllInfo) {
		const removedDeclarations = [];
		const styleInfo = mediaAllInfo.matchedStyles.get(styleData);
		if (styleInfo) {
			let propertyFound;
			for (let declaration = styleData.children.head; declaration && !propertyFound; declaration = declaration.next) {
				if (!styleInfo.declarations.has(declaration.data)) {
					removedDeclarations.push(declaration);
				}
			}
			removedDeclarations.forEach(declaration => styleData.children.remove(declaration));
		}
	}

	var cssRulesMinifier = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$3
	});

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

	const EMPTY_IMAGE$1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

	function process$2(doc) {
		doc.querySelectorAll("picture").forEach(pictureElement => {
			const imgElement = pictureElement.querySelector("img");
			if (imgElement) {
				let { src, srcset } = getImgSrcData(imgElement);
				if (!src) {
					const data = getSourceSrcData(Array.from(pictureElement.querySelectorAll("source")).reverse());
					src = data.src;
					if (!srcset) {
						srcset = data.srcset;
					}
				}
				setSrc({ src, srcset }, imgElement, pictureElement);
			}
		});
		doc.querySelectorAll(":not(picture) > img[srcset]").forEach(imgElement => setSrc(getImgSrcData(imgElement), imgElement));
	}

	function getImgSrcData(imgElement) {
		let src = imgElement.getAttribute("src");
		if (src == EMPTY_IMAGE$1) {
			src = null;
		}
		let srcset = getSourceSrc(imgElement.getAttribute("srcset"));
		if (srcset == EMPTY_IMAGE$1) {
			srcset = null;
		}
		return { src, srcset };
	}

	function getSourceSrcData(sources) {
		let source = sources.find(source => source.src);
		let src = source && source.src;
		let srcset = source && source.srcset;
		if (!src) {
			source = sources.find(source => getSourceSrc(source.src));
			src = source && source.src;
			if (src == EMPTY_IMAGE$1) {
				src = null;
			}
		}
		if (!srcset) {
			source = sources.find(source => getSourceSrc(source.srcset));
			srcset = source && source.srcset;
			if (srcset == EMPTY_IMAGE$1) {
				srcset = null;
			}
		}
		return { src, srcset };
	}

	function setSrc(srcData, imgElement, pictureElement) {
		if (srcData.src) {
			imgElement.setAttribute("src", srcData.src);
			imgElement.setAttribute("srcset", "");
			imgElement.setAttribute("sizes", "");
		} else {
			imgElement.setAttribute("src", EMPTY_IMAGE$1);
			if (srcData.srcset) {
				imgElement.setAttribute("srcset", srcData.srcset);
			} else {
				imgElement.setAttribute("srcset", "");
				imgElement.setAttribute("sizes", "");
			}
		}
		if (pictureElement) {
			pictureElement.querySelectorAll("source").forEach(sourceElement => sourceElement.remove());
		}
	}

	function getSourceSrc(sourceSrcSet) {
		if (sourceSrcSet) {
			const srcset = process$7(sourceSrcSet);
			if (srcset.length) {
				return (srcset.find(srcset => srcset.url)).url;
			}
		}
	}

	var htmlImagesAltMinifier = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$2
	});

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

	// Derived from the work of Kirill Maltsev - https://github.com/posthtml/htmlnano

	// Source: https://github.com/kangax/html-minifier/issues/63
	const booleanAttributes = [
		"allowfullscreen",
		"async",
		"autofocus",
		"autoplay",
		"checked",
		"compact",
		"controls",
		"declare",
		"default",
		"defaultchecked",
		"defaultmuted",
		"defaultselected",
		"defer",
		"disabled",
		"enabled",
		"formnovalidate",
		"hidden",
		"indeterminate",
		"inert",
		"ismap",
		"itemscope",
		"loop",
		"multiple",
		"muted",
		"nohref",
		"noresize",
		"noshade",
		"novalidate",
		"nowrap",
		"open",
		"pauseonexit",
		"readonly",
		"required",
		"reversed",
		"scoped",
		"seamless",
		"selected",
		"sortable",
		"truespeed",
		"typemustmatch",
		"visible"
	];

	const noWhitespaceCollapseElements = ["script", "style", "pre", "textarea"];

	// Source: https://www.w3.org/TR/html4/sgml/dtd.html#events (Generic Attributes)
	const safeToRemoveAttrs = [
		"id",
		"class",
		"style",
		"lang",
		"dir",
		"onclick",
		"ondblclick",
		"onmousedown",
		"onmouseup",
		"onmouseover",
		"onmousemove",
		"onmouseout",
		"onkeypress",
		"onkeydown",
		"onkeyup"
	];

	const redundantAttributes = {
		"form": {
			"method": "get"
		},
		"script": {
			"language": "javascript",
			"type": "text/javascript",
			// Remove attribute if the function returns false
			"charset": node => {
				// The charset attribute only really makes sense on “external” SCRIPT elements:
				// http://perfectionkills.com/optimizing-html/#8_script_charset
				return !node.getAttribute("src");
			}
		},
		"style": {
			"media": "all",
			"type": "text/css"
		},
		"link": {
			"media": "all"
		}
	};

	const REGEXP_WHITESPACE = /[ \t\f\r]+/g;
	const REGEXP_NEWLINE = /[\n]+/g;
	const REGEXP_ENDS_WHITESPACE = /^\s+$/;
	const NodeFilter_SHOW_ALL = 4294967295;
	const Node_ELEMENT_NODE$1 = 1;
	const Node_TEXT_NODE$1 = 3;
	const Node_COMMENT_NODE$1 = 8;

	const modules = [
		collapseBooleanAttributes,
		mergeTextNodes,
		collapseWhitespace,
		removeComments,
		removeEmptyAttributes,
		removeRedundantAttributes,
		compressJSONLD,
		node => mergeElements(node, "style", (node, previousSibling) => node.parentElement && node.parentElement.tagName == "HEAD" && node.media == previousSibling.media && node.title == previousSibling.title)
	];

	function process$1(doc, options) {
		removeEmptyInlineElements(doc);
		const nodesWalker = doc.createTreeWalker(doc.documentElement, NodeFilter_SHOW_ALL, null, false);
		let node = nodesWalker.nextNode();
		while (node) {
			const deletedNode = modules.find(module => module(node, options));
			const previousNode = node;
			node = nodesWalker.nextNode();
			if (deletedNode) {
				previousNode.remove();
			}
		}
	}

	function collapseBooleanAttributes(node) {
		if (node.nodeType == Node_ELEMENT_NODE$1) {
			Array.from(node.attributes).forEach(attribute => {
				if (booleanAttributes.includes(attribute.name)) {
					node.setAttribute(attribute.name, "");
				}
			});
		}
	}

	function mergeTextNodes(node) {
		if (node.nodeType == Node_TEXT_NODE$1) {
			if (node.previousSibling && node.previousSibling.nodeType == Node_TEXT_NODE$1) {
				node.textContent = node.previousSibling.textContent + node.textContent;
				node.previousSibling.remove();
			}
		}
	}

	function mergeElements(node, tagName, acceptMerge) {
		if (node.nodeType == Node_ELEMENT_NODE$1 && node.tagName.toLowerCase() == tagName.toLowerCase()) {
			let previousSibling = node.previousSibling;
			const previousSiblings = [];
			while (previousSibling && previousSibling.nodeType == Node_TEXT_NODE$1 && !previousSibling.textContent.trim()) {
				previousSiblings.push(previousSibling);
				previousSibling = previousSibling.previousSibling;
			}
			if (previousSibling && previousSibling.nodeType == Node_ELEMENT_NODE$1 && previousSibling.tagName == node.tagName && acceptMerge(node, previousSibling)) {
				node.textContent = previousSibling.textContent + node.textContent;
				previousSiblings.forEach(node => node.remove());
				previousSibling.remove();
			}
		}
	}

	function collapseWhitespace(node, options) {
		if (node.nodeType == Node_TEXT_NODE$1) {
			let element = node.parentElement;
			const spacePreserved = element.getAttribute(options.PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME) == "";
			if (!spacePreserved) {
				const textContent = node.textContent;
				let noWhitespace = noWhitespaceCollapse(element);
				while (noWhitespace) {
					element = element.parentElement;
					noWhitespace = element && noWhitespaceCollapse(element);
				}
				if ((!element || noWhitespace) && textContent.length > 1) {
					node.textContent = textContent.replace(REGEXP_WHITESPACE, getWhiteSpace(node)).replace(REGEXP_NEWLINE, "\n");
				}
			}
		}
	}

	function getWhiteSpace(node) {
		return node.parentElement && node.parentElement.tagName == "HEAD" ? "\n" : " ";
	}

	function noWhitespaceCollapse(element) {
		return element && !noWhitespaceCollapseElements.includes(element.tagName.toLowerCase());
	}

	function removeComments(node) {
		if (node.nodeType == Node_COMMENT_NODE$1 && node.parentElement.tagName != "HTML") {
			return !node.textContent.toLowerCase().trim().startsWith("[if");
		}
	}

	function removeEmptyAttributes(node) {
		if (node.nodeType == Node_ELEMENT_NODE$1) {
			Array.from(node.attributes).forEach(attribute => {
				if (safeToRemoveAttrs.includes(attribute.name.toLowerCase())) {
					const attributeValue = node.getAttribute(attribute.name);
					if (attributeValue == "" || (attributeValue || "").match(REGEXP_ENDS_WHITESPACE)) {
						node.removeAttribute(attribute.name);
					}
				}
			});
		}
	}

	function removeRedundantAttributes(node) {
		if (node.nodeType == Node_ELEMENT_NODE$1) {
			const tagRedundantAttributes = redundantAttributes[node.tagName.toLowerCase()];
			if (tagRedundantAttributes) {
				Object.keys(tagRedundantAttributes).forEach(redundantAttributeName => {
					const tagRedundantAttributeValue = tagRedundantAttributes[redundantAttributeName];
					if (typeof tagRedundantAttributeValue == "function" ? tagRedundantAttributeValue(node) : node.getAttribute(redundantAttributeName) == tagRedundantAttributeValue) {
						node.removeAttribute(redundantAttributeName);
					}
				});
			}
		}
	}

	function compressJSONLD(node) {
		if (node.nodeType == Node_ELEMENT_NODE$1 && node.tagName == "SCRIPT" && node.type == "application/ld+json" && node.textContent.trim()) {
			try {
				node.textContent = JSON.stringify(JSON.parse(node.textContent));
			} catch (error) {
				// ignored
			}
		}
	}

	function removeEmptyInlineElements(doc) {
		doc.querySelectorAll("style, script:not([src])").forEach(element => {
			if (!element.textContent.trim()) {
				element.remove();
			}
		});
	}

	var htmlMinifier = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process$1
	});

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

	const SELF_CLOSED_TAG_NAMES = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];

	const Node_ELEMENT_NODE = 1;
	const Node_TEXT_NODE = 3;
	const Node_COMMENT_NODE = 8;

	// see https://www.w3.org/TR/html5/syntax.html#optional-tags
	const OMITTED_START_TAGS = [
		{ tagName: "head", accept: element => !element.childNodes.length || element.childNodes[0].nodeType == Node_ELEMENT_NODE },
		{ tagName: "body", accept: element => !element.childNodes.length }
	];
	const OMITTED_END_TAGS = [
		{ tagName: "html", accept: next => !next || next.nodeType != Node_COMMENT_NODE },
		{ tagName: "head", accept: next => !next || (next.nodeType != Node_COMMENT_NODE && (next.nodeType != Node_TEXT_NODE || !startsWithSpaceChar(next.textContent))) },
		{ tagName: "body", accept: next => !next || next.nodeType != Node_COMMENT_NODE },
		{ tagName: "li", accept: (next, element) => (!next && element.parentElement && (element.parentElement.tagName == "UL" || element.parentElement.tagName == "OL")) || (next && ["LI"].includes(next.tagName)) },
		{ tagName: "dt", accept: next => !next || ["DT", "DD"].includes(next.tagName) },
		{ tagName: "p", accept: next => next && ["ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DETAILS", "DIV", "DL", "FIELDSET", "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6", "HEADER", "HR", "MAIN", "NAV", "OL", "P", "PRE", "SECTION", "TABLE", "UL"].includes(next.tagName) },
		{ tagName: "dd", accept: next => !next || ["DT", "DD"].includes(next.tagName) },
		{ tagName: "rt", accept: next => !next || ["RT", "RP"].includes(next.tagName) },
		{ tagName: "rp", accept: next => !next || ["RT", "RP"].includes(next.tagName) },
		{ tagName: "optgroup", accept: next => !next || ["OPTGROUP"].includes(next.tagName) },
		{ tagName: "option", accept: next => !next || ["OPTION", "OPTGROUP"].includes(next.tagName) },
		{ tagName: "colgroup", accept: next => !next || (next.nodeType != Node_COMMENT_NODE && (next.nodeType != Node_TEXT_NODE || !startsWithSpaceChar(next.textContent))) },
		{ tagName: "caption", accept: next => !next || (next.nodeType != Node_COMMENT_NODE && (next.nodeType != Node_TEXT_NODE || !startsWithSpaceChar(next.textContent))) },
		{ tagName: "thead", accept: next => !next || ["TBODY", "TFOOT"].includes(next.tagName) },
		{ tagName: "tbody", accept: next => !next || ["TBODY", "TFOOT"].includes(next.tagName) },
		{ tagName: "tfoot", accept: next => !next },
		{ tagName: "tr", accept: next => !next || ["TR"].includes(next.tagName) },
		{ tagName: "td", accept: next => !next || ["TD", "TH"].includes(next.tagName) },
		{ tagName: "th", accept: next => !next || ["TD", "TH"].includes(next.tagName) }
	];
	const TEXT_NODE_TAGS = ["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"];

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
			parentTagName = parentNode.tagName.toLowerCase();
		}
		if (!parentTagName || TEXT_NODE_TAGS.includes(parentTagName)) {
			if (parentTagName == "script") {
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
		const tagName = element.tagName.toLowerCase();
		const omittedStartTag = compressHTML && OMITTED_START_TAGS.find(omittedStartTag => tagName == omittedStartTag.tagName && omittedStartTag.accept(element));
		let content = "";
		if (!omittedStartTag || element.attributes.length) {
			content = "<" + tagName;
			Array.from(element.attributes).forEach(attribute => content += serializeAttribute(attribute, element, compressHTML));
			content += ">";
		}
		if (element.tagName == "TEMPLATE" && !element.childNodes.length) {
			content += element.innerHTML;
		} else {
			Array.from(element.childNodes).forEach(childNode => content += serialize(childNode, compressHTML, isSVG || tagName == "svg"));
		}
		const omittedEndTag = compressHTML && OMITTED_END_TAGS.find(omittedEndTag => tagName == omittedEndTag.tagName && omittedEndTag.accept(element.nextSibling, element));
		if (isSVG || (!omittedEndTag && !SELF_CLOSED_TAG_NAMES.includes(tagName))) {
			content += "</" + tagName + ">";
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
			const invalidUnquotedValue = !compressHTML || !value.match(/^[^ \t\n\f\r'"`=<>]+$/);
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

	var htmlSerializer = /*#__PURE__*/Object.freeze({
		__proto__: null,
		process: process
	});

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

	var index = /*#__PURE__*/Object.freeze({
		__proto__: null,
		fontsAltMinifier: cssFontsAltMinifier,
		fontsMinifier: cssFontsMinifier,
		matchedRules: cssMatchedRules,
		mediasAltMinifier: cssMediasAltMinifier,
		cssRulesMinifier: cssRulesMinifier,
		imagesAltMinifier: htmlImagesAltMinifier,
		htmlMinifier: htmlMinifier,
		serializer: htmlSerializer
	});

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

	const Set$1 = globalThis.Set;
	const Map$1 = globalThis.Map;

	let util, cssTree;

	function getClass(...args) {
		[util, cssTree] = args;
		return SingleFileClass;
	}

	class SingleFileClass {
		constructor(options) {
			this.options = options;
		}
		async run() {
			const waitForUserScript = globalThis._singleFile_waitForUserScript;
			if (this.options.userScriptEnabled && waitForUserScript) {
				await waitForUserScript(util.ON_BEFORE_CAPTURE_EVENT_NAME);
			}
			this.runner = new Runner(this.options, true);
			await this.runner.loadPage();
			await this.runner.initialize();
			if (this.options.userScriptEnabled && waitForUserScript) {
				await waitForUserScript(util.ON_AFTER_CAPTURE_EVENT_NAME);
			}
			await this.runner.run();
		}
		cancel() {
			this.cancelled = true;
			if (this.runner) {
				this.runner.cancel();
			}
		}
		getPageData() {
			return this.runner.getPageData();
		}
	}

	// -------------
	// ProgressEvent
	// -------------
	const PAGE_LOADING = "page-loading";
	const PAGE_LOADED = "page-loaded";
	const RESOURCES_INITIALIZING = "resource-initializing";
	const RESOURCES_INITIALIZED = "resources-initialized";
	const RESOURCE_LOADED = "resource-loaded";
	const PAGE_ENDED = "page-ended";
	const STAGE_STARTED = "stage-started";
	const STAGE_ENDED = "stage-ended";
	const STAGE_TASK_STARTED = "stage-task-started";
	const STAGE_TASK_ENDED = "stage-task-ended";

	class ProgressEvent {
		constructor(type, detail) {
			return { type, detail, PAGE_LOADING, PAGE_LOADED, RESOURCES_INITIALIZING, RESOURCES_INITIALIZED, RESOURCE_LOADED, PAGE_ENDED, STAGE_STARTED, STAGE_ENDED, STAGE_TASK_STARTED, STAGE_TASK_ENDED };
		}
	}

	// ------
	// Runner
	// ------
	const RESOLVE_URLS_STAGE = 0;
	const REPLACE_DATA_STAGE = 1;
	const REPLACE_DOCS_STAGE = 2;
	const POST_PROCESS_STAGE = 3;
	const STAGES = [{
		sequential: [
			{ action: "preProcessPage" },
			{ option: "loadDeferredImagesKeepZoomLevel", action: "resetZoomLevel" },
			{ action: "replaceStyleContents" },
			{ action: "resetCharsetMeta" },
			{ option: "saveFavicon", action: "saveFavicon" },
			{ action: "replaceCanvasElements" },
			{ action: "insertFonts" },
			{ action: "insertShadowRootContents" },
			{ action: "setInputValues" },
			{ option: "moveStylesInHead", action: "moveStylesInHead" },
			{ option: "removeScripts", action: "removeScripts" },
			{ option: "selected", action: "removeUnselectedElements" },
			{ option: "removeVideoSrc", action: "insertVideoPosters" },
			{ option: "removeFrames", action: "removeFrames" },
			{ option: "removeVideoSrc", action: "removeVideoSources" },
			{ option: "removeAudioSrc", action: "removeAudioSources" },
			{ action: "removeDiscardedResources" },
			{ option: "removeHiddenElements", action: "removeHiddenElements" },
			{ action: "resolveHrefs" },
			{ action: "resolveStyleAttributeURLs" }
		],
		parallel: [
			{ action: "resolveStylesheetURLs" },
			{ option: "!removeFrames", action: "resolveFrameURLs" },
			{ action: "resolveHtmlImportURLs" }
		]
	}, {
		sequential: [
			{ option: "removeUnusedStyles", action: "removeUnusedStyles" },
			{ option: "removeAlternativeMedias", action: "removeAlternativeMedias" },
			{ option: "removeUnusedFonts", action: "removeUnusedFonts" }
		],
		parallel: [
			{ action: "processStylesheets" },
			{ action: "processStyleAttributes" },
			{ action: "processPageResources" },
			{ option: "!removeScripts", action: "processScripts" }
		]
	}, {
		sequential: [
			{ option: "removeAlternativeImages", action: "removeAlternativeImages" }
		],
		parallel: [
			{ option: "removeAlternativeFonts", action: "removeAlternativeFonts" },
			{ option: "!removeFrames", action: "processFrames" },
			{ option: "!removeImports", action: "processHtmlImports" },
		]
	}, {
		sequential: [
			{ action: "replaceStylesheets" },
			{ action: "replaceStyleAttributes" },
			{ action: "insertVariables" },
			{ option: "compressHTML", action: "compressHTML" },
			{ action: "cleanupPage" }
		],
		parallel: [
			{ option: "enableMaff", action: "insertMAFFMetaData" },
			{ action: "setDocInfo" }
		]
	}];

	class Runner {
		constructor(options, root) {
			const rootDocDefined = root && options.doc;
			this.root = root;
			this.options = options;
			this.options.url = this.options.url || (rootDocDefined && this.options.doc.location.href);
			const matchResourceReferrer = this.options.url.match(/^.*\//);
			this.options.resourceReferrer = this.options.passReferrerOnError && matchResourceReferrer && matchResourceReferrer[0];
			this.options.baseURI = rootDocDefined && this.options.doc.baseURI;
			this.options.rootDocument = root;
			this.options.updatedResources = this.options.updatedResources || {};
			this.options.fontTests = new Map$1();
			this.batchRequest = new BatchRequest();
			this.processor = new Processor(options, this.batchRequest);
			if (rootDocDefined) {
				const docData = util.preProcessDoc(this.options.doc, this.options.win, this.options);
				this.options.canvases = docData.canvases;
				this.options.fonts = docData.fonts;
				this.options.stylesheets = docData.stylesheets;
				this.options.images = docData.images;
				this.options.posters = docData.posters;
				this.options.usedFonts = docData.usedFonts;
				this.options.shadowRoots = docData.shadowRoots;
				this.options.imports = docData.imports;
				this.options.referrer = docData.referrer;
				this.markedElements = docData.markedElements;
			}
			if (this.options.saveRawPage) {
				this.options.removeFrames = true;
			}
			this.options.content = this.options.content || (rootDocDefined ? util.serialize(this.options.doc) : null);
			this.onprogress = options.onprogress || (() => { });
		}

		async loadPage() {
			this.onprogress(new ProgressEvent(PAGE_LOADING, { pageURL: this.options.url, frame: !this.root }));
			await this.processor.loadPage(this.options.content);
			this.onprogress(new ProgressEvent(PAGE_LOADED, { pageURL: this.options.url, frame: !this.root }));
		}

		async initialize() {
			this.onprogress(new ProgressEvent(RESOURCES_INITIALIZING, { pageURL: this.options.url }));
			await this.executeStage(RESOLVE_URLS_STAGE);
			this.pendingPromises = this.executeStage(REPLACE_DATA_STAGE);
			if (this.root && this.options.doc) {
				util.postProcessDoc(this.options.doc, this.markedElements);
			}
		}

		cancel() {
			this.cancelled = true;
			this.batchRequest.cancel();
			if (this.root) {
				if (this.options.frames) {
					this.options.frames.forEach(cancelRunner);
				}
				if (this.options.imports) {
					this.options.imports.forEach(cancelRunner);
				}
			}

			function cancelRunner(resourceData) {
				if (resourceData.runner) {
					resourceData.runner.cancel();
				}
			}
		}

		async run() {
			if (this.root) {
				this.processor.initialize(this.batchRequest);
				this.onprogress(new ProgressEvent(RESOURCES_INITIALIZED, { pageURL: this.options.url, max: this.processor.maxResources }));
			}
			await this.batchRequest.run(detail => {
				detail.pageURL = this.options.url;
				this.onprogress(new ProgressEvent(RESOURCE_LOADED, detail));
			}, this.options);
			await this.pendingPromises;
			this.options.doc = null;
			this.options.win = null;
			await this.executeStage(REPLACE_DOCS_STAGE);
			await this.executeStage(POST_PROCESS_STAGE);
			this.processor.finalize();
		}

		getDocument() {
			return this.processor.doc;
		}

		getStyleSheets() {
			return this.processor.stylesheets;
		}

		getPageData() {
			if (this.root) {
				this.onprogress(new ProgressEvent(PAGE_ENDED, { pageURL: this.options.url }));
			}
			return this.processor.getPageData();
		}

		async executeStage(step) {
			const frame = !this.root;
			this.onprogress(new ProgressEvent(STAGE_STARTED, { pageURL: this.options.url, step, frame }));
			STAGES[step].sequential.forEach(task => {
				this.onprogress(new ProgressEvent(STAGE_TASK_STARTED, { pageURL: this.options.url, step, task: task.action, frame }));
				if (!this.cancelled) {
					this.executeTask(task);
				}
				this.onprogress(new ProgressEvent(STAGE_TASK_ENDED, { pageURL: this.options.url, step, task: task.action, frame }));
			});
			let parallelTasksPromise;
			if (STAGES[step].parallel) {
				parallelTasksPromise = await Promise.all(STAGES[step].parallel.map(async task => {
					this.onprogress(new ProgressEvent(STAGE_TASK_STARTED, { pageURL: this.options.url, step, task: task.action, frame }));
					if (!this.cancelled) {
						await this.executeTask(task);
					}
					this.onprogress(new ProgressEvent(STAGE_TASK_ENDED, { pageURL: this.options.url, step, task: task.action, frame }));
				}));
			} else {
				parallelTasksPromise = Promise.resolve();
			}
			this.onprogress(new ProgressEvent(STAGE_ENDED, { pageURL: this.options.url, step, frame }));
			return parallelTasksPromise;
		}

		executeTask(task) {
			if (!task.option || ((task.option.startsWith("!") && !this.options[task.option]) || this.options[task.option])) {
				return this.processor[task.action]();
			}
		}
	}

	// ------------
	// BatchRequest
	// ------------
	class BatchRequest {
		constructor() {
			this.requests = new Map$1();
			this.duplicates = new Map$1();
		}

		addURL(resourceURL, { asBinary, expectedType, groupDuplicates, baseURI, blockMixedContent } = {}) {
			return new Promise((resolve, reject) => {
				const requestKey = JSON.stringify([resourceURL, asBinary, expectedType, baseURI, blockMixedContent]);
				let resourceRequests = this.requests.get(requestKey);
				if (!resourceRequests) {
					resourceRequests = [];
					this.requests.set(requestKey, resourceRequests);
				}
				const callbacks = { resolve, reject };
				resourceRequests.push(callbacks);
				if (groupDuplicates) {
					let duplicateRequests = this.duplicates.get(requestKey);
					if (!duplicateRequests) {
						duplicateRequests = [];
						this.duplicates.set(requestKey, duplicateRequests);
					}
					duplicateRequests.push(callbacks);
				}
			});
		}

		getMaxResources() {
			return this.requests.size;
		}

		run(onloadListener, options) {
			const resourceURLs = [...this.requests.keys()];
			let indexResource = 0;
			return Promise.all(resourceURLs.map(async requestKey => {
				const [resourceURL, asBinary, expectedType, baseURI, blockMixedContent] = JSON.parse(requestKey);
				const resourceRequests = this.requests.get(requestKey);
				try {
					const currentIndexResource = indexResource;
					indexResource = indexResource + 1;
					const content = await util.getContent(resourceURL, {
						asBinary,
						expectedType,
						maxResourceSize: options.maxResourceSize,
						maxResourceSizeEnabled: options.maxResourceSizeEnabled,
						frameId: options.windowId,
						resourceReferrer: options.resourceReferrer,
						baseURI,
						blockMixedContent,
						acceptHeaders: options.acceptHeaders
					});
					onloadListener({ url: resourceURL });
					if (!this.cancelled) {
						resourceRequests.forEach(callbacks => {
							const duplicateCallbacks = this.duplicates.get(requestKey);
							const duplicate = duplicateCallbacks && duplicateCallbacks.length > 1 && duplicateCallbacks.includes(callbacks);
							callbacks.resolve({ content: content.data, indexResource: currentIndexResource, duplicate });
						});
					}
				} catch (error) {
					indexResource = indexResource + 1;
					onloadListener({ url: resourceURL });
					resourceRequests.forEach(resourceRequest => resourceRequest.reject(error));
				}
				this.requests.delete(requestKey);
			}));
		}

		cancel() {
			this.cancelled = true;
			const resourceURLs = [...this.requests.keys()];
			resourceURLs.forEach(requestKey => {
				const resourceRequests = this.requests.get(requestKey);
				resourceRequests.forEach(callbacks => callbacks.reject());
				this.requests.delete(requestKey);
			});
		}
	}

	// ---------
	// Processor
	// ---------
	const PREFIXES_FORBIDDEN_DATA_URI = ["data:text/"];
	const PREFIX_DATA_URI_IMAGE_SVG = "data:image/svg+xml";
	const EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
	const SCRIPT_TAG_FOUND = /<script/gi;
	const NOSCRIPT_TAG_FOUND = /<noscript/gi;
	const CANVAS_TAG_FOUND = /<canvas/gi;
	const SHADOW_MODE_ATTRIBUTE_NAME = "shadowmode";
	const SHADOW_DELEGATE_FOCUS_ATTRIBUTE_NAME = "delegatesfocus";
	const SCRIPT_TEMPLATE_SHADOW_ROOT = "data-template-shadow-root";
	const UTF8_CHARSET = "utf-8";

	class Processor {
		constructor(options, batchRequest) {
			this.options = options;
			this.stats = new Stats(options);
			this.baseURI = normalizeURL(options.baseURI || options.url);
			this.batchRequest = batchRequest;
			this.stylesheets = new Map$1();
			this.styles = new Map$1();
			this.cssVariables = new Map$1();
			this.fontTests = options.fontTests;
		}

		initialize() {
			this.options.saveDate = new Date();
			this.options.saveUrl = this.options.url;
			if (this.options.enableMaff) {
				this.maffMetaDataPromise = this.batchRequest.addURL(util.resolveURL("index.rdf", this.options.baseURI || this.options.url), { expectedType: "document" });
			}
			this.maxResources = this.batchRequest.getMaxResources();
			if (!this.options.saveRawPage && !this.options.removeFrames && this.options.frames) {
				this.options.frames.forEach(frameData => this.maxResources += frameData.maxResources || 0);
			}
			if (!this.options.removeImports && this.options.imports) {
				this.options.imports.forEach(importData => this.maxResources += importData.maxResources || 0);
			}
			this.stats.set("processed", "resources", this.maxResources);
		}

		async loadPage(pageContent, charset) {
			let content;
			if (!pageContent || this.options.saveRawPage) {
				content = await util.getContent(this.baseURI, {
					maxResourceSize: this.options.maxResourceSize,
					maxResourceSizeEnabled: this.options.maxResourceSizeEnabled,
					charset,
					frameId: this.options.windowId,
					resourceReferrer: this.options.resourceReferrer,
					expectedType: "document",
					acceptHeaders: this.options.acceptHeaders
				});
				pageContent = content.data;
			}
			this.doc = util.parseDocContent(pageContent, this.baseURI);
			if (this.options.saveRawPage) {
				let charset;
				this.doc.querySelectorAll("meta[charset], meta[http-equiv=\"content-type\"]").forEach(element => {
					const charsetDeclaration = element.content.split(";")[1];
					if (charsetDeclaration && !charset) {
						charset = charsetDeclaration.split("=")[1].trim().toLowerCase();
					}
				});
				if (charset && content.charset && charset.toLowerCase() != content.charset.toLowerCase()) {
					return this.loadPage(pageContent, charset);
				}
			}
			this.workStyleElement = this.doc.createElement("style");
			this.doc.body.appendChild(this.workStyleElement);
			this.onEventAttributeNames = getOnEventAttributeNames(this.doc);
		}

		finalize() {
			if (this.workStyleElement.parentNode) {
				this.workStyleElement.remove();
			}
		}

		async getPageData() {
			util.postProcessDoc(this.doc);
			const url = util.parseURL(this.baseURI);
			if (this.options.insertSingleFileComment) {
				const firstComment = this.doc.documentElement.firstChild;
				let infobarURL = this.options.saveUrl, infobarSaveDate = this.options.saveDate;
				if (firstComment.nodeType == 8 && (firstComment.textContent.includes(util.COMMENT_HEADER_LEGACY) || firstComment.textContent.includes(util.COMMENT_HEADER))) {
					const info = this.doc.documentElement.firstChild.textContent.split("\n");
					const [, , url, saveDate] = info;
					infobarURL = url.split("url: ")[1];
					infobarSaveDate = saveDate.split("saved date: ")[1];
					firstComment.remove();
				}
				const infobarContent = (this.options.infobarContent || "").replace(/\\n/g, "\n").replace(/\\t/g, "\t");
				const commentNode = this.doc.createComment("\n " + (this.options.useLegacyCommentHeader ? util.COMMENT_HEADER_LEGACY : util.COMMENT_HEADER) +
					" \n url: " + infobarURL +
					" \n saved date: " + infobarSaveDate +
					(infobarContent ? " \n info: " + infobarContent : "") + "\n");
				this.doc.documentElement.insertBefore(commentNode, this.doc.documentElement.firstChild);
			}
			if (this.options.insertCanonicalLink && this.options.saveUrl.match(HTTP_URI_PREFIX)) {
				let canonicalLink = this.doc.querySelector("link[rel=canonical]");
				if (!canonicalLink) {
					canonicalLink = this.doc.createElement("link");
					canonicalLink.setAttribute("rel", "canonical");
					this.doc.head.appendChild(canonicalLink);
				}
				if (canonicalLink && !canonicalLink.href) {
					canonicalLink.href = this.options.saveUrl;
				}
			}
			if (this.options.insertMetaCSP) {
				const metaTag = this.doc.createElement("meta");
				metaTag.httpEquiv = "content-security-policy";
				metaTag.content = "default-src 'none'; font-src 'self' data:; img-src 'self' data:; style-src 'unsafe-inline'; media-src 'self' data:; script-src 'unsafe-inline' data:;";
				this.doc.head.appendChild(metaTag);
			}
			if (this.options.insertMetaNoIndex) {
				let metaElement = this.doc.querySelector("meta[name=robots][content*=noindex]");
				if (!metaElement) {
					metaElement = this.doc.createElement("meta");
					metaElement.setAttribute("name", "robots");
					metaElement.setAttribute("content", "noindex");
					this.doc.head.appendChild(metaElement);
				}
			}
			let size;
			if (this.options.displayStats) {
				size = util.getContentSize(this.doc.documentElement.outerHTML);
			}
			const content = util.serialize(this.doc, this.options.compressHTML);
			if (this.options.displayStats) {
				const contentSize = util.getContentSize(content);
				this.stats.set("processed", "HTML bytes", contentSize);
				this.stats.add("discarded", "HTML bytes", size - contentSize);
			}
			let filename = await ProcessorHelper.evalTemplate(this.options.filenameTemplate, this.options, content) || "";
			const replacementCharacter = this.options.filenameReplacementCharacter;
			filename = util.getValidFilename(filename, this.options.filenameReplacedCharacters, replacementCharacter);
			if (!this.options.backgroundSave) {
				filename = filename.replace(/\//g, replacementCharacter);
			}
			if (!this.options.saveToGDrive && !this.options.saveToGitHub && !this.options.saveWithCompanion && util.getContentSize(filename) > this.options.filenameMaxLength) {
				const extensionMatch = filename.match(/(\.[^.]{3,4})$/);
				const extension = extensionMatch && extensionMatch[0] && extensionMatch[0].length > 1 ? extensionMatch[0] : "";
				filename = await util.truncateText(filename, this.options.filenameMaxLength - extension.length);
				filename = filename + "…" + extension;
			}
			if (!filename) {
				filename = "Unnamed page";
			}
			const matchTitle = this.baseURI.match(/([^/]*)\/?(\.html?.*)$/) || this.baseURI.match(/\/\/([^/]*)\/?$/);
			const pageData = {
				stats: this.stats.data,
				title: this.options.title || (this.baseURI && matchTitle ? matchTitle[1] : (url.hostname ? url.hostname : "")),
				filename,
				content
			};
			if (this.options.addProof) {
				pageData.hash = await util.digest("SHA-256", content);
			}
			if (this.options.retrieveLinks) {
				pageData.links = Array.from(new Set$1(Array.from(this.doc.links).map(linkElement => linkElement.href)));
			}
			return pageData;
		}

		preProcessPage() {
			if (this.options.win) {
				this.doc.body.querySelectorAll(":not(svg) title, meta, link[href][rel*=\"icon\"]").forEach(element => element instanceof this.options.win.HTMLElement && this.doc.head.appendChild(element));
			}
			if (this.options.images && !this.options.saveRawPage) {
				this.doc.querySelectorAll("img[" + util.IMAGE_ATTRIBUTE_NAME + "]").forEach(imgElement => {
					const attributeValue = imgElement.getAttribute(util.IMAGE_ATTRIBUTE_NAME);
					if (attributeValue) {
						const imageData = this.options.images[Number(attributeValue)];
						if (imageData) {
							if (this.options.removeHiddenElements && (
								(imageData.size && !imageData.size.pxWidth && !imageData.size.pxHeight) ||
								(imgElement.getAttribute(util.HIDDEN_CONTENT_ATTRIBUTE_NAME) == "")
							)) {
								imgElement.setAttribute("src", EMPTY_IMAGE);
							} else {
								if (imageData.currentSrc) {
									imgElement.dataset.singleFileOriginURL = imgElement.getAttribute("src");
									imgElement.setAttribute("src", imageData.currentSrc);
								}
								if (this.options.loadDeferredImages) {
									if ((!imgElement.getAttribute("src") || imgElement.getAttribute("src") == EMPTY_IMAGE) && imgElement.getAttribute("data-src")) {
										imageData.src = imgElement.dataset.src;
										imgElement.setAttribute("src", imgElement.dataset.src);
										imgElement.removeAttribute("data-src");
									}
								}
							}
						}
					}
				});
				if (this.options.loadDeferredImages) {
					this.doc.querySelectorAll("img[data-srcset]").forEach(imgElement => {
						if (!imgElement.getAttribute("srcset") && imgElement.getAttribute("data-srcset")) {
							imgElement.setAttribute("srcset", imgElement.dataset.srcset);
							imgElement.removeAttribute("data-srcset");
						}
					});
				}
			}
		}

		replaceStyleContents() {
			if (this.options.stylesheets) {
				this.doc.querySelectorAll("style").forEach((styleElement, styleIndex) => {
					const attributeValue = styleElement.getAttribute(util.STYLESHEET_ATTRIBUTE_NAME);
					if (attributeValue) {
						const stylesheetContent = this.options.stylesheets[Number(styleIndex)];
						if (stylesheetContent) {
							styleElement.textContent = stylesheetContent;
						}
					}
				});
			}
		}

		removeUnselectedElements() {
			removeUnmarkedElements(this.doc.body);
			this.doc.body.removeAttribute(util.SELECTED_CONTENT_ATTRIBUTE_NAME);

			function removeUnmarkedElements(element) {
				let selectedElementFound = false;
				Array.from(element.childNodes).forEach(node => {
					if (node.nodeType == 1) {
						const isSelectedElement = node.getAttribute(util.SELECTED_CONTENT_ATTRIBUTE_NAME) == "";
						selectedElementFound = selectedElementFound || isSelectedElement;
						if (isSelectedElement) {
							node.removeAttribute(util.SELECTED_CONTENT_ATTRIBUTE_NAME);
							removeUnmarkedElements(node);
						} else if (selectedElementFound) {
							removeNode(node);
						} else {
							hideNode(node);
						}
					}
				});
			}

			function removeNode(node) {
				if ((node.nodeType != 1 || !node.querySelector("svg,style,link")) && canHideNode(node)) {
					node.remove();
				} else {
					hideNode(node);
				}
			}

			function hideNode(node) {
				if (canHideNode(node)) {
					node.style.setProperty("display", "none", "important");
					Array.from(node.childNodes).forEach(removeNode);
				}
			}

			function canHideNode(node) {
				if (node.nodeType == 1) {
					const tagName = node.tagName && node.tagName.toLowerCase();
					return (tagName != "svg" && tagName != "style" && tagName != "link");
				}
			}
		}

		insertVideoPosters() {
			if (this.options.posters) {
				this.doc.querySelectorAll("video[src], video > source[src]").forEach(element => {
					let videoElement;
					if (element.tagName == "VIDEO") {
						videoElement = element;
					} else {
						videoElement = element.parentElement;
					}
					const attributeValue = element.getAttribute(util.POSTER_ATTRIBUTE_NAME);
					if (attributeValue) {
						const posterURL = this.options.posters[Number(attributeValue)];
						if (!videoElement.poster && posterURL) {
							videoElement.setAttribute("poster", posterURL);
						}
					}
				});
			}
		}

		removeFrames() {
			const frameElements = this.doc.querySelectorAll("iframe, frame, object[type=\"text/html\"][data]");
			this.stats.set("discarded", "frames", frameElements.length);
			this.stats.set("processed", "frames", frameElements.length);
			this.doc.querySelectorAll("iframe, frame, object[type=\"text/html\"][data]").forEach(element => element.remove());
		}

		removeScripts() {
			this.onEventAttributeNames.forEach(attributeName => this.doc.querySelectorAll("[" + attributeName + "]").forEach(element => element.removeAttribute(attributeName)));
			this.doc.querySelectorAll("[href]").forEach(element => {
				if (element.href && element.href.match && element.href.match(/^\s*javascript:/)) {
					element.setAttribute("href", "");
				}
			});
			this.doc.querySelectorAll("[src]").forEach(element => {
				if (element.src && element.src.match(/^\s*javascript:/)) {
					element.removeAttribute("src");
				}
			});
			const scriptElements = this.doc.querySelectorAll("script:not([type=\"application/ld+json\"]):not([" + SCRIPT_TEMPLATE_SHADOW_ROOT + "])");
			this.stats.set("discarded", "scripts", scriptElements.length);
			this.stats.set("processed", "scripts", scriptElements.length);
			scriptElements.forEach(element => element.remove());
		}

		removeVideoSources() {
			const videoSourceElements = this.doc.querySelectorAll("video[src], video > source");
			this.stats.set("discarded", "video sources", videoSourceElements.length);
			this.stats.set("processed", "video sources", videoSourceElements.length);
			videoSourceElements.forEach(element => {
				if (element.tagName == "SOURCE") {
					element.remove();
				} else {
					videoSourceElements.forEach(element => element.removeAttribute("src"));
				}
			});
		}

		removeAudioSources() {
			const audioSourceElements = this.doc.querySelectorAll("audio[src], audio > source[src]");
			this.stats.set("discarded", "audio sources", audioSourceElements.length);
			this.stats.set("processed", "audio sources", audioSourceElements.length);
			audioSourceElements.forEach(element => {
				if (element.tagName == "SOURCE") {
					element.remove();
				} else {
					audioSourceElements.forEach(element => element.removeAttribute("src"));
				}
			});
		}

		removeDiscardedResources() {
			this.doc.querySelectorAll("." + util.SINGLE_FILE_UI_ELEMENT_CLASS).forEach(element => element.remove());
			this.doc.querySelectorAll("button button").forEach(element => element.remove());
			this.doc.querySelectorAll("meta[http-equiv=refresh], meta[disabled-http-equiv], meta[http-equiv=\"content-security-policy\"]").forEach(element => element.remove());
			const objectElements = this.doc.querySelectorAll("applet, object[data]:not([type=\"image/svg+xml\"]):not([type=\"image/svg-xml\"]):not([type=\"text/html\"]), embed[src]:not([src*=\".svg\"]):not([src*=\".pdf\"])");
			this.stats.set("discarded", "objects", objectElements.length);
			this.stats.set("processed", "objects", objectElements.length);
			objectElements.forEach(element => element.remove());
			const replacedAttributeValue = this.doc.querySelectorAll("link[rel~=preconnect], link[rel~=prerender], link[rel~=dns-prefetch], link[rel~=preload], link[rel~=manifest], link[rel~=prefetch]");
			replacedAttributeValue.forEach(element => {
				let regExp;
				if (this.options.removeScripts) {
					regExp = /(preconnect|prerender|dns-prefetch|preload|prefetch|manifest)/g;
				} else {
					regExp = /(preconnect|prerender|dns-prefetch|prefetch|manifest)/g;
				}
				const relValue = element.getAttribute("rel").replace(regExp, "").trim();
				if (relValue.length) {
					element.setAttribute("rel", relValue);
				} else {
					element.remove();
				}
			});
			this.doc.querySelectorAll("link[rel*=stylesheet][rel*=alternate][title],link[rel*=stylesheet]:not([href]),link[rel*=stylesheet][href=\"\"]").forEach(element => element.remove());
			if (this.options.removeHiddenElements) {
				this.doc.querySelectorAll("input[type=hidden]").forEach(element => element.remove());
			}
			if (!this.options.saveFavicon) {
				this.doc.querySelectorAll("link[rel*=\"icon\"]").forEach(element => element.remove());
			}
			this.doc.querySelectorAll("a[ping]").forEach(element => element.removeAttribute("ping"));
		}

		resetCharsetMeta() {
			let charset;
			this.doc.querySelectorAll("meta[charset], meta[http-equiv=\"content-type\"]").forEach(element => {
				const charsetDeclaration = element.content.split(";")[1];
				if (charsetDeclaration && !charset) {
					charset = charsetDeclaration.split("=")[1];
					if (charset) {
						this.charset = charset.trim().toLowerCase();
					}
				}
				element.remove();
			});
			const metaElement = this.doc.createElement("meta");
			metaElement.setAttribute("charset", UTF8_CHARSET);
			if (this.doc.head.firstChild) {
				this.doc.head.insertBefore(metaElement, this.doc.head.firstChild);
			} else {
				this.doc.head.appendChild(metaElement);
			}
		}

		setInputValues() {
			this.doc.querySelectorAll("input:not([type=radio]):not([type=checkbox])").forEach(input => {
				const value = input.getAttribute(util.INPUT_VALUE_ATTRIBUTE_NAME);
				input.setAttribute("value", value || "");
			});
			this.doc.querySelectorAll("input[type=radio], input[type=checkbox]").forEach(input => {
				const value = input.getAttribute(util.INPUT_VALUE_ATTRIBUTE_NAME);
				if (value == "true") {
					input.setAttribute("checked", "");
				}
			});
			this.doc.querySelectorAll("textarea").forEach(textarea => {
				const value = textarea.getAttribute(util.INPUT_VALUE_ATTRIBUTE_NAME);
				textarea.textContent = value || "";
			});
			this.doc.querySelectorAll("select").forEach(select => {
				select.querySelectorAll("option").forEach(option => {
					const selected = option.getAttribute(util.INPUT_VALUE_ATTRIBUTE_NAME) != null;
					if (selected) {
						option.setAttribute("selected", "");
					}
				});
			});
		}

		moveStylesInHead() {
			this.doc.querySelectorAll("style").forEach(stylesheet => {
				if (stylesheet.getAttribute(util.STYLE_ATTRIBUTE_NAME) == "") {
					this.doc.head.appendChild(stylesheet);
				}
			});
		}

		saveFavicon() {
			let faviconElement = this.doc.querySelector("link[href][rel=\"icon\"]");
			if (!faviconElement) {
				faviconElement = this.doc.querySelector("link[href][rel=\"shortcut icon\"]");
			}
			if (!faviconElement) {
				faviconElement = this.doc.createElement("link");
				faviconElement.setAttribute("type", "image/x-icon");
				faviconElement.setAttribute("rel", "shortcut icon");
				faviconElement.setAttribute("href", "/favicon.ico");
			}
			this.doc.head.appendChild(faviconElement);
		}

		replaceCanvasElements() {
			if (this.options.canvases) {
				this.doc.querySelectorAll("canvas").forEach(canvasElement => {
					const attributeValue = canvasElement.getAttribute(util.CANVAS_ATTRIBUTE_NAME);
					if (attributeValue) {
						const canvasData = this.options.canvases[Number(attributeValue)];
						if (canvasData) {
							ProcessorHelper.setBackgroundImage(canvasElement, "url(" + canvasData.dataURI + ")");
							this.stats.add("processed", "canvas", 1);
						}
					}
				});
			}
		}

		insertFonts() {
			if (this.options.fonts && this.options.fonts.length) {
				let stylesheetContent = "";
				this.options.fonts.forEach(fontData => {
					if (fontData["font-family"] && fontData.src) {
						stylesheetContent += "@font-face{";
						let stylesContent = "";
						Object.keys(fontData).forEach(fontStyle => {
							if (stylesContent) {
								stylesContent += ";";
							}
							stylesContent += fontStyle + ":" + fontData[fontStyle];
						});
						stylesheetContent += stylesContent + "}";
					}
				});
				if (stylesheetContent) {
					const styleElement = this.doc.createElement("style");
					styleElement.textContent = stylesheetContent;
					const existingStyleElement = this.doc.querySelector("style");
					if (existingStyleElement) {
						existingStyleElement.parentElement.insertBefore(styleElement, existingStyleElement);
					} else {
						this.doc.head.insertBefore(styleElement, this.doc.head.firstChild);
					}
				}
			}
		}

		removeHiddenElements() {
			const hiddenElements = this.doc.querySelectorAll("[" + util.HIDDEN_CONTENT_ATTRIBUTE_NAME + "]");
			const removedElements = this.doc.querySelectorAll("[" + util.REMOVED_CONTENT_ATTRIBUTE_NAME + "]");
			this.stats.set("discarded", "hidden elements", removedElements.length);
			this.stats.set("processed", "hidden elements", removedElements.length);
			if (hiddenElements.length) {
				const styleElement = this.doc.createElement("style");
				styleElement.textContent = ".sf-hidden{display:none!important;}";
				this.doc.head.appendChild(styleElement);
				hiddenElements.forEach(element => {
					if (element.style.getPropertyValue("display") != "none") {
						if (element.style.getPropertyPriority("display") == "important") {
							element.style.setProperty("display", "none", "important");
						} else {
							element.classList.add("sf-hidden");
						}
					}
				});
			}
			removedElements.forEach(element => element.remove());
		}

		resolveHrefs() {
			this.doc.querySelectorAll("a[href], area[href], link[href]").forEach(element => {
				const href = element.getAttribute("href").trim();
				if (element.tagName == "LINK" && element.rel.includes("stylesheet")) {
					if (this.options.saveOriginalURLs && !isDataURL(href)) {
						element.setAttribute("data-sf-original-href", href);
					}
				}
				if (!testIgnoredPath(href)) {
					let resolvedURL;
					try {
						resolvedURL = util.resolveURL(href, this.options.baseURI || this.options.url);
					} catch (error) {
						// ignored
					}
					if (resolvedURL) {
						const url = normalizeURL(this.options.url);
						if (resolvedURL.startsWith(url + "#") && !resolvedURL.startsWith(url + "#!") && !this.options.resolveFragmentIdentifierURLs) {
							resolvedURL = resolvedURL.substring(url.length);
						}
						try {
							element.setAttribute("href", resolvedURL);
						} catch (error) {
							// ignored
						}
					}
				}
			});
		}

		resolveStyleAttributeURLs() {
			this.doc.querySelectorAll("[style]").forEach(element => {
				let styleContent = element.getAttribute("style");
				if (this.options.compressCSS) {
					styleContent = util.compressCSS(styleContent);
				}
				styleContent = ProcessorHelper.resolveStylesheetURLs(styleContent, this.baseURI, this.workStyleElement, this.options.saveOriginalURLs);
				const declarationList = cssTree.parse(styleContent, { context: "declarationList" });
				this.styles.set(element, declarationList);
			});
		}

		async resolveStylesheetURLs() {
			await Promise.all(Array.from(this.doc.querySelectorAll("style, link[rel*=stylesheet]")).map(async element => {
				const options = {
					maxResourceSize: this.options.maxResourceSize,
					maxResourceSizeEnabled: this.options.maxResourceSizeEnabled,
					url: this.options.url,
					charset: this.charset,
					compressCSS: this.options.compressCSS,
					updatedResources: this.options.updatedResources,
					rootDocument: this.options.rootDocument,
					frameId: this.options.windowId,
					resourceReferrer: this.options.resourceReferrer,
					blockMixedContent: this.options.blockMixedContent,
					saveOriginalURLs: this.options.saveOriginalURLs,
					acceptHeaders: this.options.acceptHeaders
				};
				let mediaText;
				if (element.media) {
					mediaText = element.media.toLowerCase();
				}
				const stylesheetInfo = { mediaText };
				if (element.closest("[" + SHADOW_MODE_ATTRIBUTE_NAME + "]")) {
					stylesheetInfo.scoped = true;
				}
				if (element.tagName == "LINK" && element.charset) {
					options.charset = element.charset;
				}
				await processElement(element, stylesheetInfo, this.stylesheets, this.baseURI, options, this.workStyleElement);
			}));
			if (this.options.rootDocument) {
				const newResources = Object.keys(this.options.updatedResources).filter(url => this.options.updatedResources[url].type == "stylesheet" && !this.options.updatedResources[url].retrieved).map(url => this.options.updatedResources[url]);
				await Promise.all(newResources.map(async resource => {
					resource.retrieved = true;
					const stylesheetInfo = {};
					const element = this.doc.createElement("style");
					this.doc.body.appendChild(element);
					element.textContent = resource.content;
					await processElement(element, stylesheetInfo, this.stylesheets, this.baseURI, this.options, this.workStyleElement);
				}));
			}

			async function processElement(element, stylesheetInfo, stylesheets, baseURI, options, workStyleElement) {
				stylesheets.set(element, stylesheetInfo);
				let stylesheetContent = await getStylesheetContent(element, baseURI, options, workStyleElement);
				if (!matchCharsetEquals(stylesheetContent, options.charset)) {
					options = Object.assign({}, options, { charset: getCharset(stylesheetContent) });
					stylesheetContent = await getStylesheetContent(element, baseURI, options, workStyleElement);
				}
				let stylesheet;
				try {
					stylesheet = cssTree.parse(removeCssComments(stylesheetContent));
				} catch (error) {
					// ignored
				}
				if (stylesheet && stylesheet.children) {
					if (options.compressCSS) {
						ProcessorHelper.removeSingleLineCssComments(stylesheet);
					}
					stylesheetInfo.stylesheet = stylesheet;
				} else {
					stylesheets.delete(element);
				}
			}

			async function getStylesheetContent(element, baseURI, options, workStyleElement) {
				let content;
				if (element.tagName == "LINK") {
					content = await ProcessorHelper.resolveLinkStylesheetURLs(element.href, baseURI, options, workStyleElement);
				} else {
					content = await ProcessorHelper.resolveImportURLs(element.textContent, baseURI, options, workStyleElement);
				}
				return content || "";
			}
		}

		async resolveFrameURLs() {
			if (!this.options.saveRawPage) {
				const frameElements = Array.from(this.doc.querySelectorAll("iframe, frame, object[type=\"text/html\"][data]"));
				await Promise.all(frameElements.map(async frameElement => {
					if (frameElement.tagName == "OBJECT") {
						frameElement.setAttribute("data", "data:text/html,");
					} else {
						const src = frameElement.getAttribute("src");
						if (this.options.saveOriginalURLs && !isDataURL(src)) {
							frameElement.setAttribute("data-sf-original-src", src);
						}
						frameElement.removeAttribute("src");
						frameElement.removeAttribute("srcdoc");
					}
					Array.from(frameElement.childNodes).forEach(node => node.remove());
					const frameWindowId = frameElement.getAttribute(util.WIN_ID_ATTRIBUTE_NAME);
					if (this.options.frames && frameWindowId) {
						const frameData = this.options.frames.find(frame => frame.windowId == frameWindowId);
						if (frameData) {
							await initializeProcessor(frameData, frameElement, frameWindowId, this.batchRequest, Object.create(this.options));
						}
					}
				}));
			}

			async function initializeProcessor(frameData, frameElement, frameWindowId, batchRequest, options) {
				options.insertSingleFileComment = false;
				options.insertCanonicalLink = false;
				options.insertMetaNoIndex = false;
				options.saveFavicon = false;
				options.url = frameData.baseURI;
				options.windowId = frameWindowId;
				if (frameData.content) {
					options.content = frameData.content;
					options.canvases = frameData.canvases;
					options.fonts = frameData.fonts;
					options.stylesheets = frameData.stylesheets;
					options.images = frameData.images;
					options.posters = frameData.posters;
					options.usedFonts = frameData.usedFonts;
					options.shadowRoots = frameData.shadowRoots;
					options.imports = frameData.imports;
					frameData.runner = new Runner(options);
					frameData.frameElement = frameElement;
					await frameData.runner.loadPage();
					await frameData.runner.initialize();
					frameData.maxResources = batchRequest.getMaxResources();
				}
			}
		}

		insertShadowRootContents() {
			const doc = this.doc;
			const options = this.options;
			if (this.options.shadowRoots && this.options.shadowRoots.length) {
				processElement(this.doc);
				if (this.options.removeScripts) {
					this.doc.querySelectorAll("script[" + SCRIPT_TEMPLATE_SHADOW_ROOT + "]").forEach(element => element.remove());
				}
				const scriptElement = doc.createElement("script");
				scriptElement.setAttribute(SCRIPT_TEMPLATE_SHADOW_ROOT, "");
				scriptElement.textContent = `(()=>{document.currentScript.remove();processNode(document);function processNode(node){node.querySelectorAll("template[${SHADOW_MODE_ATTRIBUTE_NAME}]").forEach(element=>{let shadowRoot = element.parentElement.shadowRoot;if (!shadowRoot) {try {shadowRoot=element.parentElement.attachShadow({mode:element.getAttribute("${SHADOW_MODE_ATTRIBUTE_NAME}"),delegatesFocus:Boolean(element.getAttribute("${SHADOW_DELEGATE_FOCUS_ATTRIBUTE_NAME}"))});shadowRoot.innerHTML=element.innerHTML;element.remove()} catch (error) {} if (shadowRoot) {processNode(shadowRoot)}}})}})()`;
				doc.body.appendChild(scriptElement);
			}

			function processElement(element) {
				const shadowRootElements = Array.from((element.querySelectorAll("[" + util.SHADOW_ROOT_ATTRIBUTE_NAME + "]")));
				shadowRootElements.forEach(element => {
					const attributeValue = element.getAttribute(util.SHADOW_ROOT_ATTRIBUTE_NAME);
					if (attributeValue) {
						const shadowRootData = options.shadowRoots[Number(attributeValue)];
						if (shadowRootData) {
							const templateElement = doc.createElement("template");
							templateElement.setAttribute(SHADOW_MODE_ATTRIBUTE_NAME, shadowRootData.mode);
							if (shadowRootData.delegatesFocus) {
								templateElement.setAttribute(SHADOW_DELEGATE_FOCUS_ATTRIBUTE_NAME, "");
							}
							if (shadowRootData.adoptedStyleSheets) {
								shadowRootData.adoptedStyleSheets.forEach(stylesheetContent => {
									const styleElement = doc.createElement("style");
									styleElement.textContent = stylesheetContent;
									templateElement.appendChild(styleElement);
								});
							}
							const shadowDoc = util.parseDocContent(shadowRootData.content);
							if (shadowDoc.head) {
								const metaCharset = shadowDoc.head.querySelector("meta[charset]");
								if (metaCharset) {
									metaCharset.remove();
								}
								shadowDoc.head.childNodes.forEach(node => templateElement.appendChild(shadowDoc.importNode(node, true)));
							}
							if (shadowDoc.body) {
								shadowDoc.body.childNodes.forEach(node => templateElement.appendChild(shadowDoc.importNode(node, true)));
							}
							processElement(templateElement);
							if (element.firstChild) {
								element.insertBefore(templateElement, element.firstChild);
							} else {
								element.appendChild(templateElement);
							}
						}
					}
				});
			}
		}

		async resolveHtmlImportURLs() {
			const linkElements = Array.from(this.doc.querySelectorAll("link[rel=import][href]"));
			await Promise.all(linkElements.map(async linkElement => {
				const resourceURL = linkElement.href;
				if (this.options.saveOriginalURLs && !isDataURL(resourceURL)) {
					linkElement.setAttribute("data-sf-original-href", resourceURL);
				}
				linkElement.removeAttribute("href");
				const options = Object.create(this.options);
				options.insertSingleFileComment = false;
				options.insertCanonicalLink = false;
				options.insertMetaNoIndex = false;
				options.saveFavicon = false;
				options.removeUnusedStyles = false;
				options.removeAlternativeMedias = false;
				options.removeUnusedFonts = false;
				options.removeHiddenElements = false;
				options.url = resourceURL;
				const attributeValue = linkElement.getAttribute(util.HTML_IMPORT_ATTRIBUTE_NAME);
				if (attributeValue) {
					const importData = options.imports[Number(attributeValue)];
					if (importData) {
						options.content = importData.content;
						importData.runner = new Runner(options);
						await importData.runner.loadPage();
						await importData.runner.initialize();
						if (!options.removeImports) {
							importData.maxResources = importData.runner.batchRequest.getMaxResources();
						}
						importData.runner.getStyleSheets().forEach(stylesheet => {
							const importedStyleElement = this.doc.createElement("style");
							linkElement.insertAdjacentElement("afterEnd", importedStyleElement);
							this.stylesheets.set(importedStyleElement, stylesheet);
						});
					}
				}
				if (options.removeImports) {
					linkElement.remove();
					this.stats.add("discarded", "HTML imports", 1);
				}
			}));
		}

		removeUnusedStyles() {
			if (!this.mediaAllInfo) {
				this.mediaAllInfo = util.getMediaAllInfo(this.doc, this.stylesheets, this.styles);
			}
			const stats = util.minifyCSSRules(this.stylesheets, this.styles, this.mediaAllInfo);
			this.stats.set("processed", "CSS rules", stats.processed);
			this.stats.set("discarded", "CSS rules", stats.discarded);
		}

		removeUnusedFonts() {
			util.removeUnusedFonts(this.doc, this.stylesheets, this.styles, this.options);
		}

		removeAlternativeMedias() {
			const stats = util.minifyMedias(this.stylesheets);
			this.stats.set("processed", "medias", stats.processed);
			this.stats.set("discarded", "medias", stats.discarded);
		}

		async processStylesheets() {
			this.options.fontURLs = new Map$1();
			await Promise.all([...this.stylesheets].map(([, stylesheetInfo]) =>
				ProcessorHelper.processStylesheet(stylesheetInfo.stylesheet.children, this.baseURI, this.options, this.cssVariables, this.batchRequest)
			));
		}

		async processStyleAttributes() {
			return Promise.all([...this.styles].map(([, declarationList]) =>
				ProcessorHelper.processStyle(declarationList.children.toArray(), this.baseURI, this.options, this.cssVariables, this.batchRequest)
			));
		}

		async processPageResources() {
			const processAttributeArgs = [
				["link[href][rel*=\"icon\"]", "href", false, true],
				["object[type=\"image/svg+xml\"], object[type=\"image/svg-xml\"]", "data"],
				["img[src], input[src][type=image]", "src", true],
				["embed[src*=\".svg\"], embed[src*=\".pdf\"]", "src"],
				["video[poster]", "poster"],
				["*[background]", "background"],
				["image", "xlink:href"],
				["image", "href"]
			];
			let resourcePromises = processAttributeArgs.map(([selector, attributeName, processDuplicates, removeElementIfMissing]) =>
				ProcessorHelper.processAttribute(this.doc.querySelectorAll(selector), attributeName, this.baseURI, this.options, this.cssVariables, this.styles, this.batchRequest, processDuplicates, removeElementIfMissing)
			);
			resourcePromises = resourcePromises.concat([
				ProcessorHelper.processXLinks(this.doc.querySelectorAll("use"), this.doc, this.baseURI, this.options, this.batchRequest),
				ProcessorHelper.processSrcset(this.doc.querySelectorAll("img[srcset], source[srcset]"), "srcset", this.baseURI, this.batchRequest)
			]);
			if (!this.options.removeAudioSrc) {
				resourcePromises.push(ProcessorHelper.processAttribute(this.doc.querySelectorAll("audio[src], audio > source[src]"), "src", this.baseURI, this.options, this.cssVariables, this.styles, this.batchRequest));
			}
			if (!this.options.removeVideoSrc) {
				resourcePromises.push(ProcessorHelper.processAttribute(this.doc.querySelectorAll("video[src], video > source[src]"), "src", this.baseURI, this.options, this.cssVariables, this.styles, this.batchRequest));
			}
			await Promise.all(resourcePromises);
			if (this.options.saveFavicon) {
				ProcessorHelper.processShortcutIcons(this.doc);
			}
		}

		async processScripts() {
			await Promise.all(Array.from(this.doc.querySelectorAll("script[src], link[rel=preload][as=script][href]")).map(async element => {
				let resourceURL;
				let scriptSrc;
				if (element.tagName == "SCRIPT") {
					scriptSrc = element.getAttribute("src");
					if (this.options.saveOriginalURLs && !isDataURL(scriptSrc)) {
						element.setAttribute("data-sf-original-src", scriptSrc);
					}
				} else {
					scriptSrc = element.getAttribute("href");
					if (this.options.saveOriginalURLs && !isDataURL(scriptSrc)) {
						element.setAttribute("data-sf-original-href", scriptSrc);
					}
				}
				element.removeAttribute("integrity");
				element.textContent = "";
				try {
					resourceURL = util.resolveURL(scriptSrc, this.baseURI);
				} catch (error) {
					// ignored
				}
				if (testValidURL(resourceURL)) {
					if (element.tagName == "SCRIPT") {
						element.removeAttribute("src");
					} else {
						element.removeAttribute("href");
					}
					this.stats.add("processed", "scripts", 1);
					const content = await util.getContent(resourceURL, {
						asBinary: true,
						charset: this.charset != UTF8_CHARSET && this.charset,
						maxResourceSize: this.options.maxResourceSize,
						maxResourceSizeEnabled: this.options.maxResourceSizeEnabled,
						frameId: this.options.windowId,
						resourceReferrer: this.options.resourceReferrer,
						baseURI: this.options.baseURI,
						blockMixedContent: this.options.blockMixedContent,
						expectedType: "script",
						acceptHeaders: this.options.acceptHeaders
					});
					content.data = getUpdatedResourceContent(resourceURL, content, this.options);
					if (element.tagName == "SCRIPT") {
						element.setAttribute("src", content.data);
						if (element.getAttribute("async") == "" || element.getAttribute("async") == "async" || element.getAttribute(util.ASYNC_SCRIPT_ATTRIBUTE_NAME) == "") {
							element.setAttribute("async", "");
						}
					} else {
						const scriptElement = this.doc.createElement("script");
						scriptElement.setAttribute("src", content.data);
						scriptElement.setAttribute("async", "");
						element.parentElement.replaceChild(scriptElement, element);
					}
				}
			}));
		}

		removeAlternativeImages() {
			util.removeAlternativeImages(this.doc);
		}

		async removeAlternativeFonts() {
			await util.removeAlternativeFonts(this.doc, this.stylesheets, this.options.fontURLs, this.options.fontTests);
		}

		async processFrames() {
			if (this.options.frames) {
				const frameElements = Array.from(this.doc.querySelectorAll("iframe, frame, object[type=\"text/html\"][data]"));
				await Promise.all(frameElements.map(async frameElement => {
					const frameWindowId = frameElement.getAttribute(util.WIN_ID_ATTRIBUTE_NAME);
					if (frameWindowId) {
						const frameData = this.options.frames.find(frame => frame.windowId == frameWindowId);
						if (frameData) {
							this.options.frames = this.options.frames.filter(frame => frame.windowId != frameWindowId);
							if (frameData.runner && frameElement.getAttribute(util.HIDDEN_FRAME_ATTRIBUTE_NAME) != "") {
								this.stats.add("processed", "frames", 1);
								await frameData.runner.run();
								const pageData = await frameData.runner.getPageData();
								frameElement.removeAttribute(util.WIN_ID_ATTRIBUTE_NAME);
								let sandbox = "allow-popups allow-top-navigation allow-top-navigation-by-user-activation";
								if (pageData.content.match(NOSCRIPT_TAG_FOUND) || pageData.content.match(CANVAS_TAG_FOUND) || pageData.content.match(SCRIPT_TAG_FOUND)) {
									sandbox += " allow-scripts allow-same-origin";
								}
								frameElement.setAttribute("sandbox", sandbox);
								if (frameElement.tagName == "OBJECT") {
									frameElement.setAttribute("data", "data:text/html," + pageData.content);
								} else {
									if (frameElement.tagName == "FRAME") {
										frameElement.setAttribute("src", "data:text/html," + pageData.content.replace(/%/g, "%25").replace(/#/g, "%23"));
									} else {
										frameElement.setAttribute("srcdoc", pageData.content);
										frameElement.removeAttribute("src");
									}
								}
								this.stats.addAll(pageData);
							} else {
								frameElement.removeAttribute(util.WIN_ID_ATTRIBUTE_NAME);
								this.stats.add("discarded", "frames", 1);
							}
						}
					}
				}));
			}
		}

		async processHtmlImports() {
			const linkElements = Array.from(this.doc.querySelectorAll("link[rel=import]"));
			await Promise.all(linkElements.map(async linkElement => {
				const attributeValue = linkElement.getAttribute(util.HTML_IMPORT_ATTRIBUTE_NAME);
				if (attributeValue) {
					const importData = this.options.imports[Number(attributeValue)];
					if (importData.runner) {
						this.stats.add("processed", "HTML imports", 1);
						await importData.runner.run();
						const pageData = await importData.runner.getPageData();
						linkElement.removeAttribute(util.HTML_IMPORT_ATTRIBUTE_NAME);
						linkElement.setAttribute("href", "data:text/html," + pageData.content);
						this.stats.addAll(pageData);
					} else {
						this.stats.add("discarded", "HTML imports", 1);
					}
				}
			}));
		}

		replaceStylesheets() {
			this.doc.querySelectorAll("style").forEach(styleElement => {
				const stylesheetInfo = this.stylesheets.get(styleElement);
				if (stylesheetInfo) {
					this.stylesheets.delete(styleElement);
					let stylesheetContent = cssTree.generate(stylesheetInfo.stylesheet);
					if (this.options.saveOriginalURLs) {
						stylesheetContent = replaceOriginalURLs(stylesheetContent);
					}
					styleElement.textContent = stylesheetContent;
					if (stylesheetInfo.mediaText) {
						styleElement.media = stylesheetInfo.mediaText;
					}
				} else {
					styleElement.remove();
				}
			});
			this.doc.querySelectorAll("link[rel*=stylesheet]").forEach(linkElement => {
				const stylesheetInfo = this.stylesheets.get(linkElement);
				if (stylesheetInfo) {
					this.stylesheets.delete(linkElement);
					const styleElement = this.doc.createElement("style");
					if (stylesheetInfo.mediaText) {
						styleElement.media = stylesheetInfo.mediaText;
					}
					let stylesheetContent = cssTree.generate(stylesheetInfo.stylesheet);
					if (this.options.saveOriginalURLs) {
						stylesheetContent = replaceOriginalURLs(stylesheetContent);
						styleElement.setAttribute("data-sf-original-href", linkElement.getAttribute("data-sf-original-href"));
					}
					styleElement.textContent = stylesheetContent;
					linkElement.parentElement.replaceChild(styleElement, linkElement);
				} else {
					linkElement.remove();
				}
			});
		}

		replaceStyleAttributes() {
			this.doc.querySelectorAll("[style]").forEach(element => {
				const declarations = this.styles.get(element);
				if (declarations) {
					this.styles.delete(element);
					let styleContent = cssTree.generate(declarations);
					if (this.options.saveOriginalURLs) {
						styleContent = replaceOriginalURLs(styleContent);
					}
					element.setAttribute("style", styleContent);
				} else {
					element.setAttribute("style", "");
				}
			});
		}

		insertVariables() {
			if (this.cssVariables.size) {
				const styleElement = this.doc.createElement("style");
				const firstStyleElement = this.doc.head.querySelector("style");
				if (firstStyleElement) {
					this.doc.head.insertBefore(styleElement, firstStyleElement);
				} else {
					this.doc.head.appendChild(styleElement);
				}
				let stylesheetContent = "";
				this.cssVariables.forEach(({ content, url }, indexResource) => {
					this.cssVariables.delete(indexResource);
					if (stylesheetContent) {
						stylesheetContent += ";";
					}
					stylesheetContent += `${SINGLE_FILE_VARIABLE_NAME_PREFIX + indexResource}: `;
					if (this.options.saveOriginalURLs) {
						stylesheetContent += `/* original URL: ${url} */ `;
					}
					stylesheetContent += `url("${content}")`;
				});
				styleElement.textContent = ":root{" + stylesheetContent + "}";
			}
		}

		compressHTML() {
			let size;
			if (this.options.displayStats) {
				size = util.getContentSize(this.doc.documentElement.outerHTML);
			}
			util.minifyHTML(this.doc, { PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME: util.PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME });
			if (this.options.displayStats) {
				this.stats.add("discarded", "HTML bytes", size - util.getContentSize(this.doc.documentElement.outerHTML));
			}
		}

		cleanupPage() {
			this.doc.querySelectorAll("base").forEach(element => element.remove());
			const metaCharset = this.doc.head.querySelector("meta[charset]");
			if (metaCharset) {
				this.doc.head.insertBefore(metaCharset, this.doc.head.firstChild);
				if (this.doc.head.querySelectorAll("*").length == 1 && this.doc.body.childNodes.length == 0) {
					this.doc.head.querySelector("meta[charset]").remove();
				}
			}
		}

		resetZoomLevel() {
			const transform = this.doc.documentElement.style.getPropertyValue("-sf-transform");
			const transformPriority = this.doc.documentElement.style.getPropertyPriority("-sf-transform");
			const transformOrigin = this.doc.documentElement.style.getPropertyValue("-sf-transform-origin");
			const transformOriginPriority = this.doc.documentElement.style.getPropertyPriority("-sf-transform-origin");
			const minHeight = this.doc.documentElement.style.getPropertyValue("-sf-min-height");
			const minHeightPriority = this.doc.documentElement.style.getPropertyPriority("-sf-min-height");
			this.doc.documentElement.style.setProperty("transform", transform, transformPriority);
			this.doc.documentElement.style.setProperty("transform-origin", transformOrigin, transformOriginPriority);
			this.doc.documentElement.style.setProperty("min-height", minHeight, minHeightPriority);
			this.doc.documentElement.style.removeProperty("-sf-transform");
			this.doc.documentElement.style.removeProperty("-sf-transform-origin");
			this.doc.documentElement.style.removeProperty("-sf-min-height");
		}

		async insertMAFFMetaData() {
			const maffMetaData = await this.maffMetaDataPromise;
			if (maffMetaData && maffMetaData.content) {
				const NAMESPACE_RDF = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
				const maffDoc = util.parseXMLContent(maffMetaData.content);
				const originalURLElement = maffDoc.querySelector("RDF > Description > originalurl");
				const archiveTimeElement = maffDoc.querySelector("RDF > Description > archivetime");
				if (originalURLElement) {
					this.options.saveUrl = originalURLElement.getAttributeNS(NAMESPACE_RDF, "resource");
				}
				if (archiveTimeElement) {
					const value = archiveTimeElement.getAttributeNS(NAMESPACE_RDF, "resource");
					if (value) {
						const date = new Date(value);
						if (!isNaN(date.getTime())) {
							this.options.saveDate = new Date(value);
						}
					}
				}
			}
		}

		async setDocInfo() {
			const titleElement = this.doc.querySelector("title");
			const descriptionElement = this.doc.querySelector("meta[name=description]");
			const authorElement = this.doc.querySelector("meta[name=author]");
			const creatorElement = this.doc.querySelector("meta[name=creator]");
			const publisherElement = this.doc.querySelector("meta[name=publisher]");
			const headingElement = this.doc.querySelector("h1");
			this.options.title = titleElement ? titleElement.textContent.trim() : "";
			this.options.info = {
				description: descriptionElement && descriptionElement.content ? descriptionElement.content.trim() : "",
				lang: this.doc.documentElement.lang,
				author: authorElement && authorElement.content ? authorElement.content.trim() : "",
				creator: creatorElement && creatorElement.content ? creatorElement.content.trim() : "",
				publisher: publisherElement && publisherElement.content ? publisherElement.content.trim() : "",
				heading: headingElement && headingElement.textContent ? headingElement.textContent.trim() : ""
			};
			this.options.infobarContent = await ProcessorHelper.evalTemplate(this.options.infobarTemplate, this.options, null, true);
		}
	}

	// ---------------
	// ProcessorHelper
	// ---------------
	const DATA_URI_PREFIX = "data:";
	const ABOUT_BLANK_URI = "about:blank";
	const EMPTY_DATA_URI = "data:null;base64,";
	const REGEXP_URL_HASH = /(#.+?)$/;
	const SINGLE_FILE_VARIABLE_NAME_PREFIX = "--sf-img-";
	const SINGLE_FILE_VARIABLE_MAX_SIZE = 512 * 1024;

	class ProcessorHelper {
		static async evalTemplate(template = "", options, content, dontReplaceSlash) {
			const url = util.parseURL(options.saveUrl);
			template = await evalTemplateVariable(template, "page-title", () => options.title || "No title", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "page-heading", () => options.info.heading || "No heading", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "page-language", () => options.info.lang || "No language", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "page-description", () => options.info.description || "No description", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "page-author", () => options.info.author || "No author", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "page-creator", () => options.info.creator || "No creator", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "page-publisher", () => options.info.publisher || "No publisher", dontReplaceSlash, options.filenameReplacementCharacter);
			await evalDate(options.saveDate);
			await evalDate(options.visitDate, "visit-");
			template = await evalTemplateVariable(template, "url-hash", () => url.hash.substring(1) || "No hash", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-host", () => url.host.replace(/\/$/, "") || "No host", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-hostname", () => url.hostname.replace(/\/$/, "") || "No hostname", dontReplaceSlash, options.filenameReplacementCharacter);
			const urlHref = decode(url.href);
			template = await evalTemplateVariable(template, "url-href", () => urlHref || "No href", dontReplaceSlash === undefined ? true : dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-href-digest-sha-1", urlHref ? async () => util.digest("SHA-1", urlHref) : "No href", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-href-flat", () => decode(url.href) || "No href", false, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-referrer", () => decode(options.referrer) || "No referrer", dontReplaceSlash === undefined ? true : dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-referrer-flat", () => decode(options.referrer) || "No referrer", false, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-password", () => url.password || "No password", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-pathname", () => decode(url.pathname).replace(/^\//, "").replace(/\/$/, "") || "No pathname", dontReplaceSlash === undefined ? true : dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-pathname-flat", () => decode(url.pathname) || "No pathname", false, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-port", () => url.port || "No port", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-protocol", () => url.protocol || "No protocol", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-search", () => url.search.substring(1) || "No search", dontReplaceSlash, options.filenameReplacementCharacter);
			const params = url.search.substring(1).split("&").map(parameter => parameter.split("="));
			for (const [name, value] of params) {
				template = await evalTemplateVariable(template, "url-search-" + name, () => value || "", dontReplaceSlash, options.filenameReplacementCharacter);
			}
			template = template.replace(/{\s*url-search-[^}\s]*\s*}/gi, "");
			template = await evalTemplateVariable(template, "url-username", () => url.username || "No username", dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "tab-id", () => String(options.tabId || "No tab id"), dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "tab-index", () => String(options.tabIndex || "No tab index"), dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "url-last-segment", () => decode(getLastSegment(url, options.filenameReplacementCharacter)) || "No last segment", dontReplaceSlash, options.filenameReplacementCharacter);
			if (content) {
				template = await evalTemplateVariable(template, "digest-sha-256", async () => util.digest("SHA-256", content), dontReplaceSlash, options.filenameReplacementCharacter);
				template = await evalTemplateVariable(template, "digest-sha-384", async () => util.digest("SHA-384", content), dontReplaceSlash, options.filenameReplacementCharacter);
				template = await evalTemplateVariable(template, "digest-sha-512", async () => util.digest("SHA-512", content), dontReplaceSlash, options.filenameReplacementCharacter);
			}
			const bookmarkFolder = (options.bookmarkFolders && options.bookmarkFolders.join("/")) || "";
			template = await evalTemplateVariable(template, "bookmark-pathname", () => bookmarkFolder, dontReplaceSlash === undefined ? true : dontReplaceSlash, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "bookmark-pathname-flat", () => bookmarkFolder, false, options.filenameReplacementCharacter);
			template = await evalTemplateVariable(template, "profile-name", () => options.profileName, dontReplaceSlash, options.filenameReplacementCharacter);
			return template.trim();

			function decode(value) {
				try {
					return decodeURI(value);
				} catch (error) {
					return value;
				}
			}

			async function evalDate(date, prefix = "") {
				if (date) {
					template = await evalTemplateVariable(template, prefix + "datetime-iso", () => date.toISOString(), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "date-iso", () => date.toISOString().split("T")[0], dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "time-iso", () => date.toISOString().split("T")[1].split("Z")[0], dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "date-locale", () => date.toLocaleDateString(), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "time-locale", () => date.toLocaleTimeString(), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "day-locale", () => String(date.getDate()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "month-locale", () => String(date.getMonth() + 1).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "year-locale", () => String(date.getFullYear()), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "datetime-locale", () => date.toLocaleString(), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "datetime-utc", () => date.toUTCString(), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "day-utc", () => String(date.getUTCDate()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "month-utc", () => String(date.getUTCMonth() + 1).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "year-utc", () => String(date.getUTCFullYear()), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "hours-locale", () => String(date.getHours()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "minutes-locale", () => String(date.getMinutes()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "seconds-locale", () => String(date.getSeconds()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "hours-utc", () => String(date.getUTCHours()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "minutes-utc", () => String(date.getUTCMinutes()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "seconds-utc", () => String(date.getUTCSeconds()).padStart(2, "0"), dontReplaceSlash, options.filenameReplacementCharacter);
					template = await evalTemplateVariable(template, prefix + "time-ms", () => String(date.getTime()), dontReplaceSlash, options.filenameReplacementCharacter);
				}
			}
		}

		static setBackgroundImage(element, url, style) {
			element.style.setProperty("background-blend-mode", "normal", "important");
			element.style.setProperty("background-clip", "content-box", "important");
			element.style.setProperty("background-position", style && style["background-position"] ? style["background-position"] : "center", "important");
			element.style.setProperty("background-color", style && style["background-color"] ? style["background-color"] : "transparent", "important");
			element.style.setProperty("background-image", url, "important");
			element.style.setProperty("background-size", style && style["background-size"] ? style["background-size"] : "100% 100%", "important");
			element.style.setProperty("background-origin", "content-box", "important");
			element.style.setProperty("background-repeat", "no-repeat", "important");
		}

		static processShortcutIcons(doc) {
			let shortcutIcon = findShortcutIcon(Array.from(doc.querySelectorAll("link[href][rel=\"icon\"], link[href][rel=\"shortcut icon\"]")));
			if (!shortcutIcon) {
				shortcutIcon = findShortcutIcon(Array.from(doc.querySelectorAll("link[href][rel*=\"icon\"]")));
				if (shortcutIcon) {
					shortcutIcon.rel = "icon";
				}
			}
			if (shortcutIcon) {
				doc.querySelectorAll("link[href][rel*=\"icon\"]").forEach(linkElement => {
					if (linkElement != shortcutIcon) {
						linkElement.remove();
					}
				});
			}
		}

		static removeSingleLineCssComments(stylesheet) {
			const removedRules = [];
			for (let cssRule = stylesheet.children.head; cssRule; cssRule = cssRule.next) {
				const ruleData = cssRule.data;
				if (ruleData.type == "Raw" && ruleData.value && ruleData.value.trim().startsWith("//")) {
					removedRules.push(cssRule);
				}
			}
			removedRules.forEach(cssRule => stylesheet.children.remove(cssRule));
		}

		static async resolveImportURLs(stylesheetContent, baseURI, options, workStylesheet, importedStyleSheets = new Set$1()) {
			stylesheetContent = ProcessorHelper.resolveStylesheetURLs(stylesheetContent, baseURI, workStylesheet, options.saveOriginalURLs);
			const imports = getImportFunctions(stylesheetContent);
			await Promise.all(imports.map(async cssImport => {
				const match = matchImport(cssImport);
				if (match) {
					const regExpCssImport = getRegExp(cssImport);
					let resourceURL = normalizeURL(match.resourceURL);
					if (!testIgnoredPath(resourceURL) && testValidPath(resourceURL)) {
						try {
							resourceURL = util.resolveURL(match.resourceURL, baseURI);
						} catch (error) {
							// ignored
						}
						if (testValidURL(resourceURL) && !importedStyleSheets.has(resourceURL)) {
							const content = await getStylesheetContent(resourceURL);
							resourceURL = content.resourceURL;
							content.data = getUpdatedResourceContent(resourceURL, content, options);
							if (content.data && content.data.match(/^<!doctype /i)) {
								content.data = "";
							}
							let importedStylesheetContent = removeCssComments(content.data);
							if (options.compressCSS) {
								importedStylesheetContent = util.compressCSS(importedStylesheetContent);
							}
							importedStylesheetContent = wrapMediaQuery(importedStylesheetContent, match.media);
							if (stylesheetContent.includes(cssImport)) {
								const ancestorStyleSheets = new Set$1(importedStyleSheets);
								ancestorStyleSheets.add(resourceURL);
								importedStylesheetContent = await ProcessorHelper.resolveImportURLs(importedStylesheetContent, resourceURL, options, workStylesheet, ancestorStyleSheets);
								workStylesheet.textContent = importedStylesheetContent;
								if ((workStylesheet.sheet && workStylesheet.sheet.cssRules.length) || (!workStylesheet.sheet && importedStylesheetContent)) {
									stylesheetContent = stylesheetContent.replace(regExpCssImport, importedStylesheetContent);
								} else {
									stylesheetContent = stylesheetContent.replace(regExpCssImport, "");
								}
							}
						} else {
							stylesheetContent = stylesheetContent.replace(regExpCssImport, "");
						}
					} else {
						stylesheetContent = stylesheetContent.replace(regExpCssImport, "");
					}
				}
			}));
			return stylesheetContent;

			async function getStylesheetContent(resourceURL) {
				const content = await util.getContent(resourceURL, {
					maxResourceSize: options.maxResourceSize,
					maxResourceSizeEnabled: options.maxResourceSizeEnabled,
					validateTextContentType: true,
					frameId: options.frameId,
					charset: options.charset,
					resourceReferrer: options.resourceReferrer,
					baseURI: options.baseURI,
					blockMixedContent: options.blockMixedContent,
					expectedType: "stylesheet",
					acceptHeaders: options.acceptHeaders
				});
				if (!matchCharsetEquals(content.data, content.charset || options.charset)) {
					options = Object.assign({}, options, { charset: getCharset(content.data) });
					return util.getContent(resourceURL, {
						maxResourceSize: options.maxResourceSize,
						maxResourceSizeEnabled: options.maxResourceSizeEnabled,
						validateTextContentType: true,
						frameId: options.frameId,
						charset: options.charset,
						resourceReferrer: options.resourceReferrer,
						baseURI: options.baseURI,
						blockMixedContent: options.blockMixedContent,
						expectedType: "stylesheet",
						acceptHeaders: options.acceptHeaders
					});
				} else {
					return content;
				}
			}
		}

		static resolveStylesheetURLs(stylesheetContent, baseURI, workStylesheet, saveOriginalURLs) {
			const urlFunctions = getUrlFunctions(stylesheetContent, true);
			if (saveOriginalURLs) {
				stylesheetContent = addOriginalURLs(stylesheetContent);
			}
			urlFunctions.map(urlFunction => {
				const originalResourceURL = matchURL(urlFunction);
				let resourceURL = normalizeURL(originalResourceURL);
				workStylesheet.textContent = "tmp { content:\"" + resourceURL + "\"}";
				if (workStylesheet.sheet && workStylesheet.sheet.cssRules) {
					resourceURL = util.removeQuotes(workStylesheet.sheet.cssRules[0].style.getPropertyValue("content"));
				}
				if (!testIgnoredPath(resourceURL)) {
					if (!resourceURL || testValidPath(resourceURL)) {
						let resolvedURL;
						if (!originalResourceURL.startsWith("#")) {
							try {
								resolvedURL = util.resolveURL(resourceURL, baseURI);
							} catch (error) {
								// ignored
							}
						}
						if (testValidURL(resolvedURL) && originalResourceURL != resolvedURL && stylesheetContent.includes(urlFunction)) {
							try {
								stylesheetContent = stylesheetContent.replace(getRegExp(urlFunction), originalResourceURL ? urlFunction.replace(originalResourceURL, resolvedURL) : "url(" + resolvedURL + ")");
							} catch (error) {
								// ignored
							}
						}
					} else {
						let newUrlFunction;
						if (originalResourceURL) {
							newUrlFunction = urlFunction.replace(originalResourceURL, EMPTY_DATA_URI);
						} else {
							newUrlFunction = "url(" + EMPTY_DATA_URI + ")";
						}
						stylesheetContent = stylesheetContent.replace(getRegExp(urlFunction), newUrlFunction);
					}
				}
			});
			return stylesheetContent;
		}

		static async resolveLinkStylesheetURLs(resourceURL, baseURI, options, workStylesheet) {
			resourceURL = normalizeURL(resourceURL);
			if (resourceURL && resourceURL != baseURI && resourceURL != ABOUT_BLANK_URI) {
				const content = await util.getContent(resourceURL, {
					maxResourceSize: options.maxResourceSize,
					maxResourceSizeEnabled: options.maxResourceSizeEnabled,
					charset: options.charset,
					frameId: options.frameId,
					resourceReferrer: options.resourceReferrer,
					validateTextContentType: true,
					baseURI: baseURI,
					blockMixedContent: options.blockMixedContent,
					expectedType: "stylesheet",
					acceptHeaders: options.acceptHeaders
				});
				if (!matchCharsetEquals(content.data, content.charset || options.charset)) {
					options = Object.assign({}, options, { charset: getCharset(content.data) });
					return ProcessorHelper.resolveLinkStylesheetURLs(resourceURL, baseURI, options, workStylesheet);
				}
				resourceURL = content.resourceURL;
				content.data = getUpdatedResourceContent(content.resourceURL, content, options);
				if (content.data && content.data.match(/^<!doctype /i)) {
					content.data = "";
				}
				let stylesheetContent = removeCssComments(content.data);
				if (options.compressCSS) {
					stylesheetContent = util.compressCSS(stylesheetContent);
				}
				stylesheetContent = await ProcessorHelper.resolveImportURLs(stylesheetContent, resourceURL, options, workStylesheet);
				return stylesheetContent;
			}
		}

		static async processStylesheet(cssRules, baseURI, options, cssVariables, batchRequest) {
			const promises = [];
			const removedRules = [];
			for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
				const ruleData = cssRule.data;
				if (ruleData.type == "Atrule" && ruleData.name == "charset") {
					removedRules.push(cssRule);
				} else if (ruleData.block && ruleData.block.children) {
					if (ruleData.type == "Rule") {
						promises.push(this.processStyle(ruleData.block.children.toArray(), baseURI, options, cssVariables, batchRequest));
					} else if (ruleData.type == "Atrule" && (ruleData.name == "media" || ruleData.name == "supports")) {
						promises.push(this.processStylesheet(ruleData.block.children, baseURI, options, cssVariables, batchRequest));
					} else if (ruleData.type == "Atrule" && ruleData.name == "font-face") {
						promises.push(processFontFaceRule(ruleData, options.fontURLs));
					}
				}
			}
			removedRules.forEach(cssRule => cssRules.remove(cssRule));
			await Promise.all(promises);

			async function processFontFaceRule(ruleData, fontURLs) {
				await Promise.all(ruleData.block.children.toArray().map(async declaration => {
					if (declaration.type == "Declaration" && declaration.value.children) {
						const urlFunctions = getUrlFunctions(getCSSValue(declaration.value), true);
						await Promise.all(urlFunctions.map(async urlFunction => {
							const originalResourceURL = matchURL(urlFunction);
							const resourceURL = normalizeURL(originalResourceURL);
							if (!testIgnoredPath(resourceURL)) {
								if (testValidURL(resourceURL)) {
									let { content } = await batchRequest.addURL(resourceURL,
										{ asBinary: true, expectedType: "font", baseURI, blockMixedContent: options.blockMixedContent });
									let resourceURLs = fontURLs.get(declaration);
									if (!resourceURLs) {
										resourceURLs = [];
										fontURLs.set(declaration, resourceURLs);
									}
									resourceURLs.push(resourceURL);
									replaceURLs(declaration, originalResourceURL, content);
								}
							}
						}));
					}
				}));

				function replaceURLs(declaration, oldURL, newURL) {
					declaration.value.children.forEach(token => {
						if (token.type == "Url" && util.removeQuotes(getCSSValue(token.value)) == oldURL) {
							token.value.value = newURL;
						}
					});
				}
			}
		}

		static async processStyle(declarations, baseURI, options, cssVariables, batchRequest) {
			await Promise.all(declarations.map(async declaration => {
				if (declaration.value && !declaration.value.children && declaration.value.type == "Raw") {
					try {
						declaration.value = cssTree.parse(declaration.value.value, { context: "value" });
					} catch (error) {
						// ignored
					}
				}
				if (declaration.type == "Declaration" && declaration.value.children) {
					const urlFunctions = getUrlFunctions(getCSSValue(declaration.value));
					await Promise.all(urlFunctions.map(async urlFunction => {
						const originalResourceURL = matchURL(urlFunction);
						const resourceURL = normalizeURL(originalResourceURL);
						if (!testIgnoredPath(resourceURL)) {
							if (testValidURL(resourceURL)) {
								let { content, indexResource, duplicate } = await batchRequest.addURL(resourceURL,
									{ asBinary: true, expectedType: "image", groupDuplicates: options.groupDuplicateImages });
								let variableDefined;
								const tokens = [];
								findURLToken(originalResourceURL, declaration.value.children, (token, parent, rootFunction) => {
									if (!originalResourceURL.startsWith("#")) {
										if (duplicate && options.groupDuplicateImages && rootFunction && util.getContentSize(content) < SINGLE_FILE_VARIABLE_MAX_SIZE) {
											const value = cssTree.parse("var(" + SINGLE_FILE_VARIABLE_NAME_PREFIX + indexResource + ")", { context: "value" }).children.head;
											tokens.push({ parent, token, value });
											variableDefined = true;
										} else {
											token.data.value.value = content;
										}
									}
								});
								if (variableDefined) {
									cssVariables.set(indexResource, { content, url: originalResourceURL });
									tokens.forEach(({ parent, token, value }) => parent.replace(token, value));
								}
							}
						}
					}));
				}
			}));

			function findURLToken(url, children, callback, depth = 0) {
				for (let token = children.head; token; token = token.next) {
					if (token.data.children) {
						findURLToken(url, token.data.children, callback, depth + 1);
					}
					if (token.data.type == "Url" && util.removeQuotes(getCSSValue(token.data.value)) == url) {
						callback(token, children, depth == 0);
					}
				}
			}
		}

		static async processAttribute(resourceElements, attributeName, baseURI, options, cssVariables, styles, batchRequest, processDuplicates, removeElementIfMissing) {
			await Promise.all(Array.from(resourceElements).map(async resourceElement => {
				let resourceURL = resourceElement.getAttribute(attributeName);
				if (resourceURL != null) {
					resourceURL = normalizeURL(resourceURL);
					let originURL = resourceElement.dataset.singleFileOriginURL;
					if (options.saveOriginalURLs && !isDataURL(resourceURL)) {
						resourceElement.setAttribute("data-sf-original-" + attributeName, resourceURL);
					}
					delete resourceElement.dataset.singleFileOriginURL;
					if (!testIgnoredPath(resourceURL)) {
						resourceElement.setAttribute(attributeName, EMPTY_IMAGE);
						if (testValidPath(resourceURL)) {
							try {
								resourceURL = util.resolveURL(resourceURL, baseURI);
							} catch (error) {
								// ignored
							}
							if (testValidURL(resourceURL)) {
								let { content, indexResource, duplicate } = await batchRequest.addURL(resourceURL,
									{ asBinary: true, expectedType: "image", groupDuplicates: options.groupDuplicateImages && resourceElement.tagName == "IMG" && attributeName == "src" });
								if (originURL) {
									if (content == EMPTY_DATA_URI) {
										try {
											originURL = util.resolveURL(originURL, baseURI);
										} catch (error) {
											// ignored
										}
										try {
											resourceURL = originURL;
											content = (await util.getContent(resourceURL, {
												asBinary: true,
												expectedType: "image",
												maxResourceSize: options.maxResourceSize,
												maxResourceSizeEnabled: options.maxResourceSizeEnabled,
												frameId: options.windowId,
												resourceReferrer: options.resourceReferrer,
												acceptHeaders: options.acceptHeaders
											})).data;
										} catch (error) {
											// ignored
										}
									}
								}
								if (removeElementIfMissing && content == EMPTY_DATA_URI) {
									resourceElement.remove();
								} else {
									const forbiddenPrefixFound = PREFIXES_FORBIDDEN_DATA_URI.filter(prefixDataURI => content.startsWith(prefixDataURI)).length;
									if (!forbiddenPrefixFound) {
										const isSVG = content.startsWith(PREFIX_DATA_URI_IMAGE_SVG);
										if (processDuplicates && duplicate && options.groupDuplicateImages && !isSVG && util.getContentSize(content) < SINGLE_FILE_VARIABLE_MAX_SIZE) {
											if (ProcessorHelper.replaceImageSource(resourceElement, SINGLE_FILE_VARIABLE_NAME_PREFIX + indexResource, options)) {
												cssVariables.set(indexResource, { content, url: originURL });
												const declarationList = cssTree.parse(resourceElement.getAttribute("style"), { context: "declarationList" });
												styles.set(resourceElement, declarationList);
											} else {
												resourceElement.setAttribute(attributeName, content);
											}
										} else {
											resourceElement.setAttribute(attributeName, content);
										}
									}
								}
							}
						}
					}
				}
			}));
		}

		static async processXLinks(resourceElements, doc, baseURI, options, batchRequest) {
			let attributeName = "xlink:href";
			await Promise.all(Array.from(resourceElements).map(async resourceElement => {
				let originalResourceURL = resourceElement.getAttribute(attributeName);
				if (originalResourceURL == null) {
					attributeName = "href";
					originalResourceURL = resourceElement.getAttribute(attributeName);
				}
				if (options.saveOriginalURLs && !isDataURL(originalResourceURL)) {
					resourceElement.setAttribute("data-sf-original-href", originalResourceURL);
				}
				let resourceURL = normalizeURL(originalResourceURL);
				if (testValidPath(resourceURL) && !testIgnoredPath(resourceURL)) {
					resourceElement.setAttribute(attributeName, EMPTY_IMAGE);
					try {
						resourceURL = util.resolveURL(resourceURL, baseURI);
					} catch (error) {
						// ignored
					}
					if (testValidURL(resourceURL)) {
						const hashMatch = originalResourceURL.match(REGEXP_URL_HASH);
						if (originalResourceURL.startsWith(baseURI + "#")) {
							resourceElement.setAttribute(attributeName, hashMatch[0]);
						} else {
							const response = await batchRequest.addURL(resourceURL, { expectedType: "image" });
							const svgDoc = util.parseSVGContent(response.content);
							if (hashMatch && hashMatch[0]) {
								let symbolElement;
								try {
									symbolElement = svgDoc.querySelector(hashMatch[0]);
								} catch (error) {
									// ignored
								}
								if (symbolElement) {
									resourceElement.setAttribute(attributeName, hashMatch[0]);
									resourceElement.parentElement.insertBefore(symbolElement, resourceElement.parentElement.firstChild);
								}
							} else {
								const content = await batchRequest.addURL(resourceURL, { expectedType: "image" });
								resourceElement.setAttribute(attributeName, PREFIX_DATA_URI_IMAGE_SVG + "," + content);
							}
						}
					}
				} else if (resourceURL == options.url) {
					resourceElement.setAttribute(attributeName, originalResourceURL.substring(resourceURL.length));
				}
			}));
		}

		static async processSrcset(resourceElements, attributeName, baseURI, batchRequest) {
			await Promise.all(Array.from(resourceElements).map(async resourceElement => {
				const originSrcset = resourceElement.getAttribute(attributeName);
				const srcset = util.parseSrcset(originSrcset);
				resourceElement.setAttribute("data-sf-original-srcset", originSrcset);
				const srcsetValues = await Promise.all(srcset.map(async srcsetValue => {
					let resourceURL = normalizeURL(srcsetValue.url);
					if (!testIgnoredPath(resourceURL)) {
						if (testValidPath(resourceURL)) {
							try {
								resourceURL = util.resolveURL(resourceURL, baseURI);
							} catch (error) {
								// ignored
							}
							if (testValidURL(resourceURL)) {
								const { content } = await batchRequest.addURL(resourceURL, { asBinary: true, expectedType: "image" });
								const forbiddenPrefixFound = PREFIXES_FORBIDDEN_DATA_URI.filter(prefixDataURI => content.startsWith(prefixDataURI)).length;
								if (forbiddenPrefixFound) {
									return "";
								}
								return content + (srcsetValue.w ? " " + srcsetValue.w + "w" : srcsetValue.d ? " " + srcsetValue.d + "x" : "");
							} else {
								return "";
							}
						} else {
							return "";
						}
					} else {
						return resourceURL + (srcsetValue.w ? " " + srcsetValue.w + "w" : srcsetValue.d ? " " + srcsetValue.d + "x" : "");
					}
				}));
				resourceElement.setAttribute(attributeName, srcsetValues.join(", "));
			}));
		}

		static replaceImageSource(imgElement, variableName, options) {
			const attributeValue = imgElement.getAttribute(util.IMAGE_ATTRIBUTE_NAME);
			if (attributeValue) {
				const imageData = options.images[Number(imgElement.getAttribute(util.IMAGE_ATTRIBUTE_NAME))];
				if (imageData && imageData.replaceable) {
					imgElement.setAttribute("src", `${PREFIX_DATA_URI_IMAGE_SVG},<svg xmlns="http://www.w3.org/2000/svg" width="${imageData.size.pxWidth}" height="${imageData.size.pxHeight}"><rect fill-opacity="0"/></svg>`);
					const backgroundStyle = {};
					const backgroundSize = (imageData.objectFit == "content" || imageData.objectFit == "cover") && imageData.objectFit;
					if (backgroundSize) {
						backgroundStyle["background-size"] = imageData.objectFit;
					}
					if (imageData.objectPosition) {
						backgroundStyle["background-position"] = imageData.objectPosition;
					}
					if (imageData.backgroundColor) {
						backgroundStyle["background-color"] = imageData.backgroundColor;
					}
					ProcessorHelper.setBackgroundImage(imgElement, "var(" + variableName + ")", backgroundStyle);
					imgElement.removeAttribute(util.IMAGE_ATTRIBUTE_NAME);
					return true;
				}
			}
		}
	}

	// ----
	// Util
	// ----
	const BLOB_URI_PREFIX = "blob:";
	const HTTP_URI_PREFIX = /^https?:\/\//;
	const FILE_URI_PREFIX = /^file:\/\//;
	const EMPTY_URL = /^https?:\/\/+\s*$/;
	const NOT_EMPTY_URL = /^(https?:\/\/|file:\/\/|blob:).+/;
	const REGEXP_URL_FN = /(url\s*\(\s*'(.*?)'\s*\))|(url\s*\(\s*"(.*?)"\s*\))|(url\s*\(\s*(.*?)\s*\))/gi;
	const REGEXP_URL_SIMPLE_QUOTES_FN = /^url\s*\(\s*'(.*?)'\s*\)$/i;
	const REGEXP_URL_DOUBLE_QUOTES_FN = /^url\s*\(\s*"(.*?)"\s*\)$/i;
	const REGEXP_URL_NO_QUOTES_FN = /^url\s*\(\s*(.*?)\s*\)$/i;
	const REGEXP_IMPORT_FN = /(@import\s*url\s*\(\s*'(.*?)'\s*\)\s*(.*?)(;|$|}))|(@import\s*url\s*\(\s*"(.*?)"\s*\)\s*(.*?)(;|$|}))|(@import\s*url\s*\(\s*(.*?)\s*\)\s*(.*?)(;|$|}))|(@import\s*'(.*?)'\s*(.*?)(;|$|}))|(@import\s*"(.*?)"\s*(.*?)(;|$|}))|(@import\s*(.*?)\s*(.*?)(;|$|}))/gi;
	const REGEXP_IMPORT_URL_SIMPLE_QUOTES_FN = /@import\s*url\s*\(\s*'(.*?)'\s*\)\s*(.*?)(;|$|})/i;
	const REGEXP_IMPORT_URL_DOUBLE_QUOTES_FN = /@import\s*url\s*\(\s*"(.*?)"\s*\)\s*(.*?)(;|$|})/i;
	const REGEXP_IMPORT_URL_NO_QUOTES_FN = /@import\s*url\s*\(\s*(.*?)\s*\)\s*(.*?)(;|$|})/i;
	const REGEXP_IMPORT_SIMPLE_QUOTES_FN = /@import\s*'(.*?)'\s*(.*?)(;|$|})/i;
	const REGEXP_IMPORT_DOUBLE_QUOTES_FN = /@import\s*"(.*?)"\s*(.*?)(;|$|})/i;
	const REGEXP_IMPORT_NO_QUOTES_FN = /@import\s*(.*?)\s*(.*?)(;|$|})/i;
	const REGEXP_ESCAPE = /([{}()^$&.*?/+|[\\\\]|\]|-)/g;

	function getUpdatedResourceContent(resourceURL, content, options) {
		if (options.rootDocument && options.updatedResources[resourceURL]) {
			options.updatedResources[resourceURL].retrieved = true;
			return options.updatedResources[resourceURL].content;
		} else {
			return content.data || "";
		}
	}

	function normalizeURL(url) {
		if (!url || url.startsWith(DATA_URI_PREFIX)) {
			return url;
		} else {
			return url.split("#")[0];
		}
	}

	function getCSSValue(value) {
		let result = "";
		try {
			result = cssTree.generate(value);
		} catch (error) {
			// ignored
		}
		return result;
	}

	function matchCharsetEquals(stylesheetContent, charset = "utf-8") {
		const stylesheetCharset = getCharset(stylesheetContent);
		if (stylesheetCharset) {
			return stylesheetCharset == charset.toLowerCase();
		} else {
			return true;
		}
	}

	function getCharset(stylesheetContent) {
		const match = stylesheetContent.match(/^@charset\s+"([^"]*)";/i);
		if (match && match[1]) {
			return match[1].toLowerCase().trim();
		}
	}

	function getOnEventAttributeNames(doc) {
		const element = doc.createElement("div");
		const attributeNames = [];
		for (const propertyName in element) {
			if (propertyName.startsWith("on")) {
				attributeNames.push(propertyName);
			}
		}
		attributeNames.push("onunload");
		return attributeNames;
	}

	async function evalTemplateVariable(template, variableName, valueGetter, dontReplaceSlash, replacementCharacter) {
		let maxLength;
		if (template) {
			const regExpVariable = "{\\s*" + variableName.replace(/\W|_/g, "[$&]") + "\\s*}";
			let replaceRegExp = new RegExp(regExpVariable + "\\[\\d+\\]", "g");
			if (template.match(replaceRegExp)) {
				const matchedLength = template.match(replaceRegExp)[0];
				maxLength = Number(matchedLength.match(/\[(\d+)\]$/)[1]);
				if (isNaN(maxLength) || maxLength <= 0) {
					maxLength = null;
				}
			} else {
				replaceRegExp = new RegExp(regExpVariable, "g");
			}
			if (template.match(replaceRegExp)) {
				let value = await valueGetter();
				if (!dontReplaceSlash) {
					value = value.replace(/\/+/g, replacementCharacter);
				}
				if (maxLength) {
					value = await util.truncateText(value, maxLength);
				}
				return template.replace(replaceRegExp, value);
			}
		}
		return template;
	}

	function getLastSegment(url, replacementCharacter) {
		let lastSegmentMatch = url.pathname.match(/\/([^/]+)$/), lastSegment = lastSegmentMatch && lastSegmentMatch[0];
		if (!lastSegment) {
			lastSegmentMatch = url.href.match(/([^/]+)\/?$/);
			lastSegment = lastSegmentMatch && lastSegmentMatch[0];
		}
		if (!lastSegment) {
			lastSegmentMatch = lastSegment.match(/(.*)\.[^.]+$/);
			lastSegment = lastSegmentMatch && lastSegmentMatch[0];
		}
		if (!lastSegment) {
			lastSegment = url.hostname.replace(/\/+/g, replacementCharacter).replace(/\/$/, "");
		}
		lastSegmentMatch = lastSegment.match(/(.*)\.[^.]+$/);
		if (lastSegmentMatch && lastSegmentMatch[1]) {
			lastSegment = lastSegmentMatch[1];
		}
		lastSegment = lastSegment.replace(/\/$/, "").replace(/^\//, "");
		return lastSegment;
	}

	function getRegExp(string) {
		return new RegExp(string.replace(REGEXP_ESCAPE, "\\$1"), "gi");
	}

	function getUrlFunctions(stylesheetContent, unique) {
		const result = stylesheetContent.match(REGEXP_URL_FN) || [];
		if (unique) {
			return [...new Set$1(result)];
		} else {
			return result;
		}
	}

	function getImportFunctions(stylesheetContent) {
		return stylesheetContent.match(REGEXP_IMPORT_FN) || [];
	}

	function findShortcutIcon(shortcutIcons) {
		shortcutIcons = shortcutIcons.filter(linkElement => linkElement.href != EMPTY_IMAGE);
		shortcutIcons.sort((linkElement1, linkElement2) => (parseInt(linkElement2.sizes, 10) || 16) - (parseInt(linkElement1.sizes, 10) || 16));
		return shortcutIcons[0];
	}

	function matchURL(stylesheetContent) {
		const match = stylesheetContent.match(REGEXP_URL_SIMPLE_QUOTES_FN) ||
			stylesheetContent.match(REGEXP_URL_DOUBLE_QUOTES_FN) ||
			stylesheetContent.match(REGEXP_URL_NO_QUOTES_FN);
		return match && match[1];
	}

	function addOriginalURLs(stylesheetContent) {
		return stylesheetContent.replace(REGEXP_URL_FN, function (match, _0, url, _1, url2, _2, url3) {
			url = url || url2 || url3;
			if (isDataURL(url)) {
				return match;
			} else {
				return "-sf-url-original(" + JSON.stringify(url) + ") " + match;
			}
		});
	}

	function isDataURL(url) {
		return url && (url.startsWith(DATA_URI_PREFIX) || url.startsWith(BLOB_URI_PREFIX));
	}

	function replaceOriginalURLs(stylesheetContent) {
		return stylesheetContent.replace(/-sf-url-original\("(.*?)"\)/g, "/* original URL: $1 */");
	}

	function testIgnoredPath(resourceURL) {
		return resourceURL && (resourceURL.startsWith(DATA_URI_PREFIX) || resourceURL == ABOUT_BLANK_URI);
	}

	function testValidPath(resourceURL) {
		return resourceURL && !resourceURL.match(EMPTY_URL);
	}

	function testValidURL(resourceURL) {
		return testValidPath(resourceURL) && (resourceURL.match(HTTP_URI_PREFIX) || resourceURL.match(FILE_URI_PREFIX) || resourceURL.startsWith(BLOB_URI_PREFIX)) && resourceURL.match(NOT_EMPTY_URL);
	}

	function matchImport(stylesheetContent) {
		const match = stylesheetContent.match(REGEXP_IMPORT_URL_SIMPLE_QUOTES_FN) ||
			stylesheetContent.match(REGEXP_IMPORT_URL_DOUBLE_QUOTES_FN) ||
			stylesheetContent.match(REGEXP_IMPORT_URL_NO_QUOTES_FN) ||
			stylesheetContent.match(REGEXP_IMPORT_SIMPLE_QUOTES_FN) ||
			stylesheetContent.match(REGEXP_IMPORT_DOUBLE_QUOTES_FN) ||
			stylesheetContent.match(REGEXP_IMPORT_NO_QUOTES_FN);
		if (match) {
			const [, resourceURL, media] = match;
			return { resourceURL, media };
		}
	}

	function removeCssComments(stylesheetContent) {
		try {
			return stylesheetContent.replace(/\/\*(.|\s)*?\*\//g, "");
		} catch (error) {
			let start, end;
			do {
				start = stylesheetContent.indexOf("/*");
				end = stylesheetContent.indexOf("*/", start + 2);
				if (start != -1 && end != -1) {
					stylesheetContent = stylesheetContent.substring(0, start) + stylesheetContent.substr(end + 2);
				}
			} while (start != -1 && end != -1);
			return stylesheetContent;
		}
	}

	function wrapMediaQuery(stylesheetContent, mediaQuery) {
		if (mediaQuery) {
			return "@media " + mediaQuery + "{ " + stylesheetContent + " }";
		} else {
			return stylesheetContent;
		}
	}

	// -----
	// Stats
	// -----
	const STATS_DEFAULT_VALUES = {
		discarded: {
			"HTML bytes": 0,
			"hidden elements": 0,
			"HTML imports": 0,
			scripts: 0,
			objects: 0,
			"audio sources": 0,
			"video sources": 0,
			frames: 0,
			"CSS rules": 0,
			canvas: 0,
			stylesheets: 0,
			resources: 0,
			medias: 0
		},
		processed: {
			"HTML bytes": 0,
			"hidden elements": 0,
			"HTML imports": 0,
			scripts: 0,
			objects: 0,
			"audio sources": 0,
			"video sources": 0,
			frames: 0,
			"CSS rules": 0,
			canvas: 0,
			stylesheets: 0,
			resources: 0,
			medias: 0
		}
	};

	class Stats {
		constructor(options) {
			this.options = options;
			if (options.displayStats) {
				this.data = JSON.parse(JSON.stringify(STATS_DEFAULT_VALUES));
			}
		}
		set(type, subType, value) {
			if (this.options.displayStats) {
				this.data[type][subType] = value;
			}
		}
		add(type, subType, value) {
			if (this.options.displayStats) {
				this.data[type][subType] += value;
			}
		}
		addAll(pageData) {
			if (this.options.displayStats) {
				Object.keys(this.data.discarded).forEach(key => this.add("discarded", key, pageData.stats.discarded[key] || 0));
				Object.keys(this.data.processed).forEach(key => this.add("processed", key, pageData.stats.processed[key] || 0));
			}
		}
	}

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

	const DEBUG = false;
	const ONE_MB = 1024 * 1024;
	const PREFIX_CONTENT_TYPE_TEXT = "text/";
	const DEFAULT_REPLACED_CHARACTERS = ["~", "+", "\\\\", "?", "%", "*", ":", "|", "\"", "<", ">", "\x00-\x1f", "\x7F"];
	const DEFAULT_REPLACEMENT_CHARACTER = "_";

	const URL = globalThis.URL;
	const DOMParser = globalThis.DOMParser;
	const Blob = globalThis.Blob;
	const FileReader = globalThis.FileReader;
	const fetch = (url, options) => globalThis.fetch(url, options);
	const crypto = globalThis.crypto;
	const TextDecoder = globalThis.TextDecoder;
	const TextEncoder = globalThis.TextEncoder;

	function getInstance(utilOptions) {
		utilOptions = utilOptions || {};
		utilOptions.fetch = utilOptions.fetch || fetch;
		utilOptions.frameFetch = utilOptions.frameFetch || utilOptions.fetch || fetch;
		return {
			getContent,
			parseURL(resourceURL, baseURI) {
				if (baseURI === undefined) {
					return new URL(resourceURL);
				} else {
					return new URL(resourceURL, baseURI);
				}
			},
			resolveURL(resourceURL, baseURI) {
				return this.parseURL(resourceURL, baseURI).href;
			},
			getValidFilename(filename, replacedCharacters = DEFAULT_REPLACED_CHARACTERS, replacementCharacter = DEFAULT_REPLACEMENT_CHARACTER) {
				replacedCharacters.forEach(replacedCharacter => filename = filename.replace(new RegExp("[" + replacedCharacter + "]+", "g"), replacementCharacter));
				filename = filename
					.replace(/\.\.\//g, "")
					.replace(/^\/+/, "")
					.replace(/\/+/g, "/")
					.replace(/\/$/, "")
					.replace(/\.$/, "")
					.replace(/\.\//g, "." + replacementCharacter)
					.replace(/\/\./g, "/" + replacementCharacter);
				return filename;
			},
			parseDocContent(content, baseURI) {
				const doc = (new DOMParser()).parseFromString(content, "text/html");
				if (!doc.head) {
					doc.documentElement.insertBefore(doc.createElement("HEAD"), doc.body);
				}
				let baseElement = doc.querySelector("base");
				if (!baseElement || !baseElement.getAttribute("href")) {
					if (baseElement) {
						baseElement.remove();
					}
					baseElement = doc.createElement("base");
					baseElement.setAttribute("href", baseURI);
					doc.head.insertBefore(baseElement, doc.head.firstChild);
				}
				return doc;
			},
			parseXMLContent(content) {
				return (new DOMParser()).parseFromString(content, "text/xml");
			},
			parseSVGContent(content) {
				const doc = (new DOMParser()).parseFromString(content, "image/svg+xml");
				if (doc.querySelector("parsererror")) {
					return (new DOMParser()).parseFromString(content, "text/html");
				} else {
					return doc;
				}
			},
			async digest(algo, text) {
				try {
					const hash = await crypto.subtle.digest(algo, new TextEncoder("utf-8").encode(text));
					return hex(hash);
				} catch (error) {
					return "";
				}
			},
			getContentSize(content) {
				return new Blob([content]).size;
			},
			truncateText(content, maxSize) {
				const blob = new Blob([content]);
				const reader = new FileReader();
				reader.readAsText(blob.slice(0, maxSize));
				return new Promise((resolve, reject) => {
					reader.addEventListener("load", () => {
						if (content.startsWith(reader.result)) {
							resolve(reader.result);
						} else {
							this.truncateText(content, maxSize - 1).then(resolve).catch(reject);
						}
					}, false);
					reader.addEventListener("error", reject, false);
				});
			},
			minifyHTML(doc, options) {
				return process$1(doc, options);
			},
			minifyCSSRules(stylesheets, styles, mediaAllInfo) {
				return process$3(stylesheets, styles, mediaAllInfo);
			},
			removeUnusedFonts(doc, stylesheets, styles, options) {
				return process$5(doc, stylesheets, styles, options);
			},
			removeAlternativeFonts(doc, stylesheets, fontURLs, fontTests) {
				return process$6(doc, stylesheets, fontURLs, fontTests);
			},
			getMediaAllInfo(doc, stylesheets, styles) {
				return getMediaAllInfo(doc, stylesheets, styles);
			},
			compressCSS(content, options) {
				return processString(content, options);
			},
			minifyMedias(stylesheets) {
				return process$4(stylesheets);
			},
			removeAlternativeImages(doc) {
				return process$2(doc);
			},
			parseSrcset(srcset) {
				return process$7(srcset);
			},
			preProcessDoc(doc, win, options) {
				return preProcessDoc(doc, win, options);
			},
			postProcessDoc(doc, markedElements) {
				postProcessDoc(doc, markedElements);
			},
			serialize(doc, compressHTML) {
				return process(doc, compressHTML);
			},
			removeQuotes(string) {
				return removeQuotes$1(string);
			},
			ON_BEFORE_CAPTURE_EVENT_NAME: ON_BEFORE_CAPTURE_EVENT_NAME,
			ON_AFTER_CAPTURE_EVENT_NAME: ON_AFTER_CAPTURE_EVENT_NAME,
			WIN_ID_ATTRIBUTE_NAME: WIN_ID_ATTRIBUTE_NAME,
			REMOVED_CONTENT_ATTRIBUTE_NAME: REMOVED_CONTENT_ATTRIBUTE_NAME,
			HIDDEN_CONTENT_ATTRIBUTE_NAME: HIDDEN_CONTENT_ATTRIBUTE_NAME,
			HIDDEN_FRAME_ATTRIBUTE_NAME: HIDDEN_FRAME_ATTRIBUTE_NAME,
			IMAGE_ATTRIBUTE_NAME: IMAGE_ATTRIBUTE_NAME,
			POSTER_ATTRIBUTE_NAME: POSTER_ATTRIBUTE_NAME,
			CANVAS_ATTRIBUTE_NAME: CANVAS_ATTRIBUTE_NAME,
			HTML_IMPORT_ATTRIBUTE_NAME: HTML_IMPORT_ATTRIBUTE_NAME,
			STYLE_ATTRIBUTE_NAME: STYLE_ATTRIBUTE_NAME,
			INPUT_VALUE_ATTRIBUTE_NAME: INPUT_VALUE_ATTRIBUTE_NAME,
			SHADOW_ROOT_ATTRIBUTE_NAME: SHADOW_ROOT_ATTRIBUTE_NAME,
			PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME: PRESERVED_SPACE_ELEMENT_ATTRIBUTE_NAME,
			STYLESHEET_ATTRIBUTE_NAME: STYLESHEET_ATTRIBUTE_NAME,
			SELECTED_CONTENT_ATTRIBUTE_NAME: SELECTED_CONTENT_ATTRIBUTE_NAME,
			COMMENT_HEADER: COMMENT_HEADER,
			COMMENT_HEADER_LEGACY: COMMENT_HEADER_LEGACY,
			SINGLE_FILE_UI_ELEMENT_CLASS: SINGLE_FILE_UI_ELEMENT_CLASS
		};

		async function getContent(resourceURL, options) {
			let response, startTime;
			const fetchResource = utilOptions.fetch;
			const fetchFrameResource = utilOptions.frameFetch;
			if (options.blockMixedContent && /^https:/i.test(options.baseURI) && !/^https:/i.test(resourceURL)) {
				return { data: options.asBinary ? "data:null;base64," : "", resourceURL };
			}
			try {
				if (options.frameId) {
					try {
						response = await fetchFrameResource(resourceURL, { frameId: options.frameId, headers: { accept: options.acceptHeaders[options.expectedType] } });
					} catch (error) {
						response = await fetchResource(resourceURL, { headers: { accept: options.acceptHeaders[options.expectedType] } });
					}
				} else {
					response = await fetchResource(resourceURL, { headers: { accept: options.acceptHeaders[options.expectedType] } });
				}
			} catch (error) {
				return { data: options.asBinary ? "data:null;base64," : "", resourceURL };
			}
			let buffer;
			try {
				buffer = await response.arrayBuffer();
			} catch (error) {
				return { data: options.asBinary ? "data:null;base64," : "", resourceURL };
			}
			resourceURL = response.url || resourceURL;
			let contentType = "", charset;
			try {
				const mimeType = new MIMEType(response.headers.get("content-type"));
				contentType = mimeType.type + "/" + mimeType.subtype;
				charset = mimeType.parameters.get("charset");
			} catch (error) {
				// ignored
			}
			if (!contentType) {
				contentType = guessMIMEType(options.expectedType, buffer);
			}
			if (!charset && options.charset) {
				charset = options.charset;
			}
			if (options.asBinary) {
				try {
					if (DEBUG) ;
					if (options.maxResourceSizeEnabled && buffer.byteLength > options.maxResourceSize * ONE_MB) {
						return { data: "data:null;base64,", resourceURL };
					} else {
						const reader = new FileReader();
						reader.readAsDataURL(new Blob([buffer], { type: contentType + (options.charset ? ";charset=" + options.charset : "") }));
						const dataUri = await new Promise((resolve, reject) => {
							reader.addEventListener("load", () => resolve(reader.result), false);
							reader.addEventListener("error", reject, false);
						});
						return { data: dataUri, resourceURL };
					}
				} catch (error) {
					return { data: "data:null;base64,", resourceURL };
				}
			} else {
				if (response.status >= 400 || (options.validateTextContentType && contentType && !contentType.startsWith(PREFIX_CONTENT_TYPE_TEXT))) {
					return { data: "", resourceURL };
				}
				if (!charset) {
					charset = "utf-8";
				}
				if (options.maxResourceSizeEnabled && buffer.byteLength > options.maxResourceSize * ONE_MB) {
					return { data: "", resourceURL, charset };
				} else {
					try {
						return { data: new TextDecoder(charset).decode(buffer), resourceURL, charset };
					} catch (error) {
						try {
							charset = "utf-8";
							return { data: new TextDecoder(charset).decode(buffer), resourceURL, charset };
						} catch (error) {
							return { data: "", resourceURL, charset };
						}
					}
				}
			}
		}
	}

	function guessMIMEType(expectedType, buffer) {
		if (expectedType == "image") {
			if (compareBytes([255, 255, 255, 255], [0, 0, 1, 0])) {
				return "image/x-icon";
			}
			if (compareBytes([255, 255, 255, 255], [0, 0, 2, 0])) {
				return "image/x-icon";
			}
			if (compareBytes([255, 255], [78, 77])) {
				return "image/bmp";
			}
			if (compareBytes([255, 255, 255, 255, 255, 255], [71, 73, 70, 56, 57, 97])) {
				return "image/gif";
			}
			if (compareBytes([255, 255, 255, 255, 255, 255], [71, 73, 70, 56, 59, 97])) {
				return "image/gif";
			}
			if (compareBytes([255, 255, 255, 255, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255], [82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80, 86, 80])) {
				return "image/webp";
			}
			if (compareBytes([255, 255, 255, 255, 255, 255, 255, 255], [137, 80, 78, 71, 13, 10, 26, 10])) {
				return "image/png";
			}
			if (compareBytes([255, 255, 255], [255, 216, 255])) {
				return "image/jpeg";
			}
		}
		if (expectedType == "font") {
			if (compareBytes([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 76, 80])) {
				return "application/vnd.ms-fontobject";
			}
			if (compareBytes([255, 255, 255, 255], [0, 1, 0, 0])) {
				return "font/ttf";
			}
			if (compareBytes([255, 255, 255, 255], [79, 84, 84, 79])) {
				return "font/otf";
			}
			if (compareBytes([255, 255, 255, 255], [116, 116, 99, 102])) {
				return "font/collection";
			}
			if (compareBytes([255, 255, 255, 255], [119, 79, 70, 70])) {
				return "font/woff";
			}
			if (compareBytes([255, 255, 255, 255], [119, 79, 70, 50])) {
				return "font/woff2";
			}
		}

		function compareBytes(mask, pattern) {
			let patternMatch = true, index = 0;
			if (buffer.byteLength >= pattern.length) {
				const value = new Uint8Array(buffer, 0, mask.length);
				for (index = 0; index < mask.length && patternMatch; index++) {
					patternMatch = patternMatch && ((value[index] & mask[index]) == pattern[index]);
				}
				return patternMatch;
			}
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
	function hex(buffer) {
		const hexCodes = [];
		const view = new DataView(buffer);
		for (let i = 0; i < view.byteLength; i += 4) {
			const value = view.getUint32(i);
			const stringValue = value.toString(16);
			const padding = "00000000";
			const paddedValue = (padding + stringValue).slice(-padding.length);
			hexCodes.push(paddedValue);
		}
		return hexCodes.join("");
	}

	function log(...args) {
		console.log("S-File <browser>", ...args); // eslint-disable-line no-console
	}

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

	exports.SingleFile = void 0;

	function init(initOptions) {
		exports.SingleFile = getClass(getInstance(initOptions), cssTree$1);
	}

	async function getPageData(options = {}, initOptions, doc = globalThis.document, win = globalThis) {
		const frames = contentFrameTree;
		let framesSessionId;
		init(initOptions);
		if (doc && win) {
			initDoc(doc);
			const preInitializationPromises = [];
			if (!options.saveRawPage) {
				if (!options.removeFrames && frames && globalThis.frames && globalThis.frames.length) {
					let frameTreePromise;
					if (options.loadDeferredImages) {
						frameTreePromise = new Promise(resolve => globalThis.setTimeout(() => resolve(frames.getAsync(options)), options.loadDeferredImagesMaxIdleTime - frames.TIMEOUT_INIT_REQUEST_MESSAGE));
					} else {
						frameTreePromise = frames.getAsync(options);
					}
					preInitializationPromises.push(frameTreePromise);
				}
				if (options.loadDeferredImages) {
					preInitializationPromises.push(process$8(options));
				}
			}
			[options.frames] = await Promise.all(preInitializationPromises);
			framesSessionId = options.frames && options.frames.sessionId;
		}
		options.doc = doc;
		options.win = win;
		options.insertCanonicalLink = true;
		options.onprogress = event => {
			if (event.type === event.RESOURCES_INITIALIZED && doc && win && options.loadDeferredImages) {
				resetZoomLevel(options);
			}
		};
		const processor = new exports.SingleFile(options);
		await processor.run();
		if (framesSessionId) {
			frames.cleanup(framesSessionId);
		}
		return await processor.getPageData();
	}

	exports.getPageData = getPageData;
	exports.helper = singleFileHelper;
	exports.init = init;
	exports.modules = index;
	exports.processors = index$2;
	exports.vendor = index$1;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
