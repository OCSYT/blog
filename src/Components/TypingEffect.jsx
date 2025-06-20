'use client';

import { useState, useEffect } from "react";

export default function TypingEffect({ Text, Speed = 50, StyleProps = "font-mono whitespace-pre text-2xl" }) {
  const FullText = `< ${Text} />`;

  const [DisplayText, setDisplayText] = useState("");
  const [ShowCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayText(FullText.slice(0, index + 1));
      index++;
      if (index === FullText.length) clearInterval(typingInterval);
    }, Speed);

    const cursorInterval = setInterval(() => {
      setShowCursor((show) => !show);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [FullText, Speed]);

  return (
    <h1 className={StyleProps}>
      {DisplayText}
      <span
        className="ml-1 select-none"
        style={{ opacity: ShowCursor ? 1 : 0 }}
      >
        |
      </span>
    </h1>
  );
}
