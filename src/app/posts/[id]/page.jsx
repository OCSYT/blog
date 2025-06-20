import Database from "@/Components/Database";
import Link from "next/link";
import Auth from "@/Components/Auth";
import CommentForm from "./CommentForm";
import CommentList from "@/Components/CommentList";
import ReactMarkdown from "react-markdown";
import CodeRenderer from "@/Components/CodeRenderer";

export default async function PostPage({ params }) {
  const PostID = (await params).id;

  const { rows: PostRows } = await Database.query(
    "SELECT * FROM BlogPosts WHERE id = $1",
    [PostID]
  );

  if (PostRows.length === 0) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600">Post not found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back
        </Link>
      </main>
    );
  }

  const Post = PostRows[0];
  const { rows: Comments } = await Database.query(
    "SELECT * FROM BlogComments WHERE PostID = $1 ORDER BY CreatedAt DESC",
    [PostID]
  );

  const AuthUser = await Auth();
  if (!AuthUser) {
    return redirect("/api/auth/discord");
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <Link href="/">Back</Link>
      <article>
        <br></br>
        <h1 className="text-4xl font-bold">{Post.title}</h1>
        <br></br>
        <p className="text-gray-500 text-sm">
          by {Post.author} · {new Date(Post.createdat).toLocaleString()}
        </p>
        <br></br>
        <div
          className="border border-gray-300 p-4 rounded bg-[#11111b] text-gray-100 max-h-[400px] overflow-auto"
          style={{ fontSize: "1rem" }}
        >
          <ReactMarkdown components={{ code: CodeRenderer }}>
            {Post.content || "No content available."}
          </ReactMarkdown>
        </div>
      </article>

      <section className="mt-8">
        <CommentForm
          PostID={PostID}
          Author={AuthUser.Username}
          UserID={AuthUser.ID}
        />
        <br />
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <CommentList
          comments={Comments}
          currentUserID={AuthUser.ID}
          postID={PostID}
        />
      </section>
    </main>
  );
}
