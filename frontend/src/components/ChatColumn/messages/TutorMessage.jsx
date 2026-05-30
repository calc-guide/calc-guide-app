// components/ChatColumn/messages/TutorMessage.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// Claude emits math as \( … \) and \[ … \]; remark-math expects $ … $ / $$ … $$.
function normalizeMath(text) {
  if (!text) return "";
  return text
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$${m}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m}$`);
}

export default function TutorMessage({ tutorName, content, showDiagram }) {
  return (
    <div className="msg tutor">
      <span className="av" aria-hidden="true">{tutorName?.charAt(0) ?? "?"}</span>
      <div className="bubble">
        <p className="who">{tutorName}</p>
        <div className="md">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {normalizeMath(content)}
          </ReactMarkdown>
        </div>
        {showDiagram && (
          <div className="diagram">
            <span>graph placeholder tangent line on a curve</span>
          </div>
        )}
      </div>
    </div>
  );
}
