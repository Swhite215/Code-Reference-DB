
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
 * @apiErrorExample Error-Response-404:
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
 * @apiErrorExample Error-Response-404:
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

/**
 * @api {post} /db/:name Create a CouchDB database.
 * @apiVersion 0.1.0
 * 
 * @apiName Create_Database
 * @apiGroup CouchDB Database Endpoints
 *
 * @apiParam {String} name Unique name of database.
 * 
 * @apiSuccess {Object} Success Confirmation database was created.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { "ok": true}
 *
 * @apiError Database_Already_Exists The database already exists.
 *
 * @apiErrorExample Error-Response-412:
 *     HTTP/1.1 412 Precondition Failed
 *     {
 *       "error": "file_exists",
 *       "reason": "The database could not be created, the file already exists."
 *     }
 * 
 * @apiError Illegal_Database_Name The database name is invalid.
 *
 * @apiErrorExample Error-Response:-400
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "illegal_database_name",
 *       "reason": "Name: '1'. Only lowercase characters (a-z), digits (0-9), and any of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter."
 *     }
 */
app.post("/db/:name", async (req, res, next) => {
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

/**
 * @api {delete} /db/:name Delete a CouchDB database.
 * @apiVersion 0.1.0
 * 
 * @apiName Delete_Database
 * @apiGroup CouchDB Database Endpoints
 *
 * @apiParam {String} name Unique name of database.
 * 
 * @apiSuccess {Object} Success Confirmation database was deleted.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { "ok": true}
 *
 * @apiError Database_Not_Found The named database was not found.
 * 
 * @apiErrorExample Error-Response-404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not_found",
 *       "reason": "Database does not exist."
 *     }
 */
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

/**
 * @api {get} /db/:db/document/:id Get specific document in CouchDB database.
 * @apiVersion 0.1.0
 * 
 * @apiName Get_Document
 * @apiGroup CouchDB Document Endpoints
 *
 * @apiParam {String} db Unique name of database.
 * @apiParam {String} id Unique id of document.
 *
 * @apiSuccess {String} _id ID of the document.
 * @apiSuccess {String} _rev Current revision of the document.
 * @apiSuccess {String} param Parameter of the document (there may be multiple).
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "_id": String,
 *       "_rev": String,
 *       "param": String,Number,Array,Object,Boolean
 *     }
 *
 * @apiError Document_Not_Found The named document was not found.
 *
 * @apiErrorExample Error-Response-404:
 *     HTTP/1.1 404 Object Not Found
 *     {
 *       "error": "not_found",
 *       "reason": "missing"
 *     }
 */
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

/**
 * @api {get} /db/:db/query/document Get documents that meet criteria in CouchDB database.
 * @apiVersion 0.1.0
 * 
 * @apiName Get_Documents
 * @apiGroup CouchDB Document Endpoints
 *
 * @apiParam {String} db Unique name of database.
 * @apiParam {Object} query Request Body used to select documents.
 * @apiParam {Object} query.selector JSON object describing criteria used to select documents.
 * @apiParam {Integer} query.limit Maximum number of results to return.
 * @apiParam {Object[]} query.sort Array of objects that influence sort.
 * @apiParam {String[]} query.fields Array of strings that should be returned in each document.
 *
 * @apiSuccess {Object[]} Documents Array of documents that match search criteria.
 * @apiSuccess {String} Documents.string_param Parameter of the document, identified by fields in search criteria (there may be multiple).
 * @apiSuccess {Integer} Documents.int_param Parameter of the document, identified by fields in search criteria (there may be multiple).
 * @apiSuccess {Boolean} Documents.bool_param Parameter of the document, identified by fields in search criteria (there may be multiple).
 * @apiSuccess {Array} Documents.array_param Parameter of the document, identified by fields in search criteria (there may be multiple).
 * @apiSuccess {Object} Documents.object_param Parameter of the document, identified by fields in search criteria (there may be multiple).
 * @apiSuccess {String} bookmark allows you to specify which page of results you require.
 * @apiSuccess {String} warning Execution warnings.
 *
 * @apiSuccessExample Success-Response-200:
 *     HTTP/1.1 200 OK
 *     {
 *       "docs": [
 *          {
 *              string_param: String,
 *              int_param: Integer,
 *              bool_param: Boolean,
 *              array_param: Array,
 *              object_param: Object
 *          }
 *      ],
 *      "bookmark": String,
 *      "warning": String
 *     }
 * 
 * @apiSuccessExample Success-Response-204:
 *     HTTP/1.1 204 No Content
 *     {
 *       "docs": [],
 *      "bookmark": 'nil',
 *      "warning": 'no matching index found, create an index to optimize query'
 *     }
 *
 * @apiError Database_Not_Found The named database was not found.
 *
 * @apiErrorExample Error-Response-404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not_found",
 *       "reason": "Database does not exist."
 *     }
 */
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
      
        if (matchingDocuments.docs.length > 0) {
            res.send(matchingDocuments.docs)
        } else {
            res.status(204).send("No matching documents found.")
        }

    } catch(e) {
        console.log(`Error searching documents: ${e}`)
        next(`Error searching document: ${e}`)
    }

});

/**
 * @api {post} /db/:db/document/:id Create a document in a CouchDB database.
 * @apiVersion 0.1.0
 * 
 * @apiName Create_Document
 * @apiGroup CouchDB Document Endpoints
 *
 * @apiParam {String} db Unique name of database.
 * @apiParam {String} id Unique id of document.
 * 
 * @apiSuccess {Object} Success Confirmation document was created.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { "ok": true}
 *
 * @apiError Document_Already_Exists The document already exists.
 *
 * @apiErrorExample Error-Response-412:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "conflict",
 *       "reason": "Document update conflict."
 *     }
 */
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

/**
 * @api {delete} /db/:db/document/:id Delete a document.
 * @apiVersion 0.1.0
 * 
 * @apiName Delete_Document
 * @apiGroup CouchDB Document Endpoints
 *
 * @apiParam {String} db Unique name of database.
 * @apiParam {String} id Unique id of document.
 * 
 * @apiSuccess {Object} Success Confirmation document was deleted.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { "ok": true
 *       "id": String,
 *       "rev": String
 * }
 *
 * @apiError Database_Not_Found The named database was not found.
 * 
 * @apiErrorExample Error-Response-404:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "not_found",
 *       "reason": "Database does not exist."
 *     }
 * 
 * @apiError Document_Already_Deleted The document has already been deleted.
 * 
 * @apiErrorExample Error-Response-410:
 *     HTTP/1.1 410 Gone
 *     {
 *       "error": "can_not_delete",
 *       "reason": "Document was already deleted."
 *     }
 */
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