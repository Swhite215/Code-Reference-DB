
// Express
const express = require("express");
const app = express();
const https = require("https")
const fs = require("fs")
const path = require("path")

// Services
const couchDBService = require("./services/couchdb")

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

    if (!dbToCheck) {
        const error = new Error('missing database name')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let database = await couchDBService.getDatabase(dbToCheck)
        res.send(database)

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error getting info for database ${dbToCheck}`;

        return next(e)
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
        let databases = await couchDBService.getDatabases();

        if (databases.length == 0) {
            throw "No databases found";
        }

        res.send(databases)

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error getting databases`;

        return next(e)
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

    if (!dbToCheck) {
        const error = new Error('missing database name')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let changesToDB = await couchDBService.getDatabaseChanges(dbToCheck)
        res.send(changesToDB)

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error getting changes for database ${dbToCheck}`;

        return next(e)
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

    if (!dbToCreate) {
        const error = new Error('missing database name')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let newDB = await couchDBService.createDatabase(dbToCreate);
        
        if (newDB.ok) {
            res.send(newDB)
        }

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error creating database ${dbToCreate}`;

        return next(e)
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

    if (!dbToDelete) {
        const error = new Error('missing database name')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let deletedDB = await couchDBService.deleteDatabase(dbToDelete);
        res.send(deletedDB);

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error deleting database ${dbToDelete}`;

        return next(e)
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

    if (!dbToUse || !documentId) {
        const error = new Error('missing database name or document ID')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let document = await couchDBService.getDocument(dbToUse, documentId);
        res.send(document);
    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error getting document ${documentId}`;

        return next(e)
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
    const query = req.body;

    if (!dbToUse || !query) {
        const error = new Error('missing database name or search query')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let matchingDocuments = await couchDBService.queryDocuments(dbToUse, query);
        res.send(matchingDocuments);
    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error searching documents.`;

        return next(e)
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
 *     { "ok": true, "id": Document_ID}
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
    let documentBody = req.body;

    if (!dbToUse || !documentId || !documentBody) {
        const error = new Error('missing database name, document ID, or document body')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let newDocument = await couchDBService.createDocument(dbToUse, documentBody, documentId);
        res.send(newDocument);
    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error creating document ${documentId}`;

        return next(e)
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
 *       "_rev": String
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


    if (!dbToUse || !documentId) {
        const error = new Error('missing database name or document ID')
        error.httpStatusCode = 400
        return next(error)
    }

    try {
        let deletedDocument = await couchDBService.deleteDocument(dbToUse, documentId);
        res.send(deletedDocument);
    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error deleting document ${documentId}`;

        return next(e)
    }

});

// Api Documentation
app.use("/api-docs", express.static(path.join(__dirname, "apidoc")))

// Error Handler
app.use((err, req, res, next) => {

   console.log("Custom Server Message: " + err.customMsg);
   console.log(err);
   res.status(err.httpStatusCode).json(err)

});

// PORT of Server
const port = process.env.PORT || 3000;

// Create HTTPS Server Using OpenSSL Certificate and Key
let server = https.createServer({
    key: fs.readFileSync(path.parse(__filename).dir + '/server.key'),
    cert: fs.readFileSync(path.parse(__filename).dir + '/server.cert')
}, app).listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});

// Export Server for Chai HTTP Testing - Comment This Line When Running
module.exports = server