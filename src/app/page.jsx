import Database from "@/Components/Database";
import TypingEffect from "@/Components/TypingEffect";
import Auth from "@/Components/Auth";
import PostList from "@/Components/PostList";
import Link from "next/link";

const AllowedUserIDs = process.env.ALLOWED_USER_IDS
  ? process.env.ALLOWED_USER_IDS.split(",")
  : [];

export default async function Page({ searchParams }) {
  const SearchParams = await searchParams;
  const SortOrder = SearchParams?.sort === "asc" ? "ASC" : "DESC";
  const AuthUser = await Auth();
  const { rows: Posts } = await Database.query(
    `SELECT * FROM BlogPosts ORDER BY CreatedAt ${SortOrder}`
  );

  return (
    <main className="max-w-4xl mx-auto p-8">
      <TypingEffect
        Text="Programming Blog"
        Speed={80}
        StyleProps="text-5xl font-extrabold mb-8 text-gray-900"
      />

      <nav className="mb-8 space-x-4">
        <Link href="/?sort=asc" className="text-blue-600 hover:underline font-medium">
          Sort Ascending
        </Link>
        <span className="text-gray-400">|</span>
        <Link href="/?sort=desc" className="text-blue-600 hover:underline font-medium">
          Sort Descending
        </Link>

        <span className="text-gray-400">|</span>
        <Link href="/api/auth/discord" className="text-blue-600 hover:underline font-medium">
          Switch Account
        </Link>

        {AllowedUserIDs.includes(AuthUser.ID) && (
          <>
            <span className="text-gray-400">|</span>
            <Link href="/posts/new" className="text-blue-600 hover:underline font-medium">
              Create New Post
            </Link>
          </>
        )}
      </nav>

      <PostList Posts={Posts} CurrentUserID={AuthUser.ID} />
    </main>
  );
}
