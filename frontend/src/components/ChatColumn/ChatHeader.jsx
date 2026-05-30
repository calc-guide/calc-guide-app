// components/ChatColumn/ChatHeader.jsx

export default function ChatHeader({ tutor, isBookmarked, onToggleBookmark }) {
  return (
    <div className="chat-header">
      <span className="chat-header-avatar" aria-hidden="true">
        {tutor?.name?.charAt(0) ?? "?"}
      </span>
      <div>
        <div className="chat-header-name">
          {tutor?.name ?? "Tutor"} · Limits &amp; Derivatives
        </div>
        <div className="chat-header-sub">Lesson 1 · started today</div>
      </div>
      <div className="chat-header-actions">
        <button
          className={`icon-btn${isBookmarked ? " active" : ""}`}
          onClick={onToggleBookmark}
          aria-pressed={isBookmarked}
        >
          {isBookmarked ? "★ Bookmarked" : "★ Bookmark chat"}
        </button>
        <button className="icon-btn" aria-label="More options">⋯</button>
      </div>
    </div>
  );
}
