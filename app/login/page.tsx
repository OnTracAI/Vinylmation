import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { AuthForm } from "../_components/AuthForm";

export const metadata = { title: "Sign in // Vinylmation Vault" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  if (await currentUser()) redirect("/collection");
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <p className="label">
        Account <span className="text-hairline-bright">//</span> Sign in
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em]">
        Welcome back.
      </h1>
      <p className="mt-3 text-ink-dim">
        Your collection, wishlist and set progress are waiting.
      </p>

      <div className="mt-8">
        <AuthForm mode="signin" next={next} />
      </div>

      <p className="label-bright mt-6">
        No account yet?{" "}
        <Link
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
          className="text-accent hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
