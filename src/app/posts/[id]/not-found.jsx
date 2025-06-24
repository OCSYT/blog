import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto p-8 space-y-6">
      <h2>Not Found</h2>
      <p>Could not find requested post</p>
      <Link href="/">Return to home</Link>
    </main>
  );
}
