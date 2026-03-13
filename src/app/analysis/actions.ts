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
 * DOSLOVNÝ PŘEVOD ČÍSLA NA TEXT (Pro Voice Agenta)
 */
function numberToCzechWords(num: number): string {
  const jednotky = ["", "jedna", "dvě", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět"];
  const desitky = ["", "deset", "dvacet", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát", "devadesát"];
  const nact = ["deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct"];
  const stovky = ["", "sto", "dvě stě", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set"];
  const tisice = ["", "tisíc", "dva tisíce", "tři tisíce", "čtyři tisíce", "pět tisíc", "šest tisíc", "sedm tisíc", "osm tisíc", "devět tisíc"];

  if (num === 0) return "nula";
  let text = "";
  const t = Math.floor(num / 1000);
  if (t > 0 && t < 10) text += tisice[t] + " ";
  const s = Math.floor((num % 1000) / 100);
  if (s > 0) text += stovky[s] + " ";
  const zbytek = num % 100;
  if (zbytek >= 10 && zbytek < 20) {
    text += nact[zbytek - 10] + " ";
  } else {
    const d = Math.floor(zbytek / 10);
    const j = zbytek % 10;
    if (d > 0) text += desitky[d] + " ";
    if (j > 0) text += jednotky[j] + " ";
  }
  return text.trim();
}

function generateReportHTML(data: any) {
  const rows = data.top_nabidky.map((n: any) => `
    <tr>
      <td style="padding: 14px; border-bottom: 1px solid #edf2f7; font-family: sans-serif;"><b>${n.banka}</b></td>
      <td style="padding: 14px; border-bottom: 1px solid #edf2f7; font-family: sans-serif; color: #2b6cb0; font-weight: bold;">${n.sazba}</td>
      <td style="padding: 14px; border-bottom: 1px solid #edf2f7; font-family: sans-serif; font-weight: bold; color: #2f855a;">${Number(n.usp).toLocaleString()} Kč</td>
      <td style="padding: 14px; border-bottom: 1px solid #edf2f7; font-family: sans-serif; font-size: 12px; color: #718096;">${n.vyhoda}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: sans-serif; color: #1a202c; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <h2 style="color: #2b6cb0; margin-top: 0; font-size: 24px;">Výsledek AI analýzy</h2>
      <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">Na základě vaší smlouvy jsme identifikovali měsíční úsporu ve výši <b>${Number(data.uspora).toLocaleString()} Kč</b>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
        <thead>
          <tr style="text-align: left; background-color: #f7fafc;">
            <th style="padding: 12px; border-bottom: 2px solid #2b6cb0; font-size: 13px; text-transform: uppercase;">Banka</th>
            <th style="padding: 12px; border-bottom: 2px solid #2b6cb0; font-size: 13px; text-transform: uppercase;">Sazba</th>
            <th style="padding: 12px; border-bottom: 2px solid #2b6cb0; font-size: 13px; text-transform: uppercase;">Úspora</th>
            <th style="padding: 12px; border-bottom: 2px solid #2b6cb0; font-size: 13px; text-transform: uppercase;">Výhoda</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <div style="background-color: #ebf8ff; padding: 20px; border-radius: 16px; border: 1px solid #bee3f8;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #2c5282;">Celková úspora za 5 let: ${(data.uspora * 60).toLocaleString()} Kč</p>
      </div>
    </div>
  `;
}

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

export async function analyzeContract(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const rawTextFromArea = formData.get("text") as string;
    
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { temperature: 0, topP: 0.1 } 
    });

    const prompt = `
      Jsi elitní bankovní auditor. Analyzuj smlouvu a porovnej ji s těmito daty:
      ${JSON.stringify(BANK_MARKET_DATA, null, 2)}

      ### TVÉ CÍLE:
      1. Extrahuj úrok, jistinu (default 3,5 mil), fixaci a pojištění.
      2. Najdi 3 nejlepší nabídky.
      3. Vypočítej měsíční úsporu.
      4. Vytvoř "analyticky_duvod" - JEDNA úderná, lidská a edukativní věta, která klienta motivuje (např. "Přeplácíte bance o hodnotu nového auta").

      Vrať POUZE JSON:
      {
        "fixace": "datum",
        "uspora": cislo,
        "aktualni_trzni_sazba": "X.XX%",
        "pojisteni": "ano/ne",
        "analyticky_duvod": "Úderná věta pro dashboard.",
        "top_nabidky": [
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
      result = await model.generateContent(`${prompt}\n\nTEXT:\n${rawTextFromArea}`);
    }

    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    const analysisResult = JSON.parse(jsonText);

    // VOICE OPTIMALIZACE
    const usporaCislo = Math.round(Number(analysisResult.uspora));
    const usporaSlovy = numberToCzechWords(usporaCislo);

    const finalData = {
      ...analysisResult,
      uspora: usporaCislo,
      uspora_slovy: usporaSlovy, // Pro Voice Agenta
      textovy_obsah: generateReportHTML(analysisResult),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleString('cs-CZ'),
      clientPhone: process.env.MAKE_DEFAULT_PHONE || ""
    };

    await triggerMakeAutomation(finalData);
    return finalData;

  } catch (error: any) {
    console.error("🔥 ERROR:", error);
    return { error: `Analýza selhala: ${error.message}` };
  }
}