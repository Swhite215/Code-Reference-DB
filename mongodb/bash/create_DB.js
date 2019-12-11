conn = new Mongo();
db = conn.getDB('Characters');

db.createCollection('Collection to Validate Database')