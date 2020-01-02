const nano = require("nano")('http://localhost:5984')

const getDatabase = async (name) => {
    const db = nano.use(name);

    try {
        let infoDB = await db.info();
        return infoDB
    } catch(e) {
        console.log(`Error getting Database: ${e}`)
        throw(e)
    }
}

module.exports = {getDatabase}