var sql = require("mssql");
const config = require("./config.json");

const createDatabase = async () => {
  try {
    let pool = await sql.connect(config);

    let query = `CREATE DATABASE characters`;

    let result = await pool.request().query(query);

    return true;
  } catch (e) {
    console.log(`Error Creating Database: ${e}`);
  }
};

const dropDatabase = async () => {
  try {
    let pool = await sql.connect(config);

    let query = `DROP DATABASE characters`;

    let result = await pool.request().query(query);

    return true;
  } catch (e) {
    console.log(`Error Dropping Database: ${e}`);
  }
};

const createTable = async (database) => {
  try {
    config.database = database;

    let pool = await sql.connect(config);

    let query = 'CREATE TABLE ##Persons ( PersonID int, LastName varchar(255), FirstName varchar(255), Address varchar(255), City varchar(255) )'

    let result = await pool.request().query(query, (err, results) => {
        console.log("TEST");
    });

    return true;
  } catch (e) {
    console.log(`Error Creating Table: ${e}`);
  }
};

const insertRecord = async(firstName, health, stamina, atk, canFight) => {
  try {
    config.database = "characters";

    let pool = await sql.connect(config);

    let query = 'INSERT INTO heroes (FirstName, Health, Stamina, Atk, CanFight) VALUES (@firstName, @health, @stamina, @atk, @canFight);'

    let result = await pool.request().input('firstname', sql.VarChar, firstName).input('health', sql.Int, health).input('stamina', sql.Int, stamina).input('atk', sql.Int, atk).input('canFight', sql.Bit, canFight).query(query);

    if (result.rowsAffected.length > 0) {
      return true;
    } else {
      return false;
    }

  } catch (e) {
    console.log(`Error Inserting Records: ${e}`);
  }
}

const selectAllRecords = async() => {
  try {
    config.database = "characters";

    let pool = await sql.connect(config);

    let query = 'SELECT * FROM heroes'

    let result = await pool.request().query(query);

    return result.recordset;
    
  } catch (e) {
    console.log(`Error Selecting Records: ${e}`);
  }
}

const updateRecordHealth = async(charID, health) => {
  try {
    config.database = "characters";

    let pool = await sql.connect(config);

    let query = 'UPDATE heroes SET health = @health WHERE char_id = @charID'

    let result = await pool.request().input("health", sql.Int, health).input("charID", sql.Int, charID).query(query);

    if (result.rowsAffected.length > 0) {
      return true;
    } else {
      return false;
    }
    
  } catch (e) {
    wconsole.log(`Error Updating Record: ${e}`);
  }
}

const deleteRecord = async(charID) => {
  try {
    config.database = "characters";

    let pool = await sql.connect(config);

    let query = 'DELETE FROM heroes WHERE char_id = @charID'

    let result = await pool.request().input("charID", sql.Int, charID).query(query);

    if (result.rowsAffected.length > 0) {
      return true;
    } else {
      return false;
    }
    
  } catch (e) {
    wconsole.log(`Error Deleting Record: ${e}`);
  }
}

module.exports = {
  createDatabase,
  dropDatabase,
  createTable,
  insertRecord,
  selectAllRecords,
  updateRecordHealth,
  deleteRecord
};
