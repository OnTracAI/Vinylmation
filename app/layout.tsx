import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { BackToTop } from "./_components/BackToTop";
import { SearchBar } from "./_components/SearchBar";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vinylmation Vault // Collection Tracker",
  description:
    "Catalog and track your Disney Vinylmation collection — 3,500+ figures across 490 series and sets.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>
        <div className="relative z-10 flex min-h-screen flex-col">
          {/* Focus target for the back-to-top control. */}
          <header
            id="top"
            tabIndex={-1}
            className="sticky top-0 z-50 border-b border-hairline bg-ground/85 backdrop-blur-xl
              outline-none"
          >
            <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6">
              <Link href="/" className="group flex shrink-0 items-baseline gap-2">
                <span
                  className="font-display text-lg leading-none font-extrabold tracking-tight text-ink
                    transition-colors group-hover:text-accent"
                >
                  VINYLMATION
                </span>
                <span className="label hidden sm:inline">vault</span>
              </Link>

              <div className="ml-auto hidden max-w-md flex-1 md:block">
                <SearchBar compact />
              </div>

              <nav className="flex items-center gap-1 sm:gap-2">
                <NavLink href="/series">Browse</NavLink>
                <NavLink href="/search">Search</NavLink>
                {user ? (
                  <>
                    <NavLink href="/collection">Collection</NavLink>
                    <Link
                      href="/collection"
                      className="label-bright hidden max-w-[10ch] truncate border-l border-hairline
                        pl-3 hover:text-accent lg:block"
                    >
                      {user.displayName}
                    </Link>
                  </>
                ) : (
                  <Link href="/login" className="btn btn-accent ml-1">
                    Sign in
                  </Link>
                )}
              </nav>
            </div>

            <div className="border-t border-hairline px-4 py-2 md:hidden">
              <SearchBar compact />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <BackToTop />

          <footer className="mt-20 border-t border-hairline">
            <div
              className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-8 sm:flex-row
                sm:items-center sm:px-6"
            >
              <p className="label">
                Vinylmation Vault <span className="text-hairline-bright">//</span> personal
                collection tracker
              </p>
              <p className="label sm:ml-auto">
                Vinylmation is a trademark of Disney. This is an unaffiliated fan project.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="label-bright px-2 py-1 transition-colors hover:text-accent"
    >
      {children}
    </Link>
  );
}
