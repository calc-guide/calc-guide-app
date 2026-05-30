// components/Drawer/ConversationList.jsx

export default function ConversationList({ items, onSelect }) {
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
        </div>
      ))}
    </div>
  );
}
