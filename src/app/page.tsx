import { CompanyList } from "@/components/company-list";
import { NavAuth } from "@/components/nav-auth";

export default function Home() {
  const edition = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <nav className="border-b border-zinc-200 bg-[#fafaf9]">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-4 sm:px-6 py-3 font-mono text-xs text-zinc-500">
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

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12 font-mono">
        <CompanyList edition={edition} />
      </main>
    </div>
  );
}
