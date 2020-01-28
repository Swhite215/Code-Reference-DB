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
        describe("sqlService.createDatabase()", function() {

            let databaseToCreate = "testDatabase";

            let sqlCreateDatabaseStub;

            let expectedResult = `Successfully created ${databaseToCreate} database!`;

            beforeEach(function() {
                sqlCreateDatabaseStub = sinon.stub(sqlService, "createDatabase");
            });

            afterEach(function() {
                sqlCreateDatabaseStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.createDatabase);
            });

            it("should create a new database", function(done) {

                sqlCreateDatabaseStub.withArgs(databaseToCreate).resolves(expectedResult);

                sqlService.createDatabase(databaseToCreate).then((res) => {
                    expect(res).to.equal(`Successfully created ${databaseToCreate} database!`);
                    done();
                });
            });
        });

        describe("sqlService.createDatabase()", function() {

            let databaseToCreate = "testDatabase";

            let sqlCreateDatabaseStub;

            let errorResult = `MSSQL Service Error creating database: RequestError: Database 'testDatabase' already exists. Choose a different database name.`;

            beforeEach(function() {
                sqlCreateDatabaseStub = sinon.stub(sqlService, "createDatabase");
            });

            afterEach(function() {
                sqlCreateDatabaseStub.restore();
            });


            it("should return an error if database already exists", function(done) {

                sqlCreateDatabaseStub.withArgs(databaseToCreate).throws("error", errorResult);

                try {
                    sqlService.createDatabase(databaseToCreate)
                } catch(e) {
                    expect(e.message).to.contain(`Database '${databaseToCreate}' already exists.`);
                    done();
                }
            });
        });
    });
});

