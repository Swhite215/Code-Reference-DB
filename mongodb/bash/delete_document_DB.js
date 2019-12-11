// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Delete Document
db.Heroes.deleteOne({"name": {"$eq": "Joxos"}})
db.Heroes.deleteOne({"health": {"$gt": 140}})
db.Heroes.deleteOne({"$and" : [{"mana": {"$gt": 140}}, {"name": {"$eq": "Vi"}}]})