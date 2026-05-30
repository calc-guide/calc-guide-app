// components/Drawer/DrawerTabs.jsx

export default function DrawerTabs({ activeTab, onChange }) {
  return (
    <div className="drawer-tabs">
      <button
        className={`drawer-tab${activeTab === "history" ? " active" : ""}`}
        onClick={() => onChange("history")}
      >
        History
      </button>
      <button
        className={`drawer-tab${activeTab === "bookmarks" ? " active" : ""}`}
        onClick={() => onChange("bookmarks")}
      >
        Bookmarks
      </button>
    </div>
  );
}
