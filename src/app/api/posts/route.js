import Database from "@/Components/Database";

export async function POST(request) {
  try {
    const { Title, Content, Author, UserID } = await request.json();

    if (!Title || !Content || !Author || !UserID) {
      return new Response("Title and Content required", { status: 400 });
    }

    await Database.query(
      "INSERT INTO BlogPosts (Title, Content, Author, UserID) VALUES ($1, $2, $3, $4)",
      [Title, Content, Author, UserID]
    );

    return new Response("Post created", { status: 201 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}