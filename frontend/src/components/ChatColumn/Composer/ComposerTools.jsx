// components/ChatColumn/Composer/ComposerTools.jsx

export default function ComposerTools({
  isVoiceOn,
  isPhotoOn,
  isBookmarked,
  isMathOn,
  onVoice,
  onPhoto,
  onBookmark,
  onMath,
  onSend,
  canSend,
}) {
  return (
    <div className="composer-tools">
      <button
        className={`tool${isMathOn ? " on" : ""}`}
        onClick={onMath}
        aria-label="Calculator"
        aria-pressed={isMathOn}
      >
        <span className="tool-fx" aria-hidden="true">ƒ(x)</span>
        Calculator
      </button>

      <button
        className={`tool${isPhotoOn ? " on" : ""}`}
        onClick={onPhoto}
        aria-label="Attach photo"
        aria-pressed={isPhotoOn}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <rect x="1.2" y="2.5" width="12.6" height="10" rx="1.6" />
          <circle cx="5" cy="6" r="1.4" />
        </svg>
        Photo
      </button>

      <button
        className={`tool${isVoiceOn ? " on" : ""}`}
        onClick={onVoice}
        aria-label={isVoiceOn ? "Stop listening" : "Start voice input"}
        aria-pressed={isVoiceOn}
      >
        <svg width="13" height="15" viewBox="0 0 13 15" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <rect x="4.4" y="1.2" width="4.2" height="8" rx="2.1" />
          <path d="M2 7.2a4.5 4.5 0 0 0 9 0M6.5 11.7v2.1" />
        </svg>
        Voice
      </button>

      <span className="tools-spacer" />

      <button
        className={`tool${isBookmarked ? " on" : ""}`}
        onClick={onBookmark}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this chat"}
        aria-pressed={isBookmarked}
      >
        ★
      </button>

      <button
        className="send"
        onClick={onSend}
        disabled={!canSend}
        aria-label="Send message"
      >
        Send
        <svg width="13" height="13" viewBox="0 0 13 13" fill="currentColor" aria-hidden="true">
          <path d="M1 6.5 12 1 8 6.5 12 12z" />
        </svg>
      </button>
    </div>
  );
}
