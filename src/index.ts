import webzio from "webzio";
import * as dotenv from "dotenv";
dotenv.config();

import { QueryBuilder } from "./builder/query.builter";
import { IQueryBuilder } from "./builder/interfaces/builder.interface";

const client = webzio.config({ token: process.env.WEBZIO_TOKEN });

//Since i was only getting 10 data at a time i am putting a lot of filter
// const builder = new QueryBuilder("Database")
//   .orLanguages("english")
//   .sentiment("POSITIVE")
//   .category("Education");
// const query = builder.build();
// console.log(query);
const builder: IQueryBuilder = new QueryBuilder("Database")
  .orLanguages("english")
  .sentiment("POSITIVE")
  .category("Education");
const query = builder.build();
console.log(query);

client.query("newsApiLite", query).then((output) => {
  console.log(output.posts[0]);
  console.log(output.posts.length);
  console.log(output.totalResults);
  console.log(output.moreResultsAvailable);
});

// client.getNext().then((output) => {
//   console.log("--------------------");
//   console.log(output["posts"][0]["thread"]["site"]);
//   console.log(output["posts"][0]["published"]);
// });
