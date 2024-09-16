import { defineConfig } from "drizzle-kit";
import { AppEnvs } from "./read_env";
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/drizzle/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: `mysql://${AppEnvs.DB_USER}:${AppEnvs.DB_PASSWORD}@${AppEnvs.DB_HOST}:${AppEnvs.DB_PORT}/${AppEnvs.DB_NAME}`,
  },
});
