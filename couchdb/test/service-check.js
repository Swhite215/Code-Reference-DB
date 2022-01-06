const couchDBService = require("../node/services/couchdb");

async function main() {
  try {
    // Create Database
    let createdDatabase = await couchDBService.createDatabase("heroes");
    console.log(`Created Database Heroes: ${createdDatabase.ok}`);

    // Get Database
    let database = await couchDBService.getDatabase("heroes");
    console.log("Retrieved Database");
    console.log(database);

    // Get Databases
    let databases = await couchDBService.getDatabases();
    console.log("Retrieved Database List");
    console.log(databases);

    // Create Document
    let document = {
      name: "Tranquility",
      health: 125,
      stamina: 100,
      atk: 20,
      items: ["SerenityKey"],
      canFight: true,
      canHeal: true,
    };
    let documentId = "Tranquility";
    let createdDocument = await couchDBService.createDocument(
      "heroes",
      document,
      documentId
    );
    console.log(`Created Document: ${createdDocument.ok}`);

    // Get Document
    let documentObj = await couchDBService.getDocument("heroes", documentId);
    console.log(`Retrieved Document`);
    console.log(documentObj);

    // Query Documents
    let query = {
      selector: { name: { $gt: "0" } },
      fields: ["name", "health", "canFight"],
      limit: 20,
    };
    let documents = await couchDBService.queryDocuments("heroes", query);
    console.log("Retrieved Documents");
    for (let document of documents.docs) {
        console.log(document);
    }

    // Delete Document
    let deletedDocument = await couchDBService.deleteDocument("heroes", documentId);
    console.log(`Deleted Document Tranquility: ${deletedDocument.ok}`);

    // Get Database Changes
    let databaseChanges = await couchDBService.getDatabaseChanges("heroes");
    console.log("Retrieved Database Changes");
    console.log(databaseChanges);

    // Delete Database
    let deletedDatabase = await couchDBService.deleteDatabase("heroes");
    console.log(`Deleted Database Heroes: ${deletedDatabase.ok}`);
    
  } catch (e) {
    console.log(`Error executing couchdb service check: ${e}`);
  }
}

main();
