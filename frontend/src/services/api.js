// services/api.js
// Every fetch() call to Spring Boot lives here.
// No component ever calls fetch() directly — they import from this file.
// When your backend URL changes, you fix it in one place.

// Prod serves UI + API same-origin → relative /api paths. Dev hits the
// local Spring Boot server. An explicit VITE_API_URL overrides both.
const BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? "" : "http://localhost:8080");

/**
 * Send a chat message to the Spring Boot backend.
 * The backend proxies the request to Claude.
 *
 * @param {string} message  - The user's message text
 * @param {string} tutorId  - Which tutor is active (e.g. "rivera")
 * @param {Array}  history  - Previous messages [{ role, content }, ...]
 * @returns {Promise<string>} Claude's reply text
 */
export async function sendMessage({ message, tutorId, history = [], attachment = null }) {
  const response = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, tutorId, history, attachment }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  // Backend contract is `reply`; tolerate `response` for resilience.
  return data.reply ?? data.response;
}

/**
 * Fetch the chat history list for the sidebar.
 * @returns {Promise<Array>} Array of { id, title, meta, bookmarked }
 */
export async function fetchHistory() {
  const response = await fetch(`${BASE_URL}/api/history`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

/**
 * Fetch saved/bookmarked chats.
 * @returns {Promise<Array>} Array of { id, title, meta, bookmarked }
 */
export async function fetchBookmarks() {
  const response = await fetch(`${BASE_URL}/api/bookmarks`);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
