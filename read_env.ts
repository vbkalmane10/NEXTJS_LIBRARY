export interface AppEnv {
  DATABASE_URL: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: string;
}
export const AppEnvs = process.env as unknown as AppEnv;
