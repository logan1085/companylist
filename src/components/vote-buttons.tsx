"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Props = {
  companyId: string;
  initialScore: number;
  initialUserVote: number; // 1, -1, or 0
};

export function VoteButtons({ companyId, initialScore, initialUserVote }: Props) {
  const { isSignedIn } = useUser();
  const [score, setScore] = useState(initialScore);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);

  async function vote(value: 1 | -1) {
    if (loading) return;
    setLoading(true);

    // Optimistic update
    const prev = userVote;
    const prevScore = score;
    const newVote = userVote === value ? 0 : value;
    const delta = newVote - prev;
    setUserVote(newVote);
    setScore(prevScore + delta);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, value }),
      });
      if (!res.ok) throw new Error();
    } catch {
      // Revert on failure
      setUserVote(prev);
      setScore(prevScore);
    } finally {
      setLoading(false);
    }
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="flex flex-col items-center gap-0.5 text-zinc-300 hover:text-zinc-500 transition-colors">
          <ChevronUp size={18} />
          <span className="text-xs font-medium tabular-nums text-zinc-400">{score}</span>
          <ChevronDown size={18} />
        </button>
      </SignInButton>
    );
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={() => vote(1)}
        disabled={loading}
        className={`transition-colors ${
          userVote === 1
            ? "text-emerald-500"
            : "text-zinc-300 hover:text-emerald-400"
        }`}
      >
        <ChevronUp size={18} />
      </button>
      <span
        className={`text-xs font-medium tabular-nums ${
          score > 0 ? "text-emerald-500" : score < 0 ? "text-red-400" : "text-zinc-400"
        }`}
      >
        {score}
      </span>
      <button
        onClick={() => vote(-1)}
        disabled={loading}
        className={`transition-colors ${
          userVote === -1
            ? "text-red-400"
            : "text-zinc-300 hover:text-red-400"
        }`}
      >
        <ChevronDown size={18} />
      </button>
    </div>
  );
}
