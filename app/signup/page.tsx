import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AuthForm } from "../_components/AuthForm";

export const metadata = { title: "Create account // Vinylmation Vault" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await currentUser()) redirect("/collection");
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="label">
        Account <span className="text-hairline-bright">//</span> New
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em]">
        Start your vault.
      </h1>
      <p className="mt-3 text-ink-dim">
        Track 3,500 figures across every series, set and chase variant.
      </p>

      <div className="mt-8">
        <AuthForm mode="signup" next={next} />
      </div>

      <p className="label-bright mt-6">
        Already registered?{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
          className="text-accent hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
