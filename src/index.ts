import webzio from "webzio";
import * as dotenv from "dotenv";
dotenv.config();

import { QueryBuilder } from "./builder/query.builter";

const client = webzio.config({ token: process.env.WEBZIO_TOKEN });

const builder = new QueryBuilder("education")
  .orLanguages("nepali")
  .andLanguages("nepali3");
const query = builder.build();
console.log(query);

// client.getNext().then((output) => {
//   console.log("--------------------");
//   console.log(output["posts"][0]["thread"]["site"]);
//   console.log(output["posts"][0]["published"]);
// });
