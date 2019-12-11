// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Remove Collection
db.Heroes.drop()