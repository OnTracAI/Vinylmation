import { signOut } from "../_actions/auth";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button type="submit" className="btn">
        Sign out
      </button>
    </form>
  );
}
