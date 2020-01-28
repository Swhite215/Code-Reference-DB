const Connection = require('tedious').Connection;
const Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

const config = require('./config')

const createTable = async (tableToCreate) => {

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


module.exports = {
    createTable
};