// app/api/auth/discord/user/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const CookieStore = await cookies();
  const DiscordAuth = CookieStore.get("DiscordAuth");

  if (!DiscordAuth) {
    const RequestUrl = new URL(request.url);
    const BaseUrl = `${RequestUrl.protocol}//${RequestUrl.host}`;

    return NextResponse.redirect(new URL("/api/auth/discord", BaseUrl));
  }

  let AuthData;
  try {
    AuthData = JSON.parse(DiscordAuth.value);
  } catch {
    return NextResponse.json({ Error: "InvalidAuthData" }, { status: 400 });
  }

  if (Date.now() > AuthData.ExpiresAt) {
    return NextResponse.json({ Error: "AccessTokenExpired" }, { status: 401 });
  }

  try {
    const UserRes = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${AuthData.AccessToken}`,
      },
    });

    if (!UserRes.ok) {
      return NextResponse.json(
        { Error: "FailedToFetchUserData" },
        { status: 401 }
      );
    }

    const UserData = await UserRes.json();

    return NextResponse.json({
      ID: UserData.id,
      Username: UserData.username,
      Email: UserData.email,
      Discriminator: UserData.discriminator,
      Avatar: UserData.avatar,
    });
  } catch (Err) {
    return NextResponse.json(
      { Error: "ServerError", Details: Err.message },
      { status: 500 }
    );
  }
}
