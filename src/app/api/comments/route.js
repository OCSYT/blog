import Database from "@/Components/Database";

export async function POST(request) {
  try {
    const { PostID, Content, Author, UserID } = await request.json();

    if (!PostID || !Content || !Author || !UserID) {
      return new Response("Missing fields", { status: 400 });
    }

    await Database.query(
      "INSERT INTO BlogComments (PostID, Content, Author, UserID) VALUES ($1, $2, $3, $4)",
      [PostID, Content, Author, UserID]
    );

    return new Response("Comment created", { status: 201 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}