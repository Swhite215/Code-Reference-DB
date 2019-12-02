//Requiring Express
const express = require("express");
const app = express();

//Requiring Nano
const nano = require("nano")('http://localhost:5984')

//Middleware
app.use(express.json()); //Allows the use of middleware in the request pipeline

//Handlers

// POST - Create a Database
app.post("/create/:name", async (req, res, next) => {
    let dbName = req.params.name;

    try {
        let newDB = await nano.db.create(dbName)
        
        if (newDB.ok) {
            res.send(`New database created: ${dbName}`)
        }

    } catch(e) {
        console.log(`Error creating database: ${e}`)
        next(`Error creating database: ${e}`)
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