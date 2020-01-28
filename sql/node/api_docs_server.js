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