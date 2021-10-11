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
					getAcceptLanguages: () => new Promise((resolve, reject) => {
						nativeAPI.i18n.getAcceptLanguages(languages => {
							if (nativeAPI.runtime.lastError) {
								reject(nativeAPI.runtime.lastError);
							} else {
								resolve(languages);
							}
						});
					})
				},
				identity: {
					get getAuthToken() {
						return nativeAPI.identity && nativeAPI.identity.getAuthToken && (details => new Promise((resolve, reject) =>
							nativeAPI.identity.getAuthToken(details, token => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve(token);
								}
							})
						));
					},
					get launchWebAuthFlow() {
						return nativeAPI.identity && nativeAPI.identity.launchWebAuthFlow && (options => new Promise((resolve, reject) => {
							nativeAPI.identity.launchWebAuthFlow(options, responseUrl => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve(responseUrl);
								}
							});
						}));
					},
					get removeCachedAuthToken() {
						return nativeAPI.identity && nativeAPI.identity.removeCachedAuthToken && (details => new Promise((resolve, reject) =>
							nativeAPI.identity.removeCachedAuthToken(details, () => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve();
								}
							})
						));
					}
				},
				contextMenus: {
					onClicked: {
						addListener: listener => nativeAPI.contextMenus.onClicked.addListener(listener)
					},
					create: options => nativeAPI.contextMenus.create(options),
					update: (menuItemId, options) => new Promise((resolve, reject) => {
						nativeAPI.contextMenus.update(menuItemId, options, () => {
							if (nativeAPI.runtime.lastError) {
								reject(nativeAPI.runtime.lastError);
							} else {
								resolve();
							}
						});
					}),
					removeAll: () => new Promise((resolve, reject) => {
						nativeAPI.contextMenus.removeAll(() => {
							if (nativeAPI.runtime.lastError) {
								reject(nativeAPI.runtime.lastError);
							} else {
								resolve();
							}
						});
					})
				},
				permissions: {
					request: permissions => nativeAPI.permissions.request(permissions),
					remove: permissions => nativeAPI.permissions.remove(permissions)
				},
				runtime: {
					connectNative: application => nativeAPI.runtime.connectNative(application),
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
								reject(new Error(nativeAPI.runtime.lastError.message));
							} else {
								resolve(response);
							}
						});
						if (nativeAPI.runtime.lastError) {
							reject(new Error(nativeAPI.runtime.lastError.message));
						}
					}),
					getURL: (path) => nativeAPI.runtime.getURL(path),
					get lastError() {
						return nativeAPI.runtime.lastError;
					}
				},
				scripting: {
					executeScript: injection => nativeAPI.scripting.executeScript(injection)
				},
				storage: {
					local: {
						set: value => new Promise((resolve, reject) => {
							nativeAPI.storage.local.set(value, () => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve();
								}
							});
						}),
						get: () => new Promise((resolve, reject) => {
							nativeAPI.storage.local.get(null, value => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve(value);
								}
							});
						}),
						clear: () => new Promise((resolve, reject) => {
							nativeAPI.storage.local.clear(() => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve();
								}
							});
						}),
						remove: keys => new Promise((resolve, reject) => {
							nativeAPI.storage.local.remove(keys, () => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve();
								}
							});
						})
					},
					sync: {
						set: value => new Promise((resolve, reject) => {
							nativeAPI.storage.sync.set(value, () => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve();
								}
							});
						}),
						get: () => new Promise((resolve, reject) => {
							nativeAPI.storage.sync.get(null, value => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve(value);
								}
							});
						}),
						clear: () => new Promise((resolve, reject) => {
							nativeAPI.storage.sync.clear(() => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve();
								}
							});
						}),
						remove: keys => new Promise((resolve, reject) => {
							nativeAPI.storage.sync.remove(keys, () => {
								if (nativeAPI.runtime.lastError) {
									reject(nativeAPI.runtime.lastError);
								} else {
									resolve();
								}
							});
						})
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
				devtools: nativeAPI.devtools && {
					inspectedWindow: nativeAPI.devtools.inspectedWindow && {
						onResourceContentCommitted: nativeAPI.devtools.inspectedWindow.onResourceContentCommitted && {
							addListener: listener => nativeAPI.devtools.inspectedWindow.onResourceContentCommitted.addListener(listener)
						},
						get tabId() {
							return nativeAPI.devtools.inspectedWindow.tabId;
						}
					}
				}
			}));
		}

	})();

}());
