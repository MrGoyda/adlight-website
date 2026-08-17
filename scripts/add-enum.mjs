import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    console.log("Connecting to database...");
    const res = await pool.query(`ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'UNPROCESSED';`);
    console.log("SUCCESS! Enum updated in PostgreSQL:", res);
  } catch (err) {
    console.error("FAILED to update enum:", err);
  } finally {
    await pool.end();
  }
}

main();
