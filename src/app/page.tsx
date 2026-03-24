import { CompanyGrid } from "@/components/company-grid";
import { companies } from "@/data/companies";

export default function Home() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-zinc-200 sticky top-0 z-10 bg-white">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-400">
            The List
          </span>
          <a
            href="mailto:LoganHorowitz2@gmail.com"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Nominate a company →
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <header className="mb-12 border-b-4 border-zinc-900 pb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 mb-3">
            {today}
          </p>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 leading-tight mb-4">
            The List
          </h1>
          <p className="text-xl text-zinc-500 leading-relaxed max-w-xl">
            {companies.length} companies building the future. Curated,
            opinionated, and worth your attention.
          </p>
        </header>

        <CompanyGrid />
      </main>

      <footer className="border-t border-zinc-100 mt-16 py-8">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-zinc-400">
          Curated by Logan Horowitz &mdash; want to nominate a company?{" "}
          <a
            href="mailto:LoganHorowitz2@gmail.com"
            className="underline underline-offset-2 hover:text-zinc-600"
          >
            Email me
          </a>
        </div>
      </footer>
    </div>
  );
}
