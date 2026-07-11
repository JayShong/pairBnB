import Link from "next/link";
import { registerAction } from "@/app/login/actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="narrow">
      <h1>Join the guild</h1>
      {error && <p className="error">{error}</p>}
      <form action={registerAction} className="stack">
        <label>
          Name
          <input type="text" name="name" required autoComplete="name" />
        </label>
        <label>
          Email
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          Password (8+ characters)
          <input type="password" name="password" required minLength={8} autoComplete="new-password" />
        </label>
        <fieldset>
          <legend>How will you join us?</legend>
          <label className="radio">
            <input type="radio" name="role" value="player" defaultChecked /> As a player — I want to
            attend events
          </label>
          <label className="radio">
            <input type="radio" name="role" value="gm" /> As a game master — I want to run events
          </label>
        </fieldset>
        <button type="submit" className="button">
          Create my account
        </button>
      </form>
      <p className="muted">
        Already a member? <Link href="/login">Sign in</Link>.
      </p>
    </div>
  );
}
