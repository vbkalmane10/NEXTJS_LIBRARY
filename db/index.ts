import { Pool } from "pg";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { AppEnvs } from "@/read_env";
import { sql } from "@vercel/postgres";
import * as schema from "@/drizzle/schema";
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
// });
// console.log(process.env.DB_HOST);
export const db = drizzle(sql, { schema });
