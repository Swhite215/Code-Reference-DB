// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Get All Connection Names
let collections = db.getCollectionNames();

// Print All Connections
printjson(collections)