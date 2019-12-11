// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Create Temporary Collection to Confirm Database Exists
db.createCollection('Collection to Validate Database')