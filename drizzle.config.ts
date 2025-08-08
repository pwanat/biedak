import { type Config } from "drizzle-kit";

const DB_URL = process.env.DATABASE_URL as string;
console.log("🚀 ~ DB_URL:", DB_URL)

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
  tablesFilter: ["biedak_*"],
} satisfies Config;
