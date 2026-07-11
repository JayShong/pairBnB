import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logoutAction } from "@/app/login/actions";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — ${SITE_TAGLINE.toLowerCase()}`,
  description:
    "Browse Maelstrom LARP events on the Shards, create rulebook-legal characters, and book your spot in character.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — ${SITE_TAGLINE.toLowerCase()}`,
    description:
      "Browse Maelstrom LARP events on the Shards, create rulebook-legal characters, and book your spot in character.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">
            ⚔ Guildhall
          </Link>
          <nav>
            <Link href="/events">Events</Link>
            <Link href="/characters">Characters</Link>
            <Link href="/rules">Rules</Link>
            <Link href="/lore">Lore</Link>
            {user ? (
              <>
                <Link href="/profile">{user.name}</Link>
                <form action={logoutAction} className="inline-form">
                  <button type="submit" className="link-button">
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">Sign in</Link>
                <Link href="/register" className="cta">
                  Join the guild
                </Link>
              </>
            )}
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>Guildhall — home of the Maelstrom LARP community. See you on the Shards.</p>
        </footer>
      </body>
    </html>
  );
}
