const sqlService = require("../services/sqlService");


sqlService.dropDatabase("testDatabase").then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e);
    console.log(e.message);
});