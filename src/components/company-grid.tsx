import { companies } from "@/data/companies";

export function CompanyGrid() {
  return (
    <ol className="font-mono text-sm text-zinc-800 leading-[1.9]">
      {companies.map((company) => {
        const isLink = company.website !== "#";
        return (
          <li
            key={company.id}
            className="grid grid-cols-[2.5rem_1fr] gap-x-3"
          >
            <span className="text-zinc-400 tabular-nums select-none">
              {String(company.rank).padStart(2, "0")}
            </span>
            <span>
              {isLink ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900"
                >
                  {company.name}
                </a>
              ) : (
                <span className="font-semibold text-zinc-900">
                  {company.name}
                </span>
              )}
              <span className="text-zinc-500">
                {" — "}
                {company.description}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
