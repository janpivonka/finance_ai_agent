import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

// Načtení env proměnných z .env nebo .env.local
dotenv.config(); // Načte .env standardně
dotenv.config({ path: ".env.local" }); // Přepíše s .env.local pokud existuje

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL chybí v .env nebo .env.local!");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("--- RESET DATABÁZE (Smazání veškerých dat) ---");
  
  try {
    console.log("Mažu analýzy (AnalysisHistory)...");
    await prisma.analysisHistory.deleteMany({});
    
    console.log("Mažu ověřovací tokeny (VerificationToken)...");
    await prisma.verificationToken.deleteMany({});
    
    console.log("Mažu relace (Sessions)...");
    await prisma.session.deleteMany({});
    
    console.log("Mažu propojené účty (Accounts)...");
    await prisma.account.deleteMany({});
    
    console.log("Mažu uživatele (Users)...");
    const { count } = await prisma.user.deleteMany({});
    
    console.log(`HOTOVO: Smazáno ${count} uživatelů a všechna související data.`);
  } catch (error) {
    console.error("Chyba při resetu:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
