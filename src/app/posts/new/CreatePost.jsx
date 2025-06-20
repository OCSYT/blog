"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import CodeRenderer from "@/Components/CodeRenderer";

export default function CreatePost({ Author, UserID }) {
  const [Title, SetTitle] = useState("");
  const [Content, SetContent] = useState("");
  const [IsSubmitting, SetIsSubmitting] = useState(false);
  const [IsPreview, SetIsPreview] = useState(false);
  const Router = useRouter();

  async function HandleSubmit(e) {
    e.preventDefault();
    SetIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Title, Content, Author, UserID }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      Router.push("/");
    } catch (error) {
      alert(error.message);
      SetIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Title"
        value={Title}
        onChange={(e) => SetTitle(e.target.value)}
        required
        className="border border-gray-300 p-2 rounded text-lg bg-[#1e1e2e] text-gray-100"
      />

      <div className="flex items-center gap-4">
        <label className="flex items-center cursor-pointer select-none text-gray-100">
          <input
            type="checkbox"
            checked={IsPreview}
            onChange={() => SetIsPreview(!IsPreview)}
            className="mr-2 rounded"
          />
          Preview Mode
        </label>
      </div>

      {IsPreview ? (
        <div
          className="border border-gray-300 p-4 rounded bg-[#11111b] text-gray-100 max-h-[400px] overflow-auto"
          style={{ fontSize: "1rem" }}
        >
          <ReactMarkdown components={{ code: CodeRenderer }}>
            {Content || "Nothing to preview yet..."}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          placeholder="Content (Markdown supported)"
          value={Content}
          onChange={(e) => SetContent(e.target.value)}
          required
          rows={12}
          className="border border-gray-300 p-2 rounded text-lg resize-y w-full bg-[#1e1e2e] text-gray-100"
        />
      )}

      <button
        type="submit"
        disabled={IsSubmitting}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {IsSubmitting ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
