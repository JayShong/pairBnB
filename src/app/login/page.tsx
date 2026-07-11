import Link from "next/link";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="narrow">
      <h1>Sign in</h1>
      {error && <p className="error">{error}</p>}
      <form action={loginAction} className="stack">
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Password
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        <button type="submit" className="button">
          Sign in
        </button>
      </form>
      <p className="muted">
        New to the community? <Link href="/register">Join the guild</Link>.
      </p>
    </div>
  );
}
