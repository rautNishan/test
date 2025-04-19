import webzio from "webzio";
import * as dotenv from "dotenv";
dotenv.config();
import { QueryBuilder } from "./builder/query.builter";
import { IQuery, IQueryBuilder } from "./builder/interfaces/builder.interface";
import { insertIntoThreads, migration } from "./database/database.queries";
import { IWebzio } from "./interfaces/interfaces";
import { pool } from "./database/database.connection";

async function fetchRecursively(query: IQuery, webzClient: any) {
  let pageNumber: number = 1;

  /**
   * @lastCursorTillNow and @checkPointNextUrl is if servers goes down while migrating the data
   */
  let lastCursorTillNow: string = "";
  let checkPointNextUrl: string = "";

  try {
    // Initial query
    let data: IWebzio = await webzClient.query("newsApiLite", query);
    console.log(data.totalResults);
    lastCursorTillNow = data.posts[data.posts.length - 1].uuid;
    checkPointNextUrl = data.next;
    console.log(data.posts[0].thread);

    let totalFetched = data.posts.length;
    console.log(`Page ${pageNumber}: Got ${data.posts.length} posts`);

    while (data.moreResultsAvailable > 0) {
      // Wait a moment to avoid rate limiting
      //https://docs.webz.io/reference/errors
      await new Promise((resolve) => setTimeout(resolve, 1000));

      data = await webzClient.getNext();
      lastCursorTillNow = data.posts[data.posts.length - 1].uuid;
      checkPointNextUrl = data.next;
      pageNumber++;
      //Increment the total fetched
      totalFetched += data.posts.length;
      console.log(`Page ${pageNumber}: Got ${data.posts.length} posts.`);

      // Break if we get an empty page or if something is wrong
      if (data.posts.length === 0) {
        console.log("No more posts returned, breaking loop");
        console.log("Check point with next URL: ");

        break;
      }
    }

    console.log(
      `Finisuhed fetching. Total posts: ${totalFetched} out of ${data.totalResults}`
    );
  } catch (error) {
    //This means server was good until some point
    if (pageNumber > 1) {
      console.log(
        `Some thing wrong with server, the last cursor was: ` +
          lastCursorTillNow
      );
    }
    throw error;
  }
}

//This function will save in batches (how much we get in one pagination result)
async function saveIntoDataBase(data: IWebzio) {
  const client = pool.connect();
  await client.query("begin transaction"); //Since threads and post are related
  try {
    //For Thread
    for (let i = 0; i < data.posts.length; i++) {
      await insertIntoThreads(data.posts[i].thread, client);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('rollback;');
    throw error;
  } finally {
    client.release();
  }
}

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
