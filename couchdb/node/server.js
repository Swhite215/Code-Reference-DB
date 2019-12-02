//Requiring Express
const express = require("express");
const app = express();

//Requiring Nano
const nano = require("nano")('http://localhost:5984')

//Middleware
app.use(express.json()); //Allows the use of middleware in the request pipeline

//Database Handlers

// GET - Get info on a single Database
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

// GET - Get all Databases
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

// GET - Get all changes to a Database
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


// POST - Create a Database
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

// DELETE - Remove a Database
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

//Document Handlers

// GET - Get a Document
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

// GET - Search for a Document
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

// POST - Create a document
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

// DELETE - DEELTE a Document
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

//Error Handler
app.use((err, req, res, next) => {

   console.log("HIT ERROR HANLDER")

   res.status(500).send(err)
});

// PORT - Environment Variable
const port = process.env.PORT || 3000; //Use environment variable or port 3000

//Listen on a Port
app.listen(port, () => {
    console.log(`Listening on Port: ${port}`);
});