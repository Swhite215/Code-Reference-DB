// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Get Cursor to All Documents
let myCursor = db.Heroes.find({})

// Print All Documents
while (myCursor.hasNext()) {
    printjson(myCursor.next())
}