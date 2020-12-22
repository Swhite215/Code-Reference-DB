
// Express
const express = require("express");
const app = express();
const https = require("https")
const fs = require("fs")
const path = require("path")

// Services
const mongoDBService = require("./services/mongodb")

// Middleware
app.use(express.json());

/**
 * @api {post} /document Create a document in the base collection.
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
        e.customMsg = `Error getting changes for database ${dbToCheck}`;

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