import pkg from "pg";
const { Pool } = pkg;
import * as dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: process.env.POSTGRES_USER_NAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  min: 1, 
  max: 1, //Since only one client just to populate data.
});
