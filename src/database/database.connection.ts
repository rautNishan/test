import pkg from "pg";
const { Pool } = pkg;
import * as dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: process.env.POSTGRES_USER_NAME,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

