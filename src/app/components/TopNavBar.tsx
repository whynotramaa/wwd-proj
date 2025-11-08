"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";

  return (
    <header
      aria-label="Site Header"
      className="flex h-[var(--top-nav-bar-height)] items-center text-gray-50 border-b border-border bg-background px-3 lg:px-12"
    >
      <div className="flex h-10 w-full items-center text-gray-50 justify-between">
        <Link href="/">
          <span className="font-bold tracking-tighter text-xl text-green-300">Project 0</span>

        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {[
            ["/resume-builder", "Builder"],
            ["/resume-parser", "Parser"],
            ["/ats-verifier", "JD Analyzer"],
            ["/history", "History"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground lg:px-4"
              href={href}
            >
              {text}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};
