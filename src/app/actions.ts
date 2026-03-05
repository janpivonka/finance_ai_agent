'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// Pomocná funkce pro odeslání dat do Make.com
async function triggerMakeAutomation(analysisData: any, originalText: string) {
  const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/ytxkh9md2redtpffsntb8g53zbto8v1u"; // SEM VLOŽ URL Z MAKE.COM

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...analysisData,
        rawText: originalText.substring(0, 500), // Pošleme i kousek textu pro kontrolu
        clientPhone: "+420123456789", // Pro testování Vapi (později dáme dynamicky)
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) throw new Error("Make.com webhook selhal");
    console.log("✅ Data úspěšně odeslána do Make.com");
  } catch (error) {
    console.error("❌ Chyba při odesílání do Make.com:", error);
  }
}

export async function analyzeContract(text: string) {
  try {
    // Používáme stabilní flash model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Jsi expert na české finanční právo a hypotéky. 
      Z následujícího textu smlouvy vytáhni klíčová data.
      Pokud v textu nejsou, odhadni je podle kontextu, ale uveď to.
      
      Vrať POUZE čistý JSON v tomto formátu (bez markdown značek):
      {
        "fixace": "text o konci fixace",
        "uspora": "odhadovaná měsíční úspora v Kč",
        "pojisteni": "procento krytí nebo stav pojistky",
        "analyticky_duvod": "stručné zdůvodnění pro hlasového asistenta"
      }

      Text smlouvy: ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Vyčištění JSONu (někdy ho Gemini balí do ```json ... ```)
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    const analysisResult = JSON.parse(jsonText);

    // --- TADY SPOUŠTÍME AUTOMATIZACI ---
    // Nečekáme na výsledek (asynchronně), aby uživatel nečekal na webu
    triggerMakeAutomation(analysisResult, text);

    return analysisResult;
  } catch (error) {
    console.error("Chyba při analýze:", error);
    return { error: "Nepodařilo se analyzovat text." };
  }
}