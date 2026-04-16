import { CompanyGrid } from "@/components/company-grid";
import { NavAuth } from "@/components/nav-auth";
import { companies } from "@/data/companies";

export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <nav className="border-b border-zinc-200 bg-[#fafaf9]">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-6 py-3 font-mono text-xs text-zinc-500">
          <span>~/the-list.txt</span>
          <div className="flex items-center gap-4">
            <a
              href="mailto:LoganHorowitz2@gmail.com"
              className="hover:text-zinc-900"
            >
              nominate
            </a>
            <NavAuth />
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-6 py-12 font-mono">
        <header className="mb-10 text-sm text-zinc-500 space-y-1 leading-relaxed">
          <p># The List</p>
          <p># {today}</p>
          <p>#</p>
          <p># A bunch of friends ask me what companies they should look at</p>
          <p># working at. Everyone has different criteria, but I thought it</p>
          <p># would be cool to curate a list. Inspired majorly by Ben Lang.</p>
          <p># Here are {companies.length} companies, big and small.</p>
          <p>#</p>
          <p># Curated by Logan Horowitz.</p>
        </header>

        <CompanyGrid />

        <footer className="mt-12 text-xs text-zinc-400">
          <p>-- EOF --</p>
        </footer>
      </main>
    </div>
  );
}
