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

            let expectedResult = `Successfully created ${tableToCreate} table!`;

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
                    expect(res).to.equal(`Successfully created ${tableToCreate} table!`);
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

        describe("sqlService.dropTable()", function() {

            let tableToDelete = "testTable";

            let sqlDropTableStub;

            let expectedResult = `Successfully deleted ${tableToDelete} table!`;

            beforeEach(function() {
                sqlDropTableStub = sinon.stub(sqlService, "dropTable");
            });

            afterEach(function() {
                sqlDropTableStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.dropTable);
            });

            it("should drop a table", function(done) {

                sqlDropTableStub.withArgs(tableToDelete).resolves(expectedResult);

                sqlService.dropTable(tableToDelete).then((res) => {
                    expect(res).to.equal(`Successfully deleted ${tableToDelete} table!`);
                    done();
                });
            });
        });

        describe("sqlService.dropTable()", function() {
            let tableToDelete = "testTable";

            let sqlDropTableStub;

            let errorResult = `Cannot drop the table '${tableToDelete}'`;

            beforeEach(function() {
                sqlDropTableStub = sinon.stub(sqlService, "dropTable");
            });

            afterEach(function() {
                sqlDropTableStub.restore();
            });

            it("should return an error if table does not exist", async function() {

                sqlDropTableStub.withArgs(tableToDelete).throws("error", errorResult);

                try {
                    let result = await sqlService.dropTable(tableToDelete);                    
                } catch(e) {
                    expect(e.message).to.contain(`Cannot drop the table '${tableToDelete}'`);
                }

            });
        });

        describe("sqlService.queryTables()", function() {

            let expectedResult = ["heroes", "villians"];

            let sqlQueryTablesStub;

            beforeEach(function() {
                sqlQueryTablesStub = sinon.stub(sqlService, "queryTables");
            });

            afterEach(function() {
                sqlQueryTablesStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.queryTables);
            });

            it("should return an array of tables", function(done) {

                sqlQueryTablesStub.resolves(expectedResult);

                sqlService.queryTables().then((res) => {
                    expect(res).to.be.a("array");
                    expect(res).to.deep.equal(expectedResult);
                    done();
                });
            });
        });

        describe("sqlService.queryTables()", function() {

            let sqlQueryTablesStub;

            beforeEach(function() {
                sqlQueryTablesStub = sinon.stub(sqlService, "queryTables");
            });

            afterEach(function() {
                sqlQueryTablesStub.restore();
            });

            it("should return an empty array if database has no tables", function(done) {

                sqlQueryTablesStub.resolves([]);

                sqlService.queryTables().then((res) => {
                    expect(res).to.be.a("array");
                    expect(res).to.be.empty;
                    done();
                });
            });
        });
    });
});

