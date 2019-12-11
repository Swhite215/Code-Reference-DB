// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// List Databases on Server
let databases = db.adminCommand('listDatabases');

// Print the Databases
printjson(databases)