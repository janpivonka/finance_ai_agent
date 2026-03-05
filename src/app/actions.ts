'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeContract(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Jsi expert na české finanční právo a hypotéky. 
      Z následujícího textu smlouvy vytáhni klíčová data.
      Pokud v textu nejsou, odhadni je podle kontextu, ale uveď to.
      
      Vrať POUZE čistý JSON v tomto formátu:
      {
        "fixace": "text o konci fixace",
        "uspora": "odhadovaná měsíční úspora v Kč",
        "pojisteni": "procento krytí nebo stav pojistky"
      }

      Text smlouvy: ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, "");
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Chyba při analýze:", error);
    return { error: "Nepodařilo se analyzovat text." };
  }
}