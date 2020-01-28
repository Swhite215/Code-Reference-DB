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

            let tableToCreate = "testTable";

            let sqlCreateTableStub;

            let expectedResult = `RESULT: Successfully created ${tableToCreate} table!`;

            let errorResult = `MSSQL Service Error creating table: ${tableToCreate}`;

            beforeEach(function() {
                sqlCreateTableStub = sinon.stub(sqlService, "createTable");
            });

            afterEach(function() {
                sqlCreateTableStub.restore();
            })

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

            it("should return an error if table already exists", function(done) {
                
                sqlCreateTableStub.withArgs(tableToCreate).resolves(errorResult);

                sqlService.createTable(tableToCreate).then((res) => {
                    throw (res)
                }).catch((e) => {
                    expect(e).to.contain("MSSQL Service Error");
                    done();
                });
            });
        });
    });
});

