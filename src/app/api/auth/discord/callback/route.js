import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(Request) {
  const Url = new URL(Request.url);
  const Code = Url.searchParams.get('code');

  if (!Code) {
    return NextResponse.redirect(new URL('/?Error=MissingCode', Request.url));
  }

  const ClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const ClientSecret = process.env.DISCORD_CLIENT_SECRET; // Non-public for security
  const RedirectUri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL;

  if (!ClientId || !ClientSecret || !RedirectUri) {
    return NextResponse.json(
      { Error: 'ServerConfigurationError', Details: 'Missing Discord environment variables' },
      { status: 500 }
    );
  }

  const Params = new URLSearchParams({
    client_id: ClientId,
    client_secret: ClientSecret,
    grant_type: 'authorization_code',
    code: Code,
    redirect_uri: RedirectUri,
    scope: 'identify email',
  });

  try {
    const TokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: Params.toString(),
    });

    if (!TokenResponse.ok) {
      const ErrorData = await TokenResponse.json();
      return NextResponse.json(
        { Error: 'TokenExchangeFailed', Details: ErrorData },
        { status: 500 }
      );
    }

    const TokenData = await TokenResponse.json();

    // Fetch user information
    const UserResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${TokenData.access_token}` },
    });

    if (!UserResponse.ok) {
      const ErrorData = await UserResponse.json();
      return NextResponse.json(
        { Error: 'UserFetchFailed', Details: ErrorData },
        { status: 500 }
      );
    }

    const UserData = await UserResponse.json();


    const CookieStore = await cookies();
    CookieStore.set({
      name: 'DiscordAuth',
      value: JSON.stringify({
        AccessToken: TokenData.access_token,
        RefreshToken: TokenData.refresh_token,
        ExpiresAt: Date.now() + TokenData.expires_in * 1000,
        User: {
          ID: UserData.id,
          Username: UserData.username,
          Email: UserData.email,
        },
      }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: TokenData.expires_in,
    });

    // Redirect to homepage
    return NextResponse.redirect(new URL('/', Request.url));
  } catch (Error) {
    return NextResponse.json(
      { Error: 'ServerError', Details: Error.message },
      { status: 500 }
    );
  }
}
