'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { numberToCzechWords, generateReportHTML } from "@/lib/utils";
import { AnalysisResult, ServerActionResponse } from "@/types";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const BANK_MARKET_DATA = [
  { bank: "Moneta Money Bank", rate: 4.29, benefit: "Nejrychlejší schválení online" },
  { bank: "Banka Creditas", rate: 4.35, benefit: "Nulové poplatky za odhad" },
  { bank: "Air Bank", rate: 4.39, benefit: "Flexibilní splátky zdarma" },
  { bank: "Česká spořitelna", rate: 4.89, benefit: "Široká pobočková síť" },
  { bank: "Komerční banka", rate: 4.99, benefit: "Kombinace s pojištěním" },
  { bank: "ČSOB", rate: 4.95, benefit: "Bonus za energetický štítek A/B" },
  { bank: "Raiffeisenbank", rate: 5.09, benefit: "Prémiový servis" },
  { bank: "UniCredit Bank", rate: 4.69, benefit: "Stabilní sazba na 5 let" },
  { bank: "mBank", rate: 4.75, benefit: "Bez nutnosti běžného účtu" },
  { bank: "Fio banka", rate: 4.59, benefit: "Transparentní podmínky" }
];

async function triggerMakeAutomation(payload: any) {
  const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;
  if (!MAKE_WEBHOOK_URL) return;
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Make.com failed: ${response.status}`);
  } catch (error) {
    console.error("❌ Make.com error:", error);
  }
}

export async function analyzeContract(formData: FormData): Promise<ServerActionResponse<AnalysisResult>> {
  try {
    const file = formData.get("file") as File;
    const rawTextFromArea = formData.get("text") as string;
    
    // --- KONTROLA PŘIPOJENÍ NÁSTROJE ---
    if (!GEMINI_API_KEY) {
      return { error: "Není připojen analytický nástroj (chybí API klíč)." };
    }

    // --- KROK 1: PŘESNÝ VÝPOČET (Temperature 0) ---
    const mathModel = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite-preview", 
        generationConfig: { 
          temperature: 0, 
          topP: 0.1,
          responseMimeType: "application/json"
        } 
    });

    const mathPrompt = `
      Jsi elitní bankovní auditor. Analyzuj smlouvu a trh:
      ${JSON.stringify(BANK_MARKET_DATA, null, 2)}

      ### TVÉ CÍLE (STRIKTNÍ LOGIKA):
      1. Extrahuj: úrok (%), jistinu, datum fixace a stav pojištění.
      2. AKTUÁLNÍ SPLÁTKA: (jistina * úrok / 100) / 12.
      3. VÝPOČET ÚSPORY: ((Současný úrok - Nový úrok) / 100 / 12) * Jistina.
      4. Do pole "uspora" dej nejvyšší úsporu z nabídek.

      Vrať striktní JSON:
      {
        "fixace": "datum",
        "aktualni_splatka": cislo,
        "uspora": cislo,
        "aktualni_trzni_sazba": "X.XX%",
        "pojisteni": "ano/ne",
        "top_nabidky": [
          { "banka": "Název", "sazba": "X.XX%", "usp": cislo, "vyhoda": "Text" }
        ]
      }
    `;

    let result;
    try {
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        result = await mathModel.generateContent([
          { inlineData: { data: Buffer.from(bytes).toString("base64"), mimeType: "application/pdf" } },
          { text: mathPrompt }
        ]);
      } else {
        result = await mathModel.generateContent(`${mathPrompt}\n\nTEXT SMLOUVY K ANALÝZE:\n${rawTextFromArea}`);
      }
    } catch (genError: any) {
      console.error("❌ Gemini API Error:", genError);
      return { error: "Analytický nástroj neodpověděl včas nebo je přetížen. Zkuste to prosím znovu za chvíli." };
    }

    const responseText = result.response.text().trim();
    if (!responseText) {
      return { error: "Analytický nástroj vrátil prázdnou odpověď. Zkuste prosím vložit text znovu." };
    }

    const mathData = JSON.parse(responseText);

    // --- VALIDACE VÝSLEDKŮ ---
    // Kontrolujeme, zda AI našla alespoň základní parametry (úspora nebo splátka nesmí být 0 nebo neplatná)
    const isValid = 
      mathData && 
      (Number(mathData.uspora) > 0 || Number(mathData.aktualni_splatka) > 0) &&
      mathData.fixace && 
      mathData.fixace !== "N/A" && 
      mathData.fixace !== "neznámé";

    if (!isValid) {
      return { error: "V zadaném textu nebyly nalezeny platné parametry smlouvy (úrok, jistina nebo fixace). Zkuste prosím vložit jiný text nebo čitelnější dokument." };
    }

    // --- KROK 2: KREATIVNÍ DOPORUČENÍ (Temperature 1) ---
    const creativeModel = genAI.getGenerativeModel({ 
        model: "gemini-3.1-flash-lite-preview",
        generationConfig: { temperature: 1 } 
    });

    const creativePrompt = `
      Jsi inspirativní finanční kouč. Na základě těchto dat vytvoř lidské doporučení:
      - Měsíční úspora: ${mathData.uspora} Kč
      - Úspora za 5 let: ${mathData.uspora * 60} Kč

      ### TVŮJ ÚKOL:
      Napiš jednu až dvě věty, které uživateli ukážou hodnotu jeho peněz.
      - PŘÍSNÝ ZÁKAZ slov: "klient", "přeplácí", "vzhledem k", "úroková sazba", "tržní nabídka", "smlouva".
      - FORMÁT VĚTY: "Představte si, že za ušetřených [ČÁSTKA] měsíčně byste mohli mít [KREATIVNÍ PŘÍKLAD], místo abyste tyto peníze zbytečně nechávali bance."
      - BUĎ KREATIVNÍ (čas, rodina, dovolená, majetek).
      - Mluv přímo k uživateli.
    `;

    let analytickyDuvod = "Vaše úspora je připravena k uvolnění.";
    try {
      const creativeResult = await creativeModel.generateContent(creativePrompt);
      analytickyDuvod = creativeResult.response.text().trim();
    } catch (e) {
      console.warn("⚠️ Creative model failed, using fallback reason.");
    }

    // --- FINÁLNÍ ZPRACOVÁNÍ ---
    const usporaCislo = Math.round(Number(mathData.uspora || 0));
    const splatkaCislo = Math.round(Number(mathData.aktualni_splatka || 0));
    
    const finalData: AnalysisResult = {
      ...mathData,
      id: `anl-${Date.now()}`,
      aktualni_splatka: splatkaCislo,
      uspora: usporaCislo,
      analyticky_duvod: analytickyDuvod,
      kreativni_vypocet: analytickyDuvod, // Pro kompatibilitu s UI
      uspora_slovy: numberToCzechWords(usporaCislo),
      textovy_obsah: generateReportHTML({ ...mathData, uspora: usporaCislo, analyticky_duvod: analytickyDuvod }),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('cs-CZ'),
      clientPhone: process.env.MAKE_DEFAULT_PHONE || ""
    };

    await triggerMakeAutomation(finalData);
    return { data: finalData };

  } catch (error: any) {
    console.error("🔥 ANALÝZA ERROR:", error);
    if (error instanceof SyntaxError) {
      return { error: "Nepodařilo se zpracovat výsledek analýzy. Dokument může být poškozen nebo nečitelný." };
    }
    return { error: `Došlo k neočekávané chybě: ${error.message}` };
  }
}
