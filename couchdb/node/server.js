//Requiring Express
const express = require("express");
const app = express();

//Requiring Nano
const nano = require("nano")('http://localhost:5984')

//Middleware
app.use(express.json()); //Allows the use of middleware in the request pipeline

//Handlers

// GET - Get all Databases
app.get("/", async(req, res, next) => {

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
app.get("/changes/:name", async(req, res, next) => {
    let dbToCheck = req.params.name;

    try {
        let changesOfDB = await nano.db.changes(dbToCheck);
        console.log(changesOfDB);
        res.send(changesOfDB)

    } catch(e) {
        console.log(`Error getting changes for database ${dbToCheck}: ${e}`)
        next(`Error getting changes for database ${dbToCheck}: ${e}`)
    }

});


// POST - Create a Database
app.post("/:name", async (req, res, next) => {
    let dbToCreate = req.params.name;

    try {
        let newDB = await nano.db.create(dbToCreate)
        
        if (newDB.ok) {
            res.send(`New database created: ${dbToCreate}`)
        }

    } catch(e) {
        console.log(`Error creating database: ${e}`)
        next(`Error creating database: ${e}`)
    }


});

// DELETE - Remove a Database
app.delete("/:name", async(req, res, next) => {
    let dbToDelete = req.params.name;

    try {
        let deletedDB = await nano.db.destroy(dbToDelete);
        
        if (deletedDB.ok) {
            res.send(`Database was deleted: ${deletedDB}`)
        }

    } catch(e) {
        console.log(`Error deleting database: ${e}`)
        next(`Error deleting database: ${e}`)
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