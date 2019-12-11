// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Get All Collection Info
let collections = db.getCollectionInfos();

// Get Specific Collection
let collection = db.getCollection("Heroes");

// Print All Collections
printjson(collections)

// Print Collection Count
printjson(collection.count())

// Print Collection Stats
printjson(collection.stats())