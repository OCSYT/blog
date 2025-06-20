import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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

  if (!UserRes.ok) {
    return NextResponse.redirect(`${BaseUrl}/api/auth/discord`);
  }

  const UserData = await UserRes.json();
  return NextResponse.json(UserData);
}