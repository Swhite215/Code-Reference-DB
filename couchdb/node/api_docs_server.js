
// Express
const express = require("express");
const app = express();
const https = require("https")
const fs = require("fs")
const path = require("path")

// CouchDB
const nano = require("nano")('http://localhost:5984')

// Middleware
app.use(express.json());

/**
 * @api {get} /db/:name Get specific CouchDB database.
 * @apiVersion 0.1.0
 * 
 * @apiName Get_Database
 * @apiGroup CouchDB Database Endpoints
 *
 * @apiParam {String} name Unique name of database.
 *
 * @apiSuccess {String} db_name Name of the database.
 * @apiSuccess {Integer} doc_count Number of documents stored in database.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "db_name": "name",
 *       "doc_count": 12
 *     }
 *
 * @apiError Database_Not_Found The named database was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not_found",
 *       "reason": "Database does not exist."
 *     }
 */
app.get("/db/:name", async(req, res, next) => {
    let dbToCheck = req.params.name;

    const db = nano.use(dbToCheck);

    try {
        let infoDB = await db.info();
        console.log(infoDB);
        res.send(infoDB)

    } catch(e) {
        console.log(`Error getting info for database ${dbToCheck}: ${e}`)
        next(`Error getting info for database ${dbToCheck}: ${e}`)
    }

});

/**
 * @api {get} /dbs Get list of CouchDB databases on server.
 * @apiVersion 0.1.0
 * 
 * @apiName Get_Databases
 * @apiGroup CouchDB Database Endpoints
 *
 * @apiSuccess {Array} databases String array of databases.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     ["database1", "database2"]
 *
 * @apiError Databases_Not_Found There are no databases on this server.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not_found",
 *       "reason": "No databases found."
 *     }
 */
app.get("/dbs", async(req, res, next) => {

    try {
        let databases = await nano.db.list();
        console.log(databases);

        if (databases.length == 0) {
            throw "No databases found";
        }

        res.send(databases)

    } catch(e) {
        console.log(`Error getting databases: ${e}`)
        next(`Error getting databases: ${e}`)
    }

});

/**
 * @api {get} /db/changes/:name Get change list of CouchDB database.
 * @apiVersion 0.1.0
 * 
 * @apiName Get_Database_Changes
 * @apiGroup CouchDB Database Endpoints
 *
 * @apiParam {String} name Unique name of database.
 * 
 * @apiSuccess {Object} Changes Object with results array of revision objects for database.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *      results: [
 *          {
 *              "seq": String,
 *              "rev": String
 *          }
 *      ] 
 *     }
 *
 * @apiError Database_Not_Found The named database was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not_found",
 *       "reason": "Database does not exist."
 *     }
 */
app.get("/db/changes/:name", async(req, res, next) => {
    let dbToCheck = req.params.name;

    try {
        let changesToDB = await nano.db.changes(dbToCheck);
        console.log(changesToDB);
        res.send(changesToDB)

    } catch(e) {
        console.log(`Error getting changes for database ${dbToCheck}: ${e}`)
        next(`Error getting changes for database ${dbToCheck}: ${e}`)
    }

});

app.post("/dbs/:name", async (req, res, next) => {
    let dbToCreate = req.params.name;

    try {
        let newDB = await nano.db.create(dbToCreate)
        
        if (newDB.ok) {
            res.send(`New database created: ${dbToCreate}`)
        }

    } catch(e) {
        console.log(`Error creating database ${dbToCreate}: ${e}`)
        next(`Error creating database ${dbToCreate}: ${e}`)
    }


});

app.delete("/db/:name", async(req, res, next) => {
    let dbToDelete = req.params.name;

    try {
        let deletedDB = await nano.db.destroy(dbToDelete);
        
        if (deletedDB.ok) {
            res.send(`Database was deleted: ${deletedDB}`)
        }

    } catch(e) {
        console.log(`Error deleting database ${dbToDelete}: ${e}`)
        next(`Error deleting database ${dbToDelete}: ${e}`)
    }
});

app.get("/db/:db/document/:id", async(req, res, next) => {
    const dbToUse = req.params.db;
    const documentId = req.params.id;

    const db = nano.use(dbToUse);

    try {
        let document = await db.get(documentId);
      
        res.send(document);

    } catch(e) {
        console.log(`Error getting document ${documentId}: ${e}`)
        next(`Error getting document ${documentId}: ${e}`)
    }

});

app.get("/db/:db/query/document", async(req, res, next) => {
    const dbToUse = req.params.db;

    const db = nano.use(dbToUse);

    const query = {
        selector: {
            name: {"$eq": "Titan"},
            stamina: {"$gt": 125}
        },
        fields: ["name", "health", "stamina", "atk", "items"],
        limit: 100
    }

    try {
        let matchingDocuments = await db.find(query);

        console.log(matchingDocuments)
      
        if (matchingDocuments.docs.length > 0) {
            res.send(matchingDocuments.docs)
        } else {
            res.send("No matching documents found.")
        }

    } catch(e) {
        console.log(`Error searching documents: ${e}`)
        next(`Error searching document: ${e}`)
    }

});

app.post("/db/:db/document/:id", async(req, res, next) => {
    const dbToUse = req.params.db;
    const documentId = req.params.id;

    let body = req.body;

    const db = nano.use(dbToUse);

    try {
        let newDocument = await db.insert(body, documentId);

        if (newDocument.ok) {
            res.send(`Document was created ${documentId}`)
        }

    } catch(e) {
        console.log(`Error creating document ${documentId}: ${e}`)
        next(`Error creating document ${documentId}: ${e}`)
    }

});

app.delete("/db/:db/document/:id", async(req, res, next) => {
    const dbToUse = req.params.db;
    const documentId = req.params.id;

    const db = nano.use(dbToUse);

    try {
        let documentToDelete = await db.get(documentId);
    
        let documentRevID = documentToDelete._rev;

        let deletedDocument = await db.destroy(documentId, documentRevID);

        if (deletedDocument.ok) {
            res.send(`Document was deleted: ${deletedDocument}`)
        }

    } catch(e) {
        console.log(`Error deleting document ${documentId}: ${e}`)
        next(`Error deleting document ${documentId}: ${e}`)
    }

});

// Api Documentation
app.use("/api-docs", express.static(path.join(__dirname, "apidoc")))

// Error Handler
app.use((err, req, res, next) => {

   console.log("HIT ERROR HANLDER")

   res.status(500).send(err)
});

// PORT of Server
const port = process.env.PORT || 3000;

// Create HTTPS Server Using OpenSSL Certificate and Key
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});