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

        describe("sqlService.dropDatabase()", function() {

            let databaseToDelete = "testDatabase";

            let sqlDropDatabaseStub;

            let expectedResult = `Successfully dropped ${databaseToDelete} database!`;

            beforeEach(function() {
                sqlDropDatabaseStub = sinon.stub(sqlService, "dropDatabase");
            });

            afterEach(function() {
                sqlDropDatabaseStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.dropDatabase);
            });

            it("should drop a database", function(done) {

                sqlDropDatabaseStub.withArgs(databaseToDelete).resolves(expectedResult);

                sqlService.dropDatabase(databaseToDelete).then((res) => {
                    expect(res).to.contain(`Successfully dropped ${databaseToDelete} database!`);
                    done();
                });
            });
        });

        describe("sqlService.dropDatabase()", function() {
            let databaseToDelete = "testDatabase";

            let sqlDropDatabaseStub;

            let errorResult = `MSSQL Service Error dropping database: RequestError: Cannot drop the database 'testDatabase', because it does not exist or you do not have permission.`;

            beforeEach(function() {
                sqlDropDatabaseStub = sinon.stub(sqlService, "dropDatabase");
            });

            afterEach(function() {
                sqlDropDatabaseStub.restore();
            });

            it("should return an error if database does not exist", function(done) {

                sqlDropDatabaseStub.withArgs(databaseToDelete).rejects("error", errorResult);

                sqlService.dropDatabase(databaseToDelete).catch((e) => {
                    expect(e.message).to.contain(`Cannot drop the database '${databaseToDelete}'`)
                    done();
                });
            });
        });

        describe("sqlService.queryDatabases()", function() {

            let sqlQueryDatabasesStub;

            let expectedResult = ["database1", "database2", "database3"];

            beforeEach(function() {
                sqlQueryDatabasesStub = sinon.stub(sqlService, "dropDatabase");
            });

            afterEach(function() {
                sqlQueryDatabasesStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.queryDatabases);
            });

            it("should return an array of databases", function(done) {

                sqlQueryDatabasesStub.resolves(expectedResult);

                sqlService.queryDatabases().then((res) => {
                    expect(res).to.be.a("array");
                    expect(res.length).to.be.greaterThan(0);
                    done();
                });

            });
        });

    });
});

