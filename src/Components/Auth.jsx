import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Auth() {
  const headersList = headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  const cookie = headersList.get("cookie") ?? "";

  try {
    const userRes = await fetch(`${baseUrl}/api/auth/discord/user`, {
      headers: {
        cookie,
      },
      cache: "no-store",
    });

    if (!userRes.ok) {
      console.error("API Error:", userRes.status, userRes.statusText);
      redirect("/api/auth/discord");
    }

    const userData = await userRes.json();
    console.log("User Data:", userData);

    return userData;
  } catch (error) {
    console.error("Fetch Error:", error);
    redirect("/api/auth/discord");
  }
}
