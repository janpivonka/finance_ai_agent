"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Vapi from "@vapi-ai/web";

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

export default function AdvisorPage() {
  const searchParams = useSearchParams();
  const usporaParam = searchParams.get("uspora");
  const fixaceParam = searchParams.get("fixace");

  const uspora =
    usporaParam && usporaParam.trim() !== "" ? usporaParam : "0";
  const fixace =
    fixaceParam && fixaceParam.trim() !== "" ? fixaceParam : "neuvedena";

  const [starting, setStarting] = useState(false);
  const vapiRef = useRef<any | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (vapiRef.current) return;

    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    if (!publicKey) {
      console.warn("NEXT_PUBLIC_VAPI_PUBLIC_KEY není nastaven.");
      return;
    }

    vapiRef.current = new Vapi(publicKey);
  }, []);

  const handleStartCall = async () => {
    if (!vapiRef.current) return;

    try {
      setStarting(true);
      await vapiRef.current.start("4c32087f-c5e7-48db-b775-10a47b12e912", {
        variableValues: {
          uspora,
          fixace,
        },
      });
    } catch (error) {
      console.error("Chyba při spouštění hovoru Vapi:", error);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />
      <main className="flex-1 bg-slate-50/80">
        <div className="mx-auto flex h-full max-w-6xl flex-col px-6 py-6 md:px-10 md:py-8">
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Hlasová konzultace
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                FinSense AI – Poradce
              </h1>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-white/80 px-3 py-1.5 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              Připraveno spojit vás s AI bankéřem
            </div>
          </header>

          <div className="flex flex-1 items-center pb-4">
            <section className="w-full rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-sm shadow-slate-200 md:p-10">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Osobní doporučení
              </h2>
              <p className="mb-2 text-xl font-semibold text-slate-900 md:text-2xl">
                Váš osobní AI bankéř je připraven probrat vaši úsporu{" "}
                <span className="whitespace-nowrap text-emerald-600">
                  {uspora} Kč
                </span>
                .
              </p>
              <p className="mb-6 text-sm text-slate-600 md:max-w-xl">
                Na základě analýzy vaší smlouvy dokáže vysvětlit, odkud úspora
                pochází, a jak ji dále optimalizovat. Fixace:{" "}
                <span className="font-medium text-slate-900">{fixace}</span>.
              </p>

              <button
                type="button"
                onClick={handleStartCall}
                disabled={starting || !vapiRef.current}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-10 py-3 text-sm font-semibold text-slate-50 shadow-sm shadow-slate-400/40 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-800/70"
              >
                {starting ? "Spojuji hovor…" : "Zahájit hovor"}
              </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
