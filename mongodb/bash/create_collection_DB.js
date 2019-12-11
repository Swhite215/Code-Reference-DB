// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Create Collections in Database
db.createCollection('Heroes')
db.createCollection('Villians')