import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logoutAction } from "@/app/login/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guildhall — the gathering place for your LARP community",
  description:
    "Browse live action role-play events, book your spot in character, and keep your character roster in one place.",
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
          <p>Guildhall — built by LARPers, for LARPers. See you in character.</p>
        </footer>
      </body>
    </html>
  );
}
