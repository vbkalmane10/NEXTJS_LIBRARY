import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { AppEnvs } from "@/read_env";
// Create a MySQL connection pool
const pool = mysql.createPool({
  uri: AppEnvs.DATABASE_URL || "",
});

// Initialize Drizzle with the connection
export const db = drizzle(pool);
