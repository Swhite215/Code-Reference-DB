// Connect to Database
const conn = new Mongo();
const db = conn.getDB('Characters');

// Documents
let VIRILIUX = {"name": "Virilliux"}

let JOXOS = {"name": "Joxos", "health": 250, "stamina": 150, "atk":25, "items": ["Unity Stone"], "canFight": true}
let VI = {"name": "Vi", "health": 75, "mana": 150, "atk": 5, "magic": 25,"items": ["Tetrahedron", "Octahedron", "Cube", "Icosahedron"], "canFight": true, "canCast": true}
let ROKH_AEGIS = {"name": "Rokh", "health": 100, "stamina": 125, "atk":35, "items": ["Aegis Core"], "canFight": true, "canSteal": true}
let TRANQUILITY = {"name": "Tranquility", "health": 125, "stamina": 100, "atk":20, "items": ["Serenity Key"], "canFight": true}
let BEATRIX_EMORY = {"name": "Beatrix", "health": 125, "mana": 125, "atk":15, "magic": 20, "items": ["Emory Mantle"], "canFight": true, "canCast": true, "canHeal": true}
let INFERNO_FLARE = {"name": "Inferno", "health": 150, "stamina": 75, "atk":40, "items": ["Blazing Blade"], "canFight": true, "canCast": true}

let heroesArray = [];

heroesArray.push(JOXOS, VI, ROKH_AEGIS, TRANQUILITY, BEATRIX_EMORY, INFERNO_FLARE);

// Create Single Document
db.Villians.insertOne(VIRILIUX)

// Create Multiple Documents
db.Heroes.insertMany(heroesArray)