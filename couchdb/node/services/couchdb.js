const nano = require("nano")('http://localhost:5984')

const getDatabase = async (name) => {
    const db = nano.use(name);

    try {
        let infoDB = await db.info();
        return infoDB
    } catch (e) {
        console.log(`CouchDB Service Error getting Database: ${e}`)
        throw (e)
    }
}

const getDatabases = async () => {

    try {
        let databases = await nano.db.list();
        return databases;

    } catch (e) {
        console.log(`CouchDB Service Error getting Databases: ${e}`)
        throw (e)
    }
}

const getDatabaseChanges = async (name) => {

    try {
        let changesToDB = await nano.db.changes(name);
        return changesToDB;

    } catch (e) {
        console.log(`CouchDB Service Error getting Database Changes: ${e}`)
        throw (e)
    }
}

const createDatabase = async (name) => {

    try {
        let newDB = await nano.db.create(name);
        return newDB;

    } catch (e) {
        console.log(`CouchDB Service Error creating Database: ${e}`)
        throw (e)
    }

}

const deleteDatabase = async (name) => {

    try {
        let deletedDB = await nano.db.destroy(name);
        return deletedDB;

    } catch (e) {
        console.log(`CouchDB Service Error deleting Database: ${e}`)
        throw (e)
    }
}

const getDocument = async (dbToUse, id) => {
    let db = nano.use(dbToUse);

    try {
        let document = await db.get(id);
        return document;
    } catch (e) {
        console.log(`CouchDB Service Error getting Document: ${e}`)
        throw (e)
    }

}

const queryDocuments = async (dbToUse, query) => {
    const db = nano.use(dbToUse);

    try {
        let matchingDocuments = await db.find(query);
        return matchingDocuments;
    } catch (e) {
        console.log(`CouchDB Service Error querying Documents: ${e}`);
        throw (e)
    }
}
const createDocument = async (dbToUse, documentBody, documentId) => {
    const db = nano.use(dbToUse);

    try {
        let newDocument = await db.insert(documentBody, documentId);
        return newDocument;
    } catch (e) {
        console.log(`CouchDB Service Error creating Document: ${e}`);
        throw (e)
    }
}

const deleteDocument = async (dbToUse, documentId) => {
    const db = nano.use(dbToUse);

    try {
        let documentToDelete = await db.get(documentId);
        let documentRevID = documentToDelete._rev;
        let deletedDocument = await db.destroy(documentId, documentRevID);

        return deletedDocument;
    } catch(e) {
        console.log(`CouchDB Service Error deleting Document: ${e}`)
        throw(e)
    }
}

module.exports = { 
    getDatabase, 
    getDatabases, 
    getDatabaseChanges, 
    createDatabase, 
    deleteDatabase, 
    getDocument, 
    queryDocuments, 
    createDocument, 
    deleteDocument 
}