const sqlService = require("../services/sqlService");


sqlService.selectAllRecords("heroes").then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e);
    console.log(e.message);
});