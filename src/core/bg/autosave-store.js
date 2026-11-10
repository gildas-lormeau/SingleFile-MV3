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

/* global indexedDB */

const DATABASE_NAME = "single-file-autosave";
const STORE_NAME = "pages";

let databasePromise;

export {
	getEntries,
	set,
	remove
};

function getEntries() {
	return runTransaction("readonly", (store, resolve) => {
		const entries = [];
		store.openCursor().onsuccess = event => {
			const cursor = event.target.result;
			if (cursor) {
				entries.push([cursor.key, cursor.value]);
				cursor.continue();
			} else {
				resolve(entries);
			}
		};
	});
}

function set(key, value) {
	return runTransaction("readwrite", store => store.put(value, key));
}

function remove(key) {
	return runTransaction("readwrite", store => store.delete(key));
}

async function runTransaction(mode, callback) {
	const database = await getDatabase();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction(STORE_NAME, mode);
		let result;
		transaction.oncomplete = () => resolve(result);
		transaction.onerror = transaction.onabort = () => reject(transaction.error);
		callback(transaction.objectStore(STORE_NAME), value => result = value);
	});
}

function getDatabase() {
	if (!databasePromise) {
		databasePromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DATABASE_NAME, 1);
			request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
	return databasePromise;
}
