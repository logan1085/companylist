"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { companies, CATEGORIES } from "@/data/companies";
import { Badge } from "@/components/ui/badge";
import { VoteButtons } from "@/components/vote-buttons";
import { ExternalLink, Search } from "lucide-react";

type VoteCount = { company_id: string; score: number };

export function CompanyGrid() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/votes")
      .then((r) => r.json())
      .then(({ counts, userVotes: uv }) => {
        const map: Record<string, number> = {};
        (counts as VoteCount[]).forEach((c) => {
          map[c.company_id] = c.score;
        });
        setVoteCounts(map);
        setUserVotes(uv ?? {});
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesCategory =
        activeCategory === "All" || c.category === activeCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="space-y-8">
      {/* Search + Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center border-b border-zinc-200 pb-6">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white border-zinc-200 h-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 text-sm">
          No companies match your search.
        </div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {filtered.map((company) => (
            <div
              key={company.id}
              className="group grid grid-cols-[2rem_3rem_1fr] gap-4 py-6 sm:grid-cols-[2.5rem_4rem_1fr]"
            >
              {/* Vote */}
              <div className="flex items-start justify-center pt-1">
                <VoteButtons
                  companyId={company.id}
                  initialScore={voteCounts[company.id] ?? 0}
                  initialUserVote={userVotes[company.id] ?? 0}
                />
              </div>

              {/* Rank */}
              <div className="pt-0.5">
                <span className="font-serif text-3xl font-bold text-zinc-200 leading-none sm:text-4xl">
                  {String(company.rank).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-tight tracking-tight">
                      {company.name}
                    </h3>
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                      {company.category}
                    </span>
                  </div>
                  {company.website !== "#" && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 shrink-0 text-zinc-300 transition-colors hover:text-zinc-700"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <p className="text-sm text-zinc-600 leading-relaxed max-w-xl">
                  {company.description}
                </p>

                <p className="text-sm text-zinc-500 leading-relaxed max-w-xl italic border-l-2 border-zinc-200 pl-3">
                  {company.why}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {company.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] font-normal bg-zinc-100 text-zinc-500 hover:bg-zinc-200 uppercase tracking-wide"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
