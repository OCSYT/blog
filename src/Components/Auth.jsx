import { headers as Headers } from "next/headers";
import { redirect as Redirect } from "next/navigation";

export default async function Auth() {
  const HeadersList = Headers();
  const Host = HeadersList.get("host");
  const Protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const BaseUrl = `${Protocol}://${Host}`;

  const Cookie = HeadersList.get("cookie") ?? "";

  try {
    const UserRes = await fetch(`${BaseUrl}/api/auth/discord/user`, {
      headers: {
        cookie: Cookie,
      },
      cache: "no-store",
    });

    if (!UserRes.ok) {
      console.error("API Error:", UserRes.status, UserRes.statusText);
      Redirect("/api/auth/discord");
    }

    const UserData = await UserRes.json();
    console.log("User Data:", UserData);

    return UserData;
  } catch (Error) {
    console.error("Fetch Error:", Error);
    Redirect("/api/auth/discord");
  }
}