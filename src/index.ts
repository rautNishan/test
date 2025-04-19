import webzio from "webzio";
import * as dotenv from "dotenv";
dotenv.config();
import { QueryBuilder } from "./builder/query.builder";
import { IQuery, IQueryBuilder } from "./builder/interfaces/builder.interface";
import { migration } from "./database/database.queries";
import { fetchRecursively } from "./webzio.fetcher";

async function main() {
  try {
    const client = webzio.config({ token: process.env.WEBZIO_TOKEN });

    //Create necessay relations
    await migration();

    //Webzio Query
    const builder: IQueryBuilder = new QueryBuilder("database")
      .orLanguages("english")
      .sentiment("POSITIVE")
      .category("Education");

    fetchRecursively(builder.build(), client);
  } catch (error) {
    console.log("This is error: ", error);
    throw error;
  }
}

main();

