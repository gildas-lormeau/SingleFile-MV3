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

/* global window */

if (typeof globalThis == "undefined") {
	window.globalThis = window;
}

(() => {

	const nativeAPI = globalThis.chrome;

	function respond(sendResponse, response) {
		try {
			sendResponse(response);
			// eslint-disable-next-line no-unused-vars
		} catch (error) {
			// ignored
		}
	}

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
			// "identity" is an optional permission, so nativeAPI.identity is undefined
			// until it is granted. The getters below allow callers to feature-detect it
			// instead of throwing a TypeError when the permission is missing.
			getRedirectURL: () => nativeAPI.identity.getRedirectURL(),
			get getAuthToken() {
				return nativeAPI.identity && nativeAPI.identity.getAuthToken &&
					(details => nativeAPI.identity.getAuthToken(details));
			},
			get launchWebAuthFlow() {
				return nativeAPI.identity && nativeAPI.identity.launchWebAuthFlow &&
					(details => nativeAPI.identity.launchWebAuthFlow(details));
			},
			get removeCachedAuthToken() {
				return nativeAPI.identity && nativeAPI.identity.removeCachedAuthToken &&
					(details => nativeAPI.identity.removeCachedAuthToken(details));
			}
		},
		contextMenus: nativeAPI.contextMenus && {
			onClicked: {
				addListener: listener => nativeAPI.contextMenus.onClicked.addListener(listener)
			},
			get ACTION_MENU_TOP_LEVEL_LIMIT() {
				return nativeAPI.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT;
			},
			get ContextType() {
				return nativeAPI.contextMenus.ContextType;
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
										// eslint-disable-next-line no-unused-vars
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
				// Returning true promises the caller a reply, so one has to be sent on every
				// path. Firefox reports a rejected handler through runtime.lastError; Chrome
				// gives a listener no way to set it, so the reason can only travel as the
				// response value, and { error } is the shape SingleFile answers with. That
				// asymmetry is documented rather than papered over: it is the one part of the
				// behavior Chrome cannot reproduce.
				//
				// The catch is deliberately here and not on onMessage above. This event has a
				// single listener, so nothing can be pre-empted by answering. onMessage is
				// shared — singlefile.fetchResponse alone has two listeners in the content
				// scripts — and there a rejecting listener that answered would beat the one
				// that actually handles the message and turn a working save into a failed one.
				addListener: listener => nativeAPI.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
					const response = listener(message, sender);
					if (response && typeof response.then == "function") {
						response
							.then(response => respond(sendResponse, response === undefined ? null : response))
							.catch(error => respond(sendResponse, { error: error && error.message }));
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
			onChanged: {
				addListener: listener => nativeAPI.storage.onChanged.addListener(listener),
				removeListener: listener => nativeAPI.storage.onChanged.removeListener(listener)
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

})();