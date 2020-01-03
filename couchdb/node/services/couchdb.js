const nano = require("nano")('http://localhost:5984')

const getDatabase = async (name) => {
    const db = nano.use(name);

    try {
        let infoDB = await db.info();
        return infoDB
    } catch(e) {
        console.log(`CouchDB Service Error getting Database: ${e}`)
        throw(e)
    }
}

const getDatabases = async () => {

    try {
        let databases = await nano.db.list();
        return databases;

    } catch(e) {
        console.log(`CouchDB Service Error getting Databases: ${e}`)
        throw(e)
    }
}

const getDatabaseChanges = async (name) => {

    try {
        let changesToDB = await nano.db.changes(name);
        return changesToDB;

    } catch(e) {
        console.log(`CouchDB Service Error getting Database Changes: ${e}`)
        throw(e)
    }
}

const createDatabase = async (name) => {

    try {
        let newDB = await nano.db.create(name);
        return newDB;

    } catch(e) {
        console.log(`CouchDB Service Error creating Database: ${e}`)
        throw(e)
    }

}

const deleteDatabase = async (name) => {

    try {
        let deletedDB = await nano.db.destroy(name);
        console.log("IN DELETE")
        console.log(deletedDB)
        return deletedDB;

    } catch(e) {
        console.log(`CouchDB Service Error deleting Database: ${e}`)
        throw(e)
    }
}

const getDocument = async (dbToUse, id) => {
    let db = nano.use(dbToUse);

    try {
        let document = await db.get(id);
        return document;
    } catch(e) {
        console.log(`CouchDB Service Error getting Document: ${e}`)
        throw(e)
    }

}

module.exports = {getDatabase, getDatabases, getDatabaseChanges, createDatabase, deleteDatabase, getDocument}