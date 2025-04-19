import { IQuery } from "./builder/interfaces/builder.interface";
import { insertIntoPost, insertIntoThreads } from "./database/database.queries";
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
    console.log(data.totalResults);
    console.log("available reasults: ", data.moreResultsAvailable);
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
      console.log("available reasults: ", data.moreResultsAvailable);

      lastCursorTillNow = data.posts[data.posts.length - 1].uuid;
      checkPointNextUrl = data.next;
      pageNumber++;
      //Increment the total fetched
      totalFetched += data.posts.length;
      console.log(`Page ${pageNumber}: Got ${data.posts.length} posts.`);
      await saveIntoDataBase(data);
      console.log(`Saved batch till: ${lastCursorTillNow}`);
      // Break if we get an empty page or if something is wrong
      //And availabe result was not correct
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

      // Insert thread
      await insertIntoThreads(thread, client);

      // Insert post with thread_uuid
      await insertIntoPost({ ...post, thread_uuid: threadUuid }, client);
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
