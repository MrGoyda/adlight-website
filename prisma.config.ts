import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// В Prisma 7 для CLI команд (таких как db push) важно использовать прямое подключение (directUrl или 5432 порт)
// в качестве основного url, так как пул транзакций (port 6543) не поддерживает DDL операции.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
