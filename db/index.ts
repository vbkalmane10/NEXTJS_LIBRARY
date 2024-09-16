import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { AppEnvs } from "@/read_env";

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: Number(process.env.DB_PORT),
// });
// console.log(process.env.DB_HOST);
const pool = mysql.createPool({
  uri: AppEnvs.DATABASE_URL || "",
});
export const db = drizzle(pool);
