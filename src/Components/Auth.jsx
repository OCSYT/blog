import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Authenticate() {
  const CookieStore = await cookies();
  const CookieString = CookieStore
    .getAll()
    .map((cookie) => `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}`)
    .join("; ");

  const Protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const Host = process.env.HOST || "localhost:3000";
  const BaseUrl = `${Protocol}://${Host}`;

  try {
    const UserResponse = await fetch(`${BaseUrl}/api/auth/discord/user`, {
      headers: {
        Cookie: CookieString,
      },
      cache: "no-store",
    });

    if (!UserResponse.ok) {
      console.error("API Error:", UserResponse.status, UserResponse.statusText);
      return redirect("/api/auth/discord");
    }

    const UserData = await UserResponse.json();
    console.log("User Data:", UserData);

    return UserData;
  } catch (Error) {
    console.error("Fetch Error:", Error);
    return redirect("/api/auth/discord");
  }
}