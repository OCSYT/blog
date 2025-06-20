"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostList({ Posts, CurrentUserID }) {
  const Router = useRouter();

  async function HandleDelete(PostID) {
    const Res = await fetch(`/api/posts/${PostID}/delete`, {
      method: "DELETE",
    });

    if (Res.ok) {
      Router.refresh();
    }
  }

  if (Posts.length === 0) {
    return <p className="text-center text-gray-500">No posts yet.</p>;
  }

  return (
    <section className="px-4 sm:px-6 py-4 space-y-4">
      {Posts.map((Post) => (
        <article
          key={Post.id}
          className="bg-[#11111b] p-4 sm:p-5 rounded-xl flex flex-col gap-3 sm:gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <Link
              href={`/posts/${Post.id}`}
              className="text-xl sm:text-2xl font-semibold text-gray-100 hover:text-blue-500 transition-colors break-words"
            >
              {Post.title}
            </Link>

            {Post.userid === CurrentUserID && (
              <button
                onClick={() => HandleDelete(Post.id)}
                className="text-red-500 hover:text-red-700 text-sm font-medium sm:self-start"
              >
                Delete
              </button>
            )}
          </div>

          <div className="text-sm text-gray-400 flex flex-wrap gap-2">
            <span>by: {Post.author}</span>
            <span>•</span>
            <span>{new Date(Post.createdat).toLocaleString()}</span>
          </div>
        </article>
      ))}
    </section>
  );
}