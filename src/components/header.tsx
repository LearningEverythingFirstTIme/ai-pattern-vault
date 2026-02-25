"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="h-16 border-b border-border bg-bg-primary flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            className="input w-64 pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {status === "loading" ? (
          <div className="w-8 h-8 rounded-full bg-bg-tertiary animate-pulse" />
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="btn btn-ghost text-sm"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="btn btn-primary text-sm"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
