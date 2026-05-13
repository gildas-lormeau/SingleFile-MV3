/*
 * Copyright 2010-2020 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 *
 * This file is part of SingleFile.
 *
 *   The code in this file is free software: you can redistribute it and/or
 *   modify it under the terms of the GNU Affero General Public License
 *   as published by the Free Software Foundation, either version 3 of the
 *   License, or (at your option) any later version.
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

/* global browser, URLSearchParams */

import * as config from "./config.js";

const OPTIONS_PAGE_PATH = "/src/ui/pages/options.html";
const pendingRequests = new Map();
let requestId = 0;

export {
	onMessage,
	requestPermission
};

async function requestPermission(sender, message = {}) {
	const extensionId = sender && sender.id;
	if (!extensionId) {
		throw new Error("Cannot identify the extension requesting SingleFile capture");
	}
	const permissions = await config.getExternalCapturePermissions();
	if (permissions.allowedExtensionIds.includes(extensionId)) {
		return true;
	}
	const request = getOrCreatePendingRequest(extensionId, sender, message);
	await openOptionsPage(request.id);
	return request.promise;
}

async function onMessage(message) {
	if (message.method.endsWith(".getPermissions")) {
		return config.getExternalCapturePermissions();
	}
	if (message.method.endsWith(".setPermissions")) {
		await config.setExternalCapturePermissions(message.permissions);
		return {};
	}
	if (message.method.endsWith(".getPendingRequest")) {
		return getPendingRequest(message.requestId);
	}
	if (message.method.endsWith(".respondPendingRequest")) {
		return respondPendingRequest(message.requestId, message.approved);
	}
}

function getOrCreatePendingRequest(extensionId, sender, message = {}) {
	const existingRequest = Array.from(pendingRequests.values()).find(request => request.extensionId == extensionId);
	if (existingRequest) {
		return existingRequest;
	}
	const id = String(++requestId);
	let resolvePermission;
	const promise = new Promise(resolve => resolvePermission = resolve);
	const request = {
		id,
		extensionId,
		displayName: sanitizeDisplayName(message.displayName || message.callerName || message.extensionName),
		url: sender.url,
		origin: sender.origin,
		resolvePermission,
		promise
	};
	pendingRequests.set(id, request);
	return request;
}

function getPendingRequest(id) {
	const request = pendingRequests.get(id);
	if (request) {
		return {
			id: request.id,
			extensionId: request.extensionId,
			displayName: request.displayName,
			url: request.url,
			origin: request.origin
		};
	}
}

async function respondPendingRequest(id, approved) {
	const request = pendingRequests.get(id);
	if (!request) {
		return { found: false };
	}
	const permissions = await config.getExternalCapturePermissions();
	const allowedExtensions = permissions.allowedExtensions.filter(extension => extension.id != request.extensionId);
	if (approved) {
		allowedExtensions.push({
			id: request.extensionId,
			name: request.displayName
		});
	}
	await config.setExternalCapturePermissions({ allowedExtensions });
	pendingRequests.delete(id);
	request.resolvePermission(Boolean(approved));
	return { found: true, approved: Boolean(approved) };
}

async function openOptionsPage(requestId) {
	const searchParams = new URLSearchParams({ externalCaptureRequestId: requestId });
	const url = browser.runtime.getURL(`${OPTIONS_PAGE_PATH}?${searchParams.toString()}`);
	await browser.tabs.create({ active: true, url });
}

function sanitizeDisplayName(value) {
	if (typeof value != "string") {
		return "";
	}
	return value.trim().replace(/\s+/g, " ").slice(0, 80);
}
