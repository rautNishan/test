import { IQuery } from "./builder/interfaces/builder.interface";
import {
  insertOrUpdatePost,
  insertOrUpdateThread,
} from "./database/database.queries";
import { IWebzio } from "./interfaces/interfaces";
import { pool } from "./database/database.connection";

export async function fetchRecursively(query: IQuery, webzClient: any) {
  let pageNumber: number = 1;

  /**
   * @lastCursorTillNow and @checkPointNextUrl is if servers goes down while migrating the data
   */
  let lastCursorTillNow: string = "";
  let checkPointNextUrl: string = "";

  try {
    // Initial query
    let data: IWebzio = await webzClient.query("newsApiLite", query);
    
    lastCursorTillNow = data.posts[data.posts.length - 1].uuid;
    checkPointNextUrl = data.next;

    let totalFetched = data.posts.length;
    console.log(`Page ${pageNumber}: Got ${data.posts.length} posts`);
    await saveIntoDataBase(data);
    console.log(`Saved batch till: ${lastCursorTillNow}`);

    while (data.moreResultsAvailable > 0) {
      // Wait a moment to avoid rate limiting
      //https://docs.webz.io/reference/errors
      await new Promise((resolve) => setTimeout(resolve, 1000));

      data = await webzClient.getNext();
      // Break if we get an empty page or if something is wrong
      //And availabe result was not correct
      if (data.posts.length === 0) {
        console.log("No more posts returned, breaking loop");
        break;
      }

      lastCursorTillNow = data.posts[data.posts.length - 1].uuid;
      checkPointNextUrl = data.next;
      pageNumber++;
      totalFetched += data.posts.length;

      console.log(`Page ${pageNumber}: Got ${data.posts.length} posts.`);
      await saveIntoDataBase(data);
      console.log(`Saved batch till: ${lastCursorTillNow}`);
    }

    console.log(
      `Finisuhed fetching. Total posts fetched: ${totalFetched} out of ${data.totalResults}`
    );
    console.log(
      `If Total posts fetched ${totalFetched} is greater than total post ${data.totalResults} there might be some duplicate. Check db to confirm.`
    );
    console.log(`Final meta : `, {
      availableTotalPost: data.totalResults,
      totalFetched: totalFetched,
      warnings: data.warnings,
      queryToApi: query,
    });
  } catch (error) {
    //This means server was good until some point
    if (pageNumber > 1) {
      console.log(
        `Some thing wrong with server, the last cursor was: ` +
          lastCursorTillNow
      );
      console.log(
        `If you wish to continue with last next url: ` + checkPointNextUrl
      );
    }
    throw error;
  }
}

//This function will save in batches (how much we get in one pagination result)
async function saveIntoDataBase(data: IWebzio) {
  const client = await pool.connect();
  await client.query("begin");
  try {
    for (const post of data.posts) {
      const thread = post.thread;
      const threadUuid = thread.uuid;

      // Insert thread or update if existing uuid found
      await insertOrUpdateThread(thread, client);

      // Insert post  or update if existing found
      await insertOrUpdatePost({ ...post, thread_uuid: threadUuid }, client);
    }
    await client.query("commit");
    console.log("Completed saving threads and post in database");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
