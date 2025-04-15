import { pool } from "./database/database.connection";

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to the PostgreSQL database");
  release();
});
