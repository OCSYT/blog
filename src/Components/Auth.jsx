import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Auth() {
  const HeadersList = headers();
  const Host = HeadersList.get("host");
  const Protocol =
    process.env.NODE_ENV === "production"
      ? HeadersList.get("x-forwarded-proto") || "https"
      : "http";
  const BaseUrl = `${Protocol}://${Host}`;

  try {
    const UserRes = await fetch(`${BaseUrl}/api/auth/discord/user`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!UserRes.ok) {
      console.error("API Error:", UserRes.status, UserRes.statusText);
      redirect("/api/auth/discord");
      return;
    }

    const UserData = await UserRes.json();
    console.log("User Data:", UserData);
    return UserData;
  } catch (Error) {
    console.error("Fetch Error:", Error);
    redirect("/api/auth/discord");
    return;
  }
}