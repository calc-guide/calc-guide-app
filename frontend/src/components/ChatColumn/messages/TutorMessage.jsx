// components/ChatColumn/messages/TutorMessage.jsx

export default function TutorMessage({ tutorName, content, showDiagram }) {
  return (
    <div className="msg tutor">
      <span className="av" aria-hidden="true">{tutorName?.charAt(0) ?? "?"}</span>
      <div className="bubble">
        <p className="who">{tutorName}</p>
        <p>{content}</p>
        {showDiagram && (
          <div className="diagram">
            <span>graph placeholder tangent line on a curve</span>
          </div>
        )}
      </div>
    </div>
  );
}
