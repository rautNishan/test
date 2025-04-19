import webzio from "webzio";
import * as dotenv from "dotenv";
dotenv.config();
import { QueryBuilder } from "./builder/query.builter";
import { IQueryBuilder } from "./builder/interfaces/builder.interface";
import { migration } from "./database/database.queries";

async function fetchRecursively(query: IQueryBuilder) {}

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
    const query = builder.build();

    const data = await client.query("newsApiLite", query);
    console.log("This is data: ", data.posts[0].entities);
  } catch (error) {
    console.log("This is error: ", error);
    throw error;
  }
}

main();
