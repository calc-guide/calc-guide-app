// components/Drawer/Drawer.jsx

import { useEffect, useState } from "react";
import "./Drawer.css";
import ConversationList from "./ConversationList";
import {
  listConversations,
  deleteConversation,
  formatMeta,
} from "../../services/conversations";

export default function Drawer({ open, activeTab, onClose, onSelectConvo, activeConvoId }) {
  const [conversations, setConversations] = useState([]);

  // Re-read whenever the drawer opens — chats are saved while it's closed.
  useEffect(() => {
    if (!open) return;
    listConversations()
      .then(setConversations)
      .catch(() => setConversations([]));
  }, [open]);

  async function handleDelete(id) {
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  const filtered =
    activeTab === "bookmarks" ? conversations.filter((c) => c.bookmarked) : conversations;

  const items = filtered.map((c) => ({
    id: c.id,
    title: c.title,
    meta: formatMeta(c),
    bookmarked: !!c.bookmarked,
    active: c.id === activeConvoId,
  }));

  const title = activeTab === "bookmarks" ? "Bookmarks" : "History";
  const emptyLabel =
    activeTab === "bookmarks"
      ? "No bookmarks yet. Star a chat to save it here."
      : "No conversations yet. Send a message to start one.";

  return (
    <aside className={`drawer${open ? " open" : ""}`} aria-label={title} aria-hidden={!open}>
      <div className="drawer-inner">
        <div className="drawer-head">
          <h3>{title}</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close drawer">✕</button>
        </div>
        <ConversationList
          items={items}
          onSelect={onSelectConvo}
          onDelete={handleDelete}
          emptyLabel={emptyLabel}
        />
      </div>
    </aside>
  );
}
