import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeRenderer({ inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || "");
  const codeText = String(children).replace(/\n$/, "");

  if (!inline && match) {
    if (codeText.trim().length === 0) {
      return (
        <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
          {" "}
        </SyntaxHighlighter>
      );
    }
    return (
      <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div" {...props}>
        {codeText}
      </SyntaxHighlighter>
    );
  }

  return (
    <code className="bg-[#2a2a3b] rounded px-1 py-0.5 text-sm font-mono" {...props}>
      {children}
    </code>
  );
}