// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Update Document
db.Heroes.updateOne({"name": {"$eq": "Joxos"}}, {"$set": {"health": 300}})