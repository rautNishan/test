"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webzio_1 = __importDefault(require("webzio"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const query_builter_1 = require("./builder/query.builter");
const database_queries_1 = require("./database/database.queries");
const database_connection_1 = require("./database/database.connection");
async function fetchRecursively(query, webzClient) {
    let pageNumber = 1;
    /**
     * @lastCursorTillNow and @checkPointNextUrl is if servers goes down while migrating the data
     */
    let lastCursorTillNow = "";
    let checkPointNextUrl = "";
    try {
        // Initial query
        let data = await webzClient.query("newsApiLite", query);
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
        console.log(`Finisuhed fetching. Total posts: ${totalFetched} out of ${data.totalResults}`);
    }
    catch (error) {
        //This means server was good until some point
        if (pageNumber > 1) {
            console.log(`Some thing wrong with server, the last cursor was: ` +
                lastCursorTillNow);
            console.log(`If you wish to continue with last next url: ` + checkPointNextUrl);
        }
        throw error;
    }
}
//This function will save in batches (how much we get in one pagination result)
async function saveIntoDataBase(data) {
    const client = await database_connection_1.pool.connect();
    await client.query("begin transaction"); //Since threads and post are related
    try {
        //For Thread
        for (let i = 0; i < data.posts.length; i++) {
            await (0, database_queries_1.insertIntoThreads)(data.posts[i].thread, client);
        }
        for (let i = 0; i < data.posts.length; i++) {
            await (0, database_queries_1.insertIntoPost)({
                ...data.posts[i],
                thread_uuid: data.posts[i].thread.uuid,
            }, client);
        }
        //For post
        await client.query("COMMIT");
    }
    catch (error) {
        await client.query("rollback;");
        throw error;
    }
    finally {
        client.release();
    }
}
async function main() {
    try {
        const client = webzio_1.default.config({ token: process.env.WEBZIO_TOKEN });
        //Create necessay relations
        await (0, database_queries_1.migration)();
        //Webzio Query
        const builder = new query_builter_1.QueryBuilder("database")
            .orLanguages("english")
            .sentiment("POSITIVE")
            .category("Education");
        fetchRecursively(builder.build(), client);
    }
    catch (error) {
        console.log("This is error: ", error);
        throw error;
    }
}
main();
//# sourceMappingURL=index.js.map