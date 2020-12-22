
// Express
const express = require("express");
const app = express();
const https = require("https")
const fs = require("fs")
const path = require("path")
const mongodb = require("mongodb");

// Services
const mongoDBService = require("./services/mongodb");
const { resolveSoa } = require("dns");

// Middleware
app.use(express.json());

/**
 * @api {get} /document Find a document or documents in the collection.
 * @apiVersion 0.1.0
 * 
 * @apiName Query_Document
 * @apiGroup MongoDB Document Endpoints
 *
 * @apiParam {Object} query Unique query to search for heroes
 *
 * @apiSuccess {Object} hero(es) Hero document or heroes documents
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *          "_id": STRING,
 *          "name": STRING,
 *          "health": NUMBER,
 *          "stamina": NUMBER,
 *          "mana": NUMBER,
 *          "atk": NUMBER,
 *          "items": STRING[],
 *          "canFight": BOOL,
 *          "canCast": BOOL
 *       }
 *     ]
 * 
 * @apiError Unable_To_Query Failed to query documents in collection.
 *
 * @apiErrorExample Success-Response:
 *     HTTP/1.1 503 OK
 *     {
 *       "result": "failure"
 *     }
 */
app.get("/documents", async (req, res, next) => {

    let query = req.body;

    try {
        let documents = await mongoDBService.HeroesDb.Get(query);

        if (documents.length > 0) {
            res.json(documents);
        } else {
            res.status(404).json({"result": "failure"});
        }

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error getting document(s) with query: ${query}`;

        return next(e)
    }
});

/**
 * @api {post} /document Insert a document into the collection.
 * @apiVersion 0.1.0
 * 
 * @apiName Create_Document
 * @apiGroup MongoDB Document Endpoints
 *
 * @apiParam {Object} hero Unique json hero object to be added to database
 *
 * @apiSuccess {String} result Success or failure.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "success"
 *     }
 * 
 * @apiError Unable_To_Insert Failed to insert document into collection.
 *
 * @apiErrorExample Success-Response:
 *     HTTP/1.1 503 OK
 *     {
 *       "result": "failure"
 *     }
 */
app.post("/document", async (req, res, next) => {

    let hero = req.body;

    try {
        let newHero = await mongoDBService.HeroesDb.Insert(hero);

        if (newHero.insertedCount == 1) {
            res.json({"result": "success"});
        } else {
            res.status(503).json({"result": "failure"});
        }

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error inserting document: ${hero}`;

        return next(e)
    }
});

/**
 * @api {post} /documents Insert multiple documents into the collection.
 * @apiVersion 0.1.0
 * 
 * @apiName Create_Documents
 * @apiGroup MongoDB Document Endpoints
 *
 * @apiParam {Array} heroes Array of unique json hero objects to be added to database
 *
 * @apiSuccess {String} result Success or failure.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "success"
 *     }
 * 
 * @apiError Unable_To_Insert Failed to insert documents into collection.
 *
 * @apiErrorExample Success-Response:
 *     HTTP/1.1 503 OK
 *     {
 *       "result": "failure"
 *     }
 */
app.post("/documents", async (req, res, next) => {

    let heroes = req.body;

    try {
        let newHeroes = await mongoDBService.HeroesDb.InsertMany(heroes);

        if (newHeroes.insertedCount == req.body.length) {
            res.json({"result": "success"});
        } else {
            res.status(503).json({"result": "failure"});
        }

    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error inserting documents: ${heroes}`;

        return next(e)
    }
});


/**
 * @api {delete} /document/:id Delete a document from the collection.
 * @apiVersion 0.1.0
 * 
 * @apiName Delete_Document
 * @apiGroup MongoDB Document Endpoints
 *
 * @apiParam {Number} document_id ID of the document to delete
 *
 * @apiSuccess {String} result Success or failure.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "success"
 *     }
 * 
 * @apiError Unable_To_Delete Failed to remove document from collection.
 *
 * @apiErrorExample Success-Response:
 *     HTTP/1.1 503 OK
 *     {
 *       "result": "failure"
 *     }
 */
app.delete("/document/:id", async (req, res, next) => {

    let id = req.params.id;

    try {
        let deletedHero = await mongoDBService.HeroesDb.DeleteOne({_id: new mongodb.ObjectID(id) });

        if (deletedHero.deletedCount == 1) {
            res.json({"result": "success"});
        } else {
            res.status(503).json({"result": "failure"});
        }


    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error deleting document with id: ${id}`;

        return next(e)
    }
});

/**
 * @api {delete} /documents/:name Delete multiples document from the collection.
 * @apiVersion 0.1.0
 * 
 * @apiName Delete_Documents
 * @apiGroup MongoDB Document Endpoints
 *
 * @apiParam {String} document_name Name of the documents to delete
 *
 * @apiSuccess {String} result Success or failure.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "result": "success"
 *     }
 * 
 * @apiError Unable_To_Delete Failed to remove documents from collection.
 *
 * @apiErrorExample Success-Response:
 *     HTTP/1.1 503 OK
 *     {
 *       "result": "failure"
 *     }
 */
app.delete("/documents/:name", async (req, res, next) => {

    let name = req.params.name;

    try {
        let deletedHero = await mongoDBService.HeroesDb.DeleteMany({name: name });

        if (deletedHero.deletedCount >= 1) {
            res.json({"result": "success"});
        } else {
            res.status(503).json({"result": "failure"});
        }


    } catch(e) {
        e.httpStatusCode = 500;
        e.customMsg = `Error deleting documents with name: ${name}`;

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

// Set Up MongoDB Connection
mongoDBService.setupDb();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});