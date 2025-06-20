import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Auth() {
  const CookiesList = await cookies();
  const Host = CookiesList.get("host")?.value;
  const Protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const BaseUrl = `${Protocol}://${Host}`;

  try {
    const UserRes = await fetch(`${BaseUrl}/api/auth/discord/user`, {
      credentials: "include", // Ensures cookies are sent
      cache: "no-store",
    });

    if (!UserRes.ok) {
      console.error("API Error:", UserRes.status, UserRes.statusText);
      redirect("/api/auth/discord");
    }

    const UserData = await UserRes.json();
    console.log("User Data:", UserData);

    return UserData;
  } catch (Error) {
    console.error("Fetch Error:", Error);
    redirect("/api/auth/discord");
  }
}