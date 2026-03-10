'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

// Pomocná funkce pro odeslání dat do Make.com
async function triggerMakeAutomation(analysisData: any, originalText: string) {
  const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/ytxkh9md2redtpffsntb8g53zbto8v1u";

  try {
    const payload = {
      ...analysisData,
      rawText: originalText.substring(0, 1000), 
      clientPhone: "+420123456789",
      timestamp: new Date().toISOString(),
    };

    console.log("📤 Odesílám do Make.com...");

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`Make.com selhal s kódem ${response.status}`);
    console.log("✅ Automatizace v Make.com spuštěna");
  } catch (error) {
    console.error("❌ Chyba automatizace:", error);
  }
}

export async function analyzeContract(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const rawTextFromArea = formData.get("text") as string;
    
    // Používáme model s přístupem k aktuálním informacím
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Jsi pokročilý AI finanční poradce. Tvým úkolem je provést hloubkovou analýzu trhu.
      
      POSTUPUJ V TĚCHTO KROCÍCH:
      1. VYHLEDÁVÁNÍ (Live Search): Najdi aktuální nejnižší úrokové sazby hypoték v ČR (Moneta, AirBank, Fio, KB, ČSOB, Česká spořitelna, MBank).
      2. KOMPARACE: Porovnej tyto tržní nabídky se sazbou, kterou najdeš v dokumentu klienta.
      3. VÝPOČET: 
         - Pokud ve smlouvě není zůstatek, počítej vždy přesně s 3.500.000 Kč.
         - Vypočítej měsíční úsporu oproti nejlepší nabídce na trhu.
      
      Vrať POUZE ČISTÝ JSON v tomto formátu:
      {
        "fixace": "přesné datum konce fixace",
        "uspora": číslo_úspory_v_Kč_bez_textu,
        "aktualni_trzni_sazba": "např. 4.29% u AirBank",
        "pojisteni": "identifikovaný stav",
        "analyticky_duvod": "Detailní srovnání: Vaše sazba X% vs trh Y%.",
        "textovy_obsah": "Stručný výtah všech parametrů smlouvy pro e-mail."
      }
    `;

    let result;
    let logLabel = "";

    if (file && file.size > 0) {
      console.log(`📄 Analýza PDF: ${file.name}`);
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      result = await model.generateContent([
        { inlineData: { data: base64, mimeType: "application/pdf" } },
        { text: prompt }
      ]);
      logLabel = `PDF: ${file.name}`;
    } else {
      console.log("✍️ Analýza vloženého textu");
      result = await model.generateContent(`${prompt}\n\nSmlouva:\n${rawTextFromArea}`);
      logLabel = rawTextFromArea;
    }

    const response = await result.response;
    const jsonText = response.text().replace(/```json|```/g, "").trim();
    const analysisResult = JSON.parse(jsonText);

    console.log("✨ Analýza hotova, spouštím odeslání...");

    // DŮLEŽITÉ: Tady se volá Make.com
    await triggerMakeAutomation(analysisResult, analysisResult.textovy_obsah || logLabel);

    return analysisResult;
  } catch (error: any) {
    console.error("🔥 KRITICKÁ CHYBA:", error);
    return { error: `Selhalo to: ${error.message}` };
  }
}