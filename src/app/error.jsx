"use client";
import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <html>
      <body>
        <main className="max-w-3xl mx-auto p-8 space-y-6">
          <h2>Oh no! Something went wrong!</h2>
          <p>{error.message}</p>
          <Link href="/">Go back to home</Link>
        </main>
      </body>
    </html>
  );
}
