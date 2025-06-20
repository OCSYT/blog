'use client';

import { useEffect } from 'react';

export default function DiscordLoginPage() {
  useEffect(() => {
    const ClientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
    const RedirectUrl = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL;

    if (!ClientId || !RedirectUrl) {
      console.error('Missing Discord ClientId or RedirectUrl in environment variables');
      return;
    }

    const EncodedRedirectUrl = encodeURIComponent(RedirectUrl);
    const Scope = 'identify+email';
    const DiscordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${ClientId}&response_type=code&redirect_uri=${EncodedRedirectUrl}&scope=${Scope}`;

    console.log('Redirecting to:', DiscordAuthUrl);
    window.location.replace(DiscordAuthUrl);
  }, []);

  return <p>Redirecting to Discord...</p>;
}