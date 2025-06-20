// app/create-new-post/page.tsx
import { redirect } from "next/navigation";
import Auth from "@/Components/Auth";
import CreatePost from "./CreatePost";
import Link from "next/link";
const AllowedUserIDs = process.env.ALLOWED_USER_IDS
  ? process.env.ALLOWED_USER_IDS.split(",")
  : [];

export default async function CreateNewPostPage() {
  const AuthUser = await Auth();
  if (!AuthUser) {
    return redirect("/api/auth/discord");
  }
  if (!AllowedUserIDs.includes(AuthUser.ID)) {
    return redirect("/");
  }

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <Link href="/">Back</Link>
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <CreatePost Author={AuthUser.Username} UserID={AuthUser.ID} />
    </main>
  );
}
