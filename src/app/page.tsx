import React from "react";

type NavItem = {
  label: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard" },
  { label: "Skenovat smlouvu" },
  { label: "Historie" },
];

function Sidebar() {
  return (
    <aside className="flex h-screen w-20 flex-col items-center border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-6 text-slate-200">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800/80 text-xs font-semibold tracking-tight">
        FS
      </div>
      <nav className="flex flex-1 flex-col items-center gap-4">
        {navItems.map((item, index) => (
          <button
            key={item.label}
            className="group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/40 text-slate-400 ring-1 ring-transparent transition hover:bg-slate-800/70 hover:text-slate-50 hover:ring-slate-600/80"
          >
            <span className="sr-only">{item.label}</span>
            <span className="text-xs font-medium">{index + 1}</span>
            <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-slate-100 opacity-0 shadow-lg ring-1 ring-slate-700/80 transition group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/60 text-[10px] font-medium text-slate-300 ring-1 ring-slate-700/70">
        JD
      </div>
    </aside>
  );
}

function UploadSection() {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm shadow-slate-200">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Vstupní dokumenty
      </h2>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <label
          htmlFor="pdf-upload"
          className="group flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center transition hover:border-slate-400 hover:bg-slate-100/90"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-50 shadow-sm shadow-slate-400/40">
            <span className="text-base font-semibold">PDF</span>
          </div>
          <p className="mb-1 text-sm font-medium text-slate-900">
            Přetáhni sem PDF smlouvy
          </p>
          <p className="mb-3 text-xs text-slate-500">
            nebo klikni pro výběr souboru z počítače
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Bezpečně uloženo a analyzováno lokálně
          </div>
          <input id="pdf-upload" type="file" accept="application/pdf" className="hidden" />
        </label>

        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Nebo vlož text smlouvy
          </p>
          <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <textarea
              placeholder="Vlož sem text smlouvy (Ctrl+V)…"
              className="min-h-[140px] w-full flex-1 resize-none border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            />
            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
              <span>Podporujeme češtinu i angličtinu.</span>
              <button className="rounded-full bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-50 shadow-sm shadow-slate-400/40 transition hover:bg-slate-800">
                Analyzovat smlouvu
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type RecommendationCardProps = {
  title: string;
  highlight: string;
  description: string;
  badge?: string;
};

function RecommendationCard({
  title,
  highlight,
  description,
  badge,
}: RecommendationCardProps) {
  return (
    <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm shadow-slate-200 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/80">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {title}
          </h3>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {highlight}
          </p>
        </div>
        {badge && (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-200">
            {badge}
          </span>
        )}
      </div>
      <p className="mb-4 text-xs leading-relaxed text-slate-500">
        {description}
      </p>
      <button className="inline-flex items-center gap-1 text-xs font-medium text-slate-900">
        Zobrazit detail
        <span className="text-[10px]">→</span>
      </button>
      <div className="pointer-events-none absolute inset-x-6 bottom-[-40px] h-16 rounded-full bg-gradient-to-r from-emerald-100/60 via-cyan-100/40 to-sky-100/60 blur-3xl" />
    </article>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />
      <main className="flex-1 bg-slate-50/80">
        <div className="mx-auto flex h-full max-w-6xl flex-col px-6 py-6 md:px-10 md:py-8">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Finanční přehled
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                FinSense AI
              </h1>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Živý náhled – žádná data se neposílají mimo tvůj počítač
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 pb-4">
            <UploadSection />

            <section className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Doporučení od AI
                </h2>
                <span className="text-xs text-slate-500">
                  Na základě posledně nahrané smlouvy
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <RecommendationCard
                  title="Končící fixace"
                  highlight="Za 3 měsíce"
                  description="Doporučujeme začít řešit refinancování alespoň 2–3 měsíce před koncem fixace, abys stihl porovnat nabídky."
                  badge="Priorita"
                />
                <RecommendationCard
                  title="Výhodnější hypotéka"
                  highlight="Potenciální úspora ~1 850 Kč / měs."
                  description="Na základě aktuálních sazeb by přechod k jiné bance mohl snížit měsíční splátku, aniž by se prodlužovala celková doba splácení."
                  badge="Tip trhu"
                />
                <RecommendationCard
                  title="Revize pojištění"
                  highlight="Pokrývá jen 60 % hodnoty"
                  description="Pojištění nemovitosti je nastavené na nižší částku, než je její aktuální tržní hodnota. Zvaž navýšení limitů krytí."
                  badge="Bezpečnost"
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}