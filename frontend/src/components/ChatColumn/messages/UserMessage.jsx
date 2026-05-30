// components/ChatColumn/messages/UserMessage.jsx

export default function UserMessage({ content, attachment }) {
  return (
    <div className="msg user">
      <span className="av" aria-hidden="true">You</span>
      <div className="bubble">
        {attachment?.dataUrl && (
          <img
            className="photo-thumb"
            src={attachment.dataUrl}
            alt={attachment.name ?? "uploaded photo"}
          />
        )}
        <p>{content}</p>
      </div>
    </div>
  );
}
