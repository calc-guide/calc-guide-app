// components/ChatColumn/messages/TutorMessage.jsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import DesmosGraph from "./DesmosGraph";

// Claude emits math as \( … \) and \[ … \]; remark-math expects $ … $ / $$ … $$.
function normalizeMath(text) {
  if (!text) return "";
  return text
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, m) => `$$${m}$$`)
    .replace(/\\\(([\s\S]+?)\\\)/g, (_, m) => `$${m}$`);
}

// Intercept ```desmos fenced blocks and render a live graph instead of a code
// block. Overriding `pre` (not `code`) avoids nesting a <div> inside <pre>.
const markdownComponents = {
  pre({ children, ...props }) {
    const child = Array.isArray(children) ? children[0] : children;
    const className = child?.props?.className || "";
    if (/language-desmos/.test(className)) {
      const expressions = String(child.props.children)
        .trim()
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      return <DesmosGraph expressions={expressions} />;
    }
    return <pre {...props}>{children}</pre>;
  },
};

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
            components={markdownComponents}
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
