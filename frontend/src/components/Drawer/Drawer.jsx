// components/Drawer/Drawer.jsx

import "./Drawer.css";
import DrawerTabs from "./DrawerTabs";
import ConversationList from "./ConversationList";

// Placeholder data — replace with real API data later
const HISTORY = [
  { id: 1, title: "The limit definition",    meta: "Today · 12 messages",  bookmarked: false },
  { id: 2, title: "Power & chain rule",       meta: "Yesterday",            bookmarked: false },
  { id: 3, title: "What is a tangent line?",  meta: "Mon",                  bookmarked: false },
  { id: 4, title: "Continuity & gaps",        meta: "Last week",            bookmarked: false },
  { id: 5, title: "Intro: rates of change",   meta: "Last week",            bookmarked: false },
  { id: 6, title: "Graphing f(x)=x³−x",      meta: "2 weeks ago",          bookmarked: false },
];

const BOOKMARKS = [
  { id: 7, title: "Chain rule — worked example",    meta: "saved Tue",       bookmarked: true },
  { id: 8, title: "Why dy/dx notation?",            meta: "saved Mon",       bookmarked: true },
  { id: 9, title: "Derivative rules cheat sheet",   meta: "saved last week", bookmarked: true },
];

export default function Drawer({ open, activeTab, onTabChange, onClose, onSelectConvo }) {
  const items = activeTab === "bookmarks" ? BOOKMARKS : HISTORY;
  const title = activeTab === "bookmarks" ? "Bookmarks" : "History";

  return (
    <aside className={`drawer${open ? " open" : ""}`} aria-label={title} aria-hidden={!open}>
      <div className="drawer-inner">
        <div className="drawer-head">
          <h3>{title}</h3>
          <button className="drawer-close" onClick={onClose} aria-label="Close drawer">✕</button>
        </div>

        <DrawerTabs activeTab={activeTab} onChange={onTabChange} />

        <ConversationList items={items} onSelect={onSelectConvo} />
      </div>
    </aside>
  );
}
