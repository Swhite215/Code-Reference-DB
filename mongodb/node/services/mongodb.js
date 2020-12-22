const { MongoClient } = require("mongodb");

const DBClient = new MongoClient("mongodb://localhost:27017",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

let DB;

async function setupDb() {
  await DBClient.connect();
  DB = DBClient.db("heroes");
}

const ItemsDb = {
    Get: async (collection, query) => DB.collection(collection).find(query).toArray(),
  
    Insert: async (collection, value) => DB.collection(collection).insertOne(value),
  
    InsertMany: async (collection, value) => DB.collection(collection).insertMany(value),
  
    Update: async (collection, query, value) => DB.collection(collection).updateOne(query, { $set: value }),
  
    DeleteOne: async (collection, query) => DB.collection(collection).deleteOne(query),
  
    Delete: async (collection, query) => DB.collection(collection).deleteMany(query),
};

function createItemsDb(collection) {
    return {
        Get: async (query) => ItemsDb.Get(collection, query),
        Insert: async (value) => ItemsDb.Insert(collection, value),
        InsertMany: async(value) => ItemsDb.InsertMany(collection, value),
        Update: async (query, value) => ItemsDb.Update(collection, query, value),
        DeleteOne: async (query) => ItemsDb.DeleteOne(collection, query),
        Delete: async (query) => ItemsDb.Delete(collection, query),
    };
}

const HeroesDb = createItemsDb("Heroes");

module.exports = {
    HeroesDb,
    setupDb
}