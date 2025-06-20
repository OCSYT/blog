import Database from "@/Components/Database";
import Auth from "@/Components/Auth";

const AllowedUserIDs = process.env.ALLOWED_USER_IDS
  ? process.env.ALLOWED_USER_IDS.split(",")
  : [];

export async function DELETE(request, { params }) {
  const { id } = params;
  const CommentID = id;
  const AuthUser = await Auth();

  const { rows } = await Database.query(
    "SELECT userid, postid FROM BlogComments WHERE id = $1",
    [CommentID]
  );

  if (rows.length === 0) {
    return new Response("Comment not found", { status: 404 });
  }

  const IsAllowedUser = AllowedUserIDs.includes(AuthUser.ID);
  const IsCommentOwner = rows[0].userid === AuthUser.ID;

  if (!IsAllowedUser && !IsCommentOwner) {
    return new Response("Unauthorized", { status: 401 });
  }

  await Database.query("DELETE FROM BlogComments WHERE id = $1", [CommentID]);

  return new Response(null, { status: 204 });
}