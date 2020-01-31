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

const dropDatabase = (databaseToDelete) => {

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err);
            }
    
            let query = `DROP DATABASE ${databaseToDelete}`;
    
            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error dropping database: ${err}`)
                    reject(err);
                } else {
                    resolve(`Successfully dropped ${databaseToDelete} database!`);
                }
            });
        
            connection.execSql(request);
    
        });
    });
}

const queryDatabases = () => {

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err)
            }

            let query = `SELECT name FROM sys.databases`
            let results = [];

            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error retrieving databases.`)
                    reject(err)
                } else {
                    resolve(`Successfully retrieved all databases on server!`);
                }
            });

            request.on('row', columns => {

                columns.forEach(column => {

                    if (column.metadata.colName == "name") {
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

const insertRecord = (heroObject) => {

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err);
            }
    
            let query = `INSERT INTO heroes (FirstName, Health, Stamina, Atk, CanFight) VALUES (@name, @health, @stamina, @atk, @canFight)`;
    
            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error inserting record: ${err}`)
                    reject(err);
                } else {
                    resolve(`Successfully inserted ${heroObject.name} into table!`);
                }
            });
            
            request.addParameter('name', TYPES.VarChar, heroObject.name);
            request.addParameter('health', TYPES.Int, heroObject.health);
            request.addParameter('stamina', TYPES.Int, heroObject.stamina);
            request.addParameter('atk', TYPES.Int, heroObject.atk);
            request.addParameter('canFight', TYPES.Bit, heroObject.canFight);
        
            connection.execSql(request);
    
        });
    });
}

const deleteRecord = (hero) => {

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err)
            }

            let query = 'DELETE FROM heroes WHERE FirstName=@name'

            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error deleting record: ${err}`)
                    reject(err)
                } else {
                    resolve(`Successfully deleted ${hero} record!`);
                }
            });

            request.addParameter('name', TYPES.VarChar, hero);

            connection.execSql(request);
        });

    });
}

const updateRecord = (id, heroObject) => {

    // Dynamic Creation of Update Query
    let tableParameters = ["FirstName", "Health", "Stamina", "Atk", "CanFight"]
    let parametersToUpdate = Object.keys(heroObject)

    let parametersWithValues = [];

    for (let parameter of tableParameters) {
        for (let updateParam of parametersToUpdate) {
            if (parameter.toLowerCase().indexOf(updateParam.toLowerCase()) > -1) {
                parametersWithValues.push(parameter);
            }
        }
    }

    let query = 'UPDATE heroes SET ';

    for (var i = 0; i < parametersWithValues.length; i++) {
        if (i == parametersWithValues.length - 1) {
            query = query + `${parametersWithValues[i]} = @${parametersWithValues[i].toLowerCase()} `
        } else {
            query = query + `${parametersWithValues[i]} = @${parametersWithValues[i].toLowerCase()}, `
        }
    }

    query = query + "WHERE FirstName = @firstname"

    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err)
            }

            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error updating record: ${err}`)
                    reject(err)
                } else {
                    resolve(`Successfully updated ${id} record!`);
                }
            });

            request.addParameter('firstname', TYPES.VarChar, heroObject.firstname);
            request.addParameter('health', TYPES.Int, heroObject.health);
            request.addParameter('stamina', TYPES.Int, heroObject.stamina);
            request.addParameter('atk', TYPES.Int, heroObject.atk);
            request.addParameter('canFight', TYPES.Bit, heroObject.canfight);

            connection.execSql(request);
        });

    });
}

const selectAllRecords = (table) => {
    const connection = new Connection(config);

    return new Promise((resolve, reject) => {
        connection.on('connect', function(err) {
            if (err) {
                console.log(`MSSQL Service Error connecting: ${err}`)
                reject(err)
            }

            let query = `SELECT * FROM ${table}`
            let results = [];

            let request = new Request(query, function(err) {
                if (err) {
                    console.log(`MSSQL Service Error retrieving tables: ${err}`)
                    reject(err)
                } else {
                    resolve(`Successfully retrieved all records in database!`);
                }
            });

            request.on('row', columns => {

                let heroObject = {}

                columns.forEach(column => {
                    heroObject[column.metadata.colName] = column.value;
                });

                results.push(heroObject)

            });

            request.on('doneProc', (rowCount, more) => {

                if (results.length > 0) {
                    resolve(results)
                } else {
                    reject(new Error("No matching records!"))
                }
                
            });

            connection.execSql(request);
        });
    });
}

module.exports = {
    createDatabase,
    dropDatabase,
    queryDatabases,
    createTable,
    dropTable,
    queryTables,
    insertRecord,
    deleteRecord,
    updateRecord,
    selectAllRecords
};