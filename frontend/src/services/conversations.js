// services/conversations.js
// Local conversation history, persisted in IndexedDB (zero deps).
// One DB, one object store keyed by conversation id. Stores full messages
// (including base64 image attachments), so localStorage's quota isn't a concern.

const DB_NAME = "calc-guide";
const DB_VERSION = 1;
const STORE = "conversations";

let dbPromise = null;

function openDb() {
	if (dbPromise) return dbPromise;
	dbPromise = new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) {
				db.createObjectStore(STORE, { keyPath: "id" });
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
	return dbPromise;
}

function tx(mode, run) {
	return openDb().then(
		(db) =>
			new Promise((resolve, reject) => {
				const t = db.transaction(STORE, mode);
				const store = t.objectStore(STORE);
				const result = run(store);
				t.oncomplete = () => resolve(result.value);
				t.onerror = () => reject(t.error);
				t.onabort = () => reject(t.error);
			}),
	);
}

// Returns all conversations, newest first. Holder object so tx() can resolve
// with the request's result once the transaction completes.
export async function listConversations() {
	const holder = await tx("readonly", (store) => {
		const out = { value: [] };
		store.getAll().onsuccess = (e) => {
			out.value = e.target.result;
		};
		return out;
	});
	return (holder ?? []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getConversation(id) {
	return tx("readonly", (store) => {
		const out = {};
		store.get(id).onsuccess = (e) => {
			out.value = e.target.result;
		};
		return out;
	});
}

export async function saveConversation(convo) {
	await tx("readwrite", (store) => {
		store.put(convo);
		return {};
	});
	return convo;
}

export async function deleteConversation(id) {
	await tx("readwrite", (store) => {
		store.delete(id);
		return {};
	});
}

// "Today · 12 messages" / "Yesterday · 3 messages" / "Mar 4 · 8 messages"
export function formatMeta(convo) {
	const count = convo.messages?.length ?? 0;
	const noun = count === 1 ? "message" : "messages";
	return `${relativeDay(convo.updatedAt)} · ${count} ${noun}`;
}

function relativeDay(ts) {
	if (!ts) return "—";
	const now = new Date();
	const then = new Date(ts);
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const dayMs = 86400000;
	const diffDays = Math.floor((startOfToday - new Date(then.getFullYear(), then.getMonth(), then.getDate())) / dayMs);
	if (diffDays <= 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	return then.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Title from the first user message, trimmed to a sensible length.
export function deriveTitle(messages) {
	const first = messages.find((m) => m.role === "user" && m.content?.trim());
	const text = first?.content?.trim() || "New conversation";
	return text.length > 48 ? `${text.slice(0, 47)}…` : text;
}
