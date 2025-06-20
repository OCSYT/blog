"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import CodeRenderer from "@/Components/CodeRenderer";

export default function CommentForm({ PostID, Author, UserID }) {
  const [Content, SetContent] = useState("");
  const [IsSubmitting, SetIsSubmitting] = useState(false);
  const [IsPreview, SetIsPreview] = useState(false);
  const [ErrorMessage, SetErrorMessage] = useState("");

  async function HandleSubmit(e) {
    e.preventDefault();
    SetIsSubmitting(true);
    SetErrorMessage("");

    try {
      const Response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ PostID, Content, Author, UserID }),
      });

      if (!Response.ok) throw new Error("Failed to post comment");

      SetContent("");
      window.location.reload();
    } catch (error) {
      SetErrorMessage(error.message);
    } finally {
      SetIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={HandleSubmit} className="mt-6 flex flex-col gap-4">
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
          className="border border-gray-300 p-4 rounded bg-[#11111b] text-gray-100 max-h-[300px] overflow-auto"
          style={{ fontSize: "1rem" }}
        >
          <ReactMarkdown components={{ code: CodeRenderer }}>
            {Content || "Nothing to preview yet..."}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          placeholder="Write a comment..."
          value={Content}
          onChange={(e) => SetContent(e.target.value)}
          required
          rows={4}
          className="border border-gray-300 p-2 rounded text-lg resize-y w-full bg-[#1e1e2e] text-gray-100"
        />
      )}

      {ErrorMessage && (
        <div className="text-red-500 bg-red-100 rounded p-2">{ErrorMessage}</div>
      )}

      <button
        type="submit"
        disabled={IsSubmitting}
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {IsSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}