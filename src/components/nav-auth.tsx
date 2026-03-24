"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export function NavAuth() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <SignInButton mode="modal">
      <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
        Sign in
      </button>
    </SignInButton>
  );
}
