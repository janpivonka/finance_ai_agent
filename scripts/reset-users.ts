import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";

// Načtení env proměnných z .env.local
dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL chybí v .env.local!");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("--- RESET DATABÁZE UŽIVATELŮ ---");
  
  try {
    console.log("Mažu analýzy...");
    await prisma.analysisHistory.deleteMany({});
    
    console.log("Mažu propojené účty (OAuth)...");
    await prisma.account.deleteMany({});
    
    console.log("Mažu relace (Sessions)...");
    await prisma.session.deleteMany({});
    
    console.log("Mažu uživatele...");
    const { count } = await prisma.user.deleteMany({});
    
    console.log(`HOTOVO: Smazáno ${count} uživatelů.`);
  } catch (error) {
    console.error("Chyba při resetu:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
