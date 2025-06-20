"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import CodeRenderer from "@/Components/CodeRenderer";

export default function CommentList({ comments, currentUserID, postID }) {
  const router = useRouter();

  async function HandleDelete(commentID) {
    const res = await fetch(`/api/comments/${commentID}/delete`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    }
  }

  if (comments.length === 0) {
    return <p className="text-gray-500 text-center mt-4">No comments yet.</p>;
  }

  return (
    <ul className="space-y-4 mt-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="bg-[#11111b] p-4 sm:p-5 rounded-xl shadow-sm flex flex-col gap-2"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <p className="text-sm text-gray-400">
              {comment.author} • {new Date(comment.createdat).toLocaleString()}
            </p>
            {comment.userid === currentUserID && (
              <button
                onClick={() => HandleDelete(comment.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium sm:self-start"
              >
                Delete
              </button>
            )}
          </div>

          <div className="text-gray-100 text-base leading-relaxed break-words">
            <ReactMarkdown components={{ code: CodeRenderer }}>
              {comment.content || "No content available."}
            </ReactMarkdown>
          </div>
        </li>
      ))}
    </ul>
  );
}