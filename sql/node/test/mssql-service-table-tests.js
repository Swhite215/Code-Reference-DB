// Chai
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

// Sinon to Stub MSSQL in MSSQL Service
const sinon = require("sinon");
const sqlService = require("../services/sqlService");

describe("MSSQL Service Functions", function() {
    describe("MSSQL Table Operations", function() {
        describe("sqlService.createTable()", function() {

            let tableToCreate = "testTable";

            let sqlCreateTableStub;

            let expectedResult = `RESULT: Successfully created ${tableToCreate} table!`;

            beforeEach(function() {
                sqlCreateTableStub = sinon.stub(sqlService, "createTable");
            });

            afterEach(function() {
                sqlCreateTableStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.createTable);
            });

            it("should create a new table", function(done) {

                sqlCreateTableStub.withArgs(tableToCreate).resolves(expectedResult);

                sqlService.createTable(tableToCreate).then((res) => {
                    expect(res).to.contain("RESULT: Successfully created");
                    done();
                });
            });
        });

        describe("sqlService.createTable()", function() {

            let tableToCreate = "testTable";

            let sqlCreateTableStub;

            let errorResult = `There is already an object named '${tableToCreate}'`;

            beforeEach(function() {
                sqlCreateTableStub = sinon.stub(sqlService, "createTable");
            });

            afterEach(function() {
                sqlCreateTableStub.restore();
            });

            it("should return an error if table already exists", function(done) {

                sqlCreateTableStub.withArgs(tableToCreate).throws("error", errorResult)

                try {
                    sqlService.createTable(tableToCreate)
                } catch(e) {
                    expect(e.message).to.contain(`There is already an object named '${tableToCreate}'`);
                    done();
                }

            });
        });
    });
});

