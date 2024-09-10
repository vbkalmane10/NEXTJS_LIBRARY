import { defineConfig } from "drizzle-kit";
import { AppEnvs } from "./read_env";
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: AppEnvs.DATABASE_URL,
  },
});
