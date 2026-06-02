// components/Drawer/ConversationList.jsx

export default function ConversationList({ items, onSelect, onDelete, emptyLabel }) {
  if (items.length === 0) {
    return <div className="conversation-empty">{emptyLabel}</div>;
  }

  return (
    <div className="conversation-list">
      {items.map((item) => (
        <div
          key={item.id}
          className={`conversation-item${item.active ? " active" : ""}`}
          onClick={() => onSelect(item)}
          role="button"
          tabIndex={0}
        >
          <span className={`convo-star${item.bookmarked ? " bookmarked" : ""}`}>★</span>
          <span className="convo-text">
            <span className="convo-title">{item.title}</span>
            <span className="convo-meta">{item.meta}</span>
          </span>
          <button
            className="convo-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            aria-label="Delete conversation"
            title="Delete conversation"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
