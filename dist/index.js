"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_connection_1 = require("./database/database.connection");
database_connection_1.pool.connect((err, client, release) => {
    if (err) {
        return console.error("Error acquiring client", err.stack);
    }
    console.log("Connected to the PostgreSQL database");
    release();
});
//# sourceMappingURL=index.js.map