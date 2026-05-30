// components/ChatColumn/messages/UserMessage.jsx

export default function UserMessage({ content, attachment }) {
  return (
    <div className="msg user">
      <span className="av" aria-hidden="true" />
      <div className="bubble">
        {attachment && (
          <div className="photo-thumb">
            <span>{attachment.name ?? "uploaded photo"}</span>
          </div>
        )}
        <p>{content}</p>
      </div>
    </div>
  );
}
