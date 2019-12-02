//Requiring Express
const express = require("express");
const app = express();

//Requiring Nano
const nano = require("nano")('http://localhost:5984')

//Middleware
app.use(express.json()); //Allows the use of middleware in the request pipeline

//Handlers

// POST - Create a Database
app.post("/:name", async (req, res, next) => {
    console.log(req.params)
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