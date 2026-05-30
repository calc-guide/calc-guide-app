// components/ChatColumn/Composer/AttachmentChip.jsx

export default function AttachmentChip({ filename, onRemove }) {
  return (
    <div className="attach-row">
      <div className="attach-chip">
        <span className="attach-mini" aria-hidden="true" />
        <small>{filename}</small>
        <button className="rm" onClick={onRemove} aria-label="Remove attachment">✕</button>
      </div>
    </div>
  );
}
