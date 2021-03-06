// Express
const express = require("express");
const app = express();
const https = require("https")
const fs = require("fs")
const path = require("path")

// Services
const sqlService = require("./services/sqlService")

// Middleware
app.use(express.json());

/**
 * @api {post} /db/table/:table Create a Table.
 * @apiVersion 0.1.0
 * 
 * @apiName Create_Table
 * @apiGroup MSSQL Table Endpoints
 *
 * @apiSuccess {String} Successfully created table.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     RESULT: Successfully created table!
 *
 * @apiError Databases_Not_Found The database does not exist on the server.
 *
 * @apiErrorExample Error-Response-500:
 *     HTTP/1.1 404 Not Found
 *     Error creating table: Error
 */
app.post("/db/table/:table", async(req, res, next) => {
    let tableToCreate = req.params.table;

    try {
        let result = await sqlService.createTable(tableToCreate);
        res.send(`RESULT: ` + result);

    } catch(e) {

        e.httpStatusCode = 500;
        e.customMsg = `Error creating table: ${tableToCreate}`;

        return next(e)
    }
});

/**
 * @api {post} /db/:name Create a MSSQL database.
 * @apiVersion 0.1.0
 * 
 * @apiName Create_Database
 * @apiGroup MSSQL Database Endpoints
 *
 * @apiParam {String} name Unique name of database.
 * 
 * @apiSuccess {Object} Success Confirmation database was created.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { message: `Successfully created name database!`}
 *
 * @apiError Database_Already_Exists The database already exists.
 *
 * @apiErrorExample Error-Response-500:
 *     HTTP/1.1 500 Server Failure
 *     {
 *       httpStatusCode: 500,
 *       message: "Database name already exists. Choose a different database name."
 *     }
 */
app.post("/db/:name", async (req, res, next) => {
    let dbToCreate = req.params.name;

    try {
        let newDB = await sqlService.createDatabase(dbToCreate);
        
        res.send({message: newDB})

    } catch(e) {

        e.httpStatusCode = 500;
        e.customMsg = `Error creating database ${dbToCreate}`;

        return next(e)
    }

});

/**
 * @api {post} /db/:name Drop a MSSQL database.
 * @apiVersion 0.1.0
 * 
 * @apiName Drop_Database
 * @apiGroup MSSQL Database Endpoints
 *
 * @apiParam {String} name Unique name of database.
 * 
 * @apiSuccess {Object} Success Confirmation database was dropped.

 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { message: `Successfully dropped name database!`}
 *
 * @apiError Database_Does_Not_Exist The database does not exist.
 *
 * @apiErrorExample Error-Response-500:
 *     HTTP/1.1 500 Server Failure
 *     {
 *       httpStatusCode: 500,
 *       message: "Cannot drop the database \'testDatabase\', because it does not exist or you do not have permission."
 *     }
 */
app.delete("/db/:name", async (req, res, next) => {
    let dbToDelete = req.params.name;

    try {
        let deleted = await sqlService.dropDatabase(dbToDelete);
        
        res.send({message: deleted})

    } catch(e) {

        e.httpStatusCode = 500;
        e.customMsg = `Error creating database ${dbToDelete}`;

        return next(e)
    }

});

/**
 * @api {get} /dbs Get list of databases on server.
 * @apiVersion 0.1.0
 * 
 * @apiName Get_Databases
 * @apiGroup MSSQL Database Endpoints
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
        let databases = await sqlService.queryDatabases();

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