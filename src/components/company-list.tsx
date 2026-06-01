"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { companies, CATEGORIES, type Company } from "@/data/companies";

// --- Typing Header ---

function TypingHeader({ edition }: { edition: string }) {
  const titleLine = `# The List — ${edition} Edition`;
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) {
      setDisplayedTitle(titleLine);
      setTypingDone(true);
      setCursorVisible(false);
      return;
    }
    hasAnimated.current = true;

    let i = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeNext() {
      if (i >= titleLine.length) {
        setTypingDone(true);
        setTimeout(() => setCursorVisible(false), 2000);
        return;
      }

      i++;
      setDisplayedTitle(titleLine.slice(0, i));

      const char = titleLine[i - 1];
      let delay: number;

      if (char === " ") {
        delay = 70 + Math.random() * 40;
      } else if (char === "—" || char === "." || char === ",") {
        delay = 120 + Math.random() * 60;
      } else {
        // Variable base typing speed for natural rhythm
        delay = 30 + Math.random() * 35;
      }

      timeoutId = setTimeout(typeNext, delay);
    }

    typeNext();

    return () => clearTimeout(timeoutId);
  }, [titleLine]);

  return (
    <header className="mb-10 text-sm text-zinc-500 space-y-1 leading-relaxed">
      <p className="typing-header-line">
        {displayedTitle}
        {cursorVisible && (
          <span className="terminal-block-cursor" />
        )}
      </p>
      <p>#</p>
      <p># A bunch of friends ask me what companies they should look at</p>
      <p># working at. Everyone has different criteria, but I thought it</p>
      <p># would be cool to curate a list. Inspired majorly by Ben Lang.</p>
      <p># Here are {companies.length} companies, big and small.</p>
      <p>#</p>
      <p># Curated by Logan Horowitz.</p>
    </header>
  );
}

// --- Category Tabs ---

function CategoryTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (cat: string) => void;
}) {
  // Compute counts per category
  const counts = useMemo(() => {
    const map: Record<string, number> = { All: companies.length };
    for (const c of companies) {
      map[c.category] = (map[c.category] || 0) + 1;
    }
    return map;
  }, []);

  return (
    <div className="mb-4 overflow-x-auto scrollbar-hide">
      <div className="flex gap-x-1 text-sm text-zinc-500 whitespace-nowrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`transition-all duration-200 cursor-pointer px-2 py-0.5 rounded-sm ${
              active === cat
                ? "text-zinc-900 bg-zinc-100 font-semibold"
                : "hover:text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {cat}
            <span
              className={`ml-1 text-[10px] tabular-nums ${
                active === cat ? "text-zinc-500" : "text-zinc-300"
              }`}
            >
              {counts[cat] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Search Input ---

function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) return <>{text}</>;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <mark className="bg-yellow-100 text-zinc-900 rounded-sm px-px">{match}</mark>
      {after}
    </>
  );
}

function SearchInput({
  value,
  onChange,
  resultCount,
  totalCount,
}: {
  value: string;
  onChange: (val: string) => void;
  resultCount: number;
  totalCount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="mb-6 text-sm">
      <div className="flex items-center gap-2 text-zinc-500">
        <span className="text-zinc-400 select-none shrink-0">&gt;</span>
        <span className="text-zinc-400 select-none shrink-0">search:</span>
        <div className="flex-1 min-w-0 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="type to filter... (⌘K)"
            className="w-full bg-transparent border-b border-zinc-200 text-zinc-800 placeholder:text-zinc-300 outline-none py-1 font-mono text-sm pr-6"
          />
          {value && (
            <button
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer text-xs w-5 h-5 flex items-center justify-center"
              aria-label="Clear search"
            >
              x
            </button>
          )}
        </div>
      </div>
      {(value || resultCount !== totalCount) && (
        <p className="text-xs text-zinc-400 mt-1 ml-[calc(1ch+0.5rem)]">
          showing {resultCount} of {totalCount}
        </p>
      )}
    </div>
  );
}

// --- Share Button (copy link) ---

function ShareButton({ companyId }: { companyId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const url = `${window.location.origin}${window.location.pathname}?company=${companyId}`;
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    },
    [companyId]
  );

  return (
    <button
      onClick={handleCopy}
      className="text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer ml-1 relative"
      title="Copy share link"
      aria-label={`Copy link to ${companyId}`}
    >
      <span className="text-xs">#</span>
      {copied && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 whitespace-nowrap rounded-sm">
          Copied!
        </span>
      )}
    </button>
  );
}

// --- Company Row ---

function CompanyRow({
  company,
  isExpanded,
  isFocused,
  onToggle,
  rowRef,
  searchQuery,
}: {
  company: Company;
  isExpanded: boolean;
  isFocused: boolean;
  onToggle: () => void;
  rowRef?: React.Ref<HTMLLIElement>;
  searchQuery: string;
}) {
  const isLink = company.website !== "#";

  return (
    <li
      ref={rowRef}
      className={`group list-item-transition ${isFocused ? "focused-row" : ""}`}
    >
      <div
        className={`grid grid-cols-[2rem_1fr] sm:grid-cols-[2.5rem_1fr] gap-x-2 sm:gap-x-3 cursor-pointer -mx-2 px-2 rounded-sm transition-colors ${
          isFocused ? "bg-zinc-50" : "hover:bg-zinc-50"
        }`}
        onClick={onToggle}
      >
        <span className="text-zinc-400 tabular-nums select-none">
          {String(company.rank).padStart(2, "0")}
        </span>
        <span className="flex items-baseline gap-0 min-w-0">
          <span className="font-semibold text-zinc-900 shrink-0">
            <HighlightedText text={company.name} query={searchQuery} />
          </span>
          <ShareButton companyId={company.id} />
          <span className="text-zinc-500 truncate">
            {" — "}
            {company.description}
          </span>
        </span>
      </div>

      {/* Expandable detail */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-[2rem] sm:ml-[2.5rem] pl-4 border-l-2 border-zinc-200 mt-2 mb-3 space-y-3 text-sm expanded-detail">
          {/* Category badge */}
          <div>
            <span className="inline-block text-[10px] uppercase tracking-wider text-zinc-400 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-sm font-medium">
              {company.category}
            </span>
          </div>

          {/* Why text — formatted as mini-essay */}
          <div className="text-zinc-600 leading-relaxed">
            <span className="text-zinc-300 select-none mr-2 text-xs">&gt;</span>
            <span className="italic">{company.why}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {company.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-zinc-500 border border-zinc-200 px-1.5 py-0.5 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Website link */}
          {isLink && (
            <div>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 hover:text-zinc-900 text-xs transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {company.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

// --- Main Component ---

export function CompanyList({ edition }: { edition: string }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const listRef = useRef<HTMLOListElement>(null);

  // Handle ?company=X on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const companyId = params.get("company");
    if (companyId) {
      const found = companies.find((c) => c.id === companyId);
      if (found) {
        setExpandedId(companyId);
        // Scroll after a short delay to let the DOM render
        setTimeout(() => {
          const el = rowRefs.current[companyId];
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
      }
    }
  }, []);

  // Filter companies
  const filtered = useMemo(() => {
    return companies.filter((company) => {
      if (activeCategory !== "All" && company.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          company.name.toLowerCase().includes(q) ||
          company.description.toLowerCase().includes(q) ||
          company.category.toLowerCase().includes(q) ||
          company.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  // Reset focused index when filter changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [activeCategory, searchQuery]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture when typing in search
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT") {
        // Allow Escape to blur input
        if (e.key === "Escape") {
          target.blur();
          setFocusedIndex(0);
        }
        return;
      }

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev < filtered.length - 1 ? prev + 1 : prev;
          const company = filtered[next];
          if (company) {
            const el = rowRefs.current[company.id];
            el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
          return next;
        });
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : 0;
          const company = filtered[next];
          if (company) {
            const el = rowRefs.current[company.id];
            el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
          return next;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filtered.length) {
          const company = filtered[focusedIndex];
          handleToggle(company.id);
        }
      } else if (e.key === "Escape") {
        if (expandedId) {
          setExpandedId(null);
        } else {
          setFocusedIndex(-1);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filtered, focusedIndex, expandedId]);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <TypingHeader edition={edition} />

      <CategoryTabs
        active={activeCategory}
        onChange={(cat) => {
          setActiveCategory(cat);
          setExpandedId(null);
        }}
      />

      <SearchInput
        value={searchQuery}
        onChange={(val) => {
          setSearchQuery(val);
          setExpandedId(null);
        }}
        resultCount={filtered.length}
        totalCount={companies.length}
      />

      <ol
        ref={listRef}
        className="font-mono text-sm text-zinc-800 leading-[1.9] list-fade-container"
      >
        {filtered.map((company, idx) => (
          <CompanyRow
            key={company.id}
            company={company}
            isExpanded={expandedId === company.id}
            isFocused={focusedIndex === idx}
            onToggle={() => {
              setFocusedIndex(idx);
              handleToggle(company.id);
            }}
            rowRef={(el) => {
              rowRefs.current[company.id] = el;
            }}
            searchQuery={searchQuery}
          />
        ))}
      </ol>

      {filtered.length === 0 && (
        <p className="text-sm text-zinc-400 font-mono py-8">
          # no results found
        </p>
      )}

      <footer className="mt-12 text-xs text-zinc-400 font-mono space-y-0.5">
        <p># ---</p>
        <p>
          # Built by Logan
          <span className="text-zinc-300 mx-1">|</span>
          <span className="text-zinc-300">last updated May 2026</span>
        </p>
        <p>
          # EOF
          <span className="footer-cursor" />
        </p>
      </footer>
    </>
  );
}
