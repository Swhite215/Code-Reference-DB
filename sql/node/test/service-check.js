const sqlService = require("../services/sql-service");

async function main() {
    try {
        // // Create Database
        // let createdDatabase = await sqlService.createDatabase();
        // console.log(`Created Database: ${createdDatabase}`);

        // // Create Table
        // let createdTable = await sqlService.createTable("characters");
        // console.log(`Created Table: ${createdTable}`);

        // // Drop Database
        // let droppedDatabase = await sqlService.dropDatabase();
        // console.log(`Dropped Database: ${droppedDatabase}`);

        // Insert Records
        let createdRecord = await sqlService.insertRecord("Joxos", 250, 150, 25, 1);
        console.log(`Created Recored: ${createdRecord}`);

        // Select Records
        let allRecords = await sqlService.selectAllRecords();
        for (let record of allRecords) {
            console.log(record);
        }

        // Update Record
        let updatedRecord = await sqlService.updateRecordHealth(1, 1000);
        console.log(`Updated Record ${updatedRecord}`);

        // Delete Record
        let deletedRecord = await sqlService.deleteRecord(1);
        console.log(`Deleted Record: ${deletedRecord}`);

    } catch(e) {
        console.log(`Error running service check: ${e}`);
    }
}

main();