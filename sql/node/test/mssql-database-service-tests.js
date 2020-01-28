// Chai
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

// Sinon to Stub MSSQL in MSSQL Service
const sinon = require("sinon");
const sqlService = require("../services/sqlService");

describe("MSSQL Service Functions", function() {
    describe("MSSQL Database Operations", function() {
        describe("sqlService.createTable()", function() {
            it("should be a function", function() {
                assert.isFunction(sqlService.createTable);
            });
        });
    });
});

