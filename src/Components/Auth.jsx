import { headers } from "next/headers";

export default async function Auth() {
  const HeadersList = await headers();
  const Host = HeadersList.get("host");
  const Protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const BaseUrl = `${Protocol}://${Host}`;

  const Cookie = HeadersList.get("cookie") ?? "";

  const UserRes = await fetch(`${BaseUrl}/api/auth/discord/user`, {
    headers: {
      cookie: Cookie,
    },
    cache: "no-store",
  });

  if (!UserRes.ok) return null;

  const UserData = await UserRes.json();
  return UserData;
}
