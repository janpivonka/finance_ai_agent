// src/lib/utils.ts
import { AnalysisResult } from "@/types";

/**
 * Formátuje číslo jako měnu v CZK
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Převede číslo na české slovní vyjádření (pro tisíce)
 */
export function numberToCzechWords(num: number): string {
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

/**
 * Generuje HTML report pro e-maily nebo zobrazení
 */
export function generateReportHTML(
  data: Pick<AnalysisResult, "top_nabidky" | "analyticky_duvod" | "uspora">,
): string {
  const rows = data.top_nabidky.map((n) => `
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
      <p style="font-size: 16px; color: #4a5568; line-height: 1.6;">${data.analyticky_duvod}</p>
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
