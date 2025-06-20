import Database from "@/Components/Database";
import Auth from "@/Components/Auth";

export async function DELETE(request, { params }) {
  const PostID = params.id;

  const AuthUser = await Auth();

  const { rows } = await Database.query(
    "SELECT userid FROM BlogPosts WHERE id = $1",
    [PostID]
  );

  if (rows.length === 0) {
    return new Response("Post not found", { status: 404 });
  }

  if (rows[0].userid !== AuthUser.ID) {
    return new Response("Unauthorized", { status: 401 });
  }

  await Database.query("DELETE FROM BlogPosts WHERE id = $1", [PostID]);

  return new Response(null, { status: 204 });
}