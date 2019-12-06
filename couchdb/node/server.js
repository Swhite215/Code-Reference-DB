
// Express
const express = require("express");
const app = express();
const router = express.Router();

// CouchDB
const nano = require("nano")('http://localhost:5984')

// Middleware
app.use(express.json());
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger_ui.json");

// Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1', router)

/*
 * @oas [get] /db/{name}
 * description: "Returns information about the database"
 * parameters:
 *   - (path) name=hi* {String} The name of the database
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

/*
 * @oas [get] /dbs
 * description: "Returns all databases that are on the server"
*/
app.get("/dbs", async(req, res, next) => {

    try {
        let databases = await nano.db.list();
        console.log(databases);
        res.send(databases)

    } catch(e) {
        console.log(`Error getting databases: ${e}`)
        next(`Error getting databases: ${e}`)
    }

});

app.get("/dbs/changes/:name", async(req, res, next) => {
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


app.delete("/dbs/:name", async(req, res, next) => {
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

/*
 * @oas [get] /db/{db}/document/{id}
 * description: "Returns information about the document"
 * parameters:
 *   - (path) db=* {String} The name of the database
 *   - (path) id= {String} The id of the document
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

app.use((err, req, res, next) => {

   console.log("HIT ERROR HANLDER")

   res.status(500).send(err)
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});