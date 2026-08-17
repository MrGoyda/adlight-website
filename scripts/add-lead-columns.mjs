import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    console.log("Adding columns to Lead table in PostgreSQL...");
    await pool.query(`ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "offeredPrice" DOUBLE PRECISION;`);
    await pool.query(`ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "isDiscounted" BOOLEAN NOT NULL DEFAULT false;`);
    console.log("SUCCESS! Columns offeredPrice and isDiscounted added.");
  } catch (err) {
    console.error("FAILED to add columns:", err);
  } finally {
    await pool.end();
  }
}

main();
