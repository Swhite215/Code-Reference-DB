conn = new Mongo();
db = conn.getDB('Characters');

db.createCollection('Heroes')
db.createCollection('Villians')