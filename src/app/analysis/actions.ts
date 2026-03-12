'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * SIMULOVANÁ DATABÁZE BANKOVNÍHO TRHU
 */
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

/**
 * POMOCNÁ FUNKCE: Generování bezpečného HTML pro Gmail a aplikaci
 * Používá inline styly, aby se tabulka v Gmailu nerozbila.
 */
function generateReportHTML(data: any) {
  const rows = data.top_nabidky.map((n: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: sans-serif;"><b>${n.banka}</b></td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: sans-serif;">${n.sazba}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: sans-serif;">${Number(n.usp).toLocaleString()} Kč</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: sans-serif; font-size: 12px; color: #666;">${n.vyhoda}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
      <h2 style="color: #1d4ed8; margin-top: 0;">Výsledky screeningu trhu</h2>
      <p style="font-size: 14px; color: #64748b;">Na základě vaší smlouvy jsme identifikovali tyto možnosti úspory:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="text-align: left; background-color: #f8fafc;">
            <th style="padding: 12px; border-bottom: 2px solid #1d4ed8; font-size: 13px;">Banka</th>
            <th style="padding: 12px; border-bottom: 2px solid #1d4ed8; font-size: 13px;">Sazba</th>
            <th style="padding: 12px; border-bottom: 2px solid #1d4ed8; font-size: 13px;">Úspora</th>
            <th style="padding: 12px; border-bottom: 2px solid #1d4ed8; font-size: 13px;">Výhoda</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="background-color: #eff6ff; padding: 16px; border-radius: 12px; border: 1px dashed #bfdbfe;">
        <p style="margin: 0; font-size: 15px; font-weight: bold; color: #1e40af;">
          Potenciální měsíční úspora: ${Number(data.uspora).toLocaleString()} Kč
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #60a5fa;">
          Konec fixace: ${data.fixace}
        </p>
      </div>
    </div>
  `;
}

/**
 * Odeslání dat do Make.com
 */
async function triggerMakeAutomation(payload: any) {
  const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;
  try {
    if (!MAKE_WEBHOOK_URL) return;

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Make.com selhal: ${response.status}`);
  } catch (error) {
    console.error("❌ Chyba při volání Make.com:", error);
  }
}

/**
 * Hlavní funkce pro analýzu smlouvy
 */
export async function analyzeContract(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const rawTextFromArea = formData.get("text") as string;
    
    // Používáme gemini-2.5-flash
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { 
            temperature: 0,
            topP: 0.1 
        } 
    });

    const prompt = `
      Jsi špičkový bankovní analytik. Tvým úkolem je srovnat stávající smlouvu klienta s naším INTERNÍM SYSTÉMEM.

      ### INTERNÍ DATA TRHU:
      ${JSON.stringify(BANK_MARKET_DATA, null, 2)}

      ### TVÉ ÚKOLY:
      1. Extrahuj: Úrok, Jistinu (default 3500000), Fixaci a Pojištění.
      2. Vyber 3 NEJLEVNĚJŠÍ banky z dodaných INTERNÍCH DAT.
      3. Vypočítej měsíční úsporu: ((StarýÚrok - NovýÚrok)/100 * Jistina) / 12.
      
      ### STRUKTURA VÝSTUPU (JSON):
      Vrať POUZE čistý JSON.
      
      {
        "fixace": "datum konce",
        "uspora": cislo_nejvyssi_uspory,
        "aktualni_trzni_sazba": "hodnota nejlepší sazby",
        "pojisteni": "ano/ne",
        "analyticky_duvod": "Stručné shrnutí pro Vapi asistenta. Zmiň top 3 banky a úsporu.",
        "top_nabidky": [
          { "banka": "Název", "sazba": "X.XX%", "usp": cislo, "vyhoda": "Text" },
          { "banka": "Název", "sazba": "X.XX%", "usp": cislo, "vyhoda": "Text" },
          { "banka": "Název", "sazba": "X.XX%", "usp": cislo, "vyhoda": "Text" }
        ]
      }
    `;

    let result;
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      result = await model.generateContent([
        { inlineData: { data: Buffer.from(bytes).toString("base64"), mimeType: "application/pdf" } },
        { text: prompt }
      ]);
    } else {
      result = await model.generateContent(`${prompt}\n\nSMLOUVA K ANALÝZE:\n${rawTextFromArea}`);
    }

    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    const analysisResult = JSON.parse(jsonText);

    // VYGENEROVÁNÍ HTML REPORTU
    const htmlReport = generateReportHTML(analysisResult);

    // FINÁLNÍ OBJEKT PRO MAKE A HISTORII
    const finalData = {
      ...analysisResult,
      textovy_obsah: htmlReport,
      timestamp: new Date().toISOString(),
      clientPhone: process.env.MAKE_DEFAULT_PHONE || ""
    };

    // Odeslání do Make.com
    await triggerMakeAutomation(finalData);

    return finalData;
  } catch (error: any) {
    console.error("🔥 KRITICKÁ CHYBA:", error);
    return { error: `Analýza selhala: ${error.message}` };
  }
}