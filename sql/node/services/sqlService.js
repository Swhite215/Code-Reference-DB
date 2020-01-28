const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

const config = require('./config')

const createDatabase = (databaseToCreate) => {

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err);
            }
    
            let query = `CREATE DATABASE ${databaseToCreate}`;
    
            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error creating database: ${err}`)
                    reject(err);
                } else {
                    resolve(`Successfully created ${databaseToCreate} database!`);
                }
            });
        
            connection.execSql(request);
    
        });
    });
}

const createTable = (tableToCreate) => {

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err);
            }
    
            let query = `CREATE TABLE ${tableToCreate} ( char_id INT NOT NULL IDENTITY(1,1) PRIMARY KEY, FirstName varchar(255) NOT NULL, Health int NOT NULL, Stamina int NULL, Mana int NULL, Atk int NULL, Magic int NULL, CanFight bit NULL, CanSteal bit NULL, CanHeal bit NULL, CanCast bit NULL)`;
    
            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error creating table: ${err}`)
                    reject(err);
                } else {
                    resolve(`Successfully created ${tableToCreate} table!`);
                }
            });
        
            connection.execSql(request);
    
        });
    });


}

const dropTable = (tableToDelete) => {
    
    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err)
            }

            let query = `DROP Table ${tableToDelete}`

            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error dropping table: ${err}`)
                    reject(err)
                } else {
                    resolve(`Successfully deleted ${tableToDelete} table!`);
                }
            });

            connection.execSql(request);
        });

    });
}

const queryTables = async () => {

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err)
            }

            let query = `SELECT * FROM INFORMATION_SCHEMA.TABLES`
            let results = [];

            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error retrieving tables.`)
                    reject(err)
                } else {
                    resolve(`Successfully retrieved all tables in database!`);
                }
            });

            request.on('row', columns => {

                columns.forEach(column => {

                    if (column.metadata.colName == "TABLE_NAME") {
                        results.push(column.value);
                    }

                });

            });

            request.on('doneProc', (rowCount, more) => {

                resolve(results);
            });

            connection.execSql(request);
        });
    });
}


module.exports = {
    createDatabase,
    createTable,
    dropTable,
    queryTables
};