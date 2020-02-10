// Chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;
chai.use(chaiHttp);

// Server
const app = require("../api_docs_server")

// Sinon to Stub Tedious in MSSQL Service
const sinon = require("sinon");
const sqlService = require("../services/sqlService")

// Needed for Self-Signed Certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("SQL Server Database Endpoints", () => {
    describe("POST /db/:name - Create a Database", () => {
        let databaseToCreate = "testDatabase";

        let sqlCreateDatabaseStub;

        beforeEach(function() {
            sqlCreateDatabaseStub = sinon.stub(sqlService, "createDatabase");
        });

        afterEach(function() {
            sqlCreateDatabaseStub.restore();
        });

        it("should create a new database", (done) => {

            let expectedResult = `Successfully created ${databaseToCreate} database!`;

            sqlCreateDatabaseStub.withArgs(databaseToCreate).resolves(expectedResult);

            chai
            .request(app)
            .post(`/db/${databaseToCreate}`)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.any.keys("message")
                expect(res.body.message).to.include(`Successfully created ${databaseToCreate} database!`)
                done();
            });
        });
    });

    describe("POST /db/:name - Create a Database", () => {
        let databaseToCreate = "testDatabase";

        let sqlCreateDatabaseStub;

        beforeEach(function() {
            sqlCreateDatabaseStub = sinon.stub(sqlService, "createDatabase");
        });

        afterEach(function() {
            sqlCreateDatabaseStub.restore();
        });

        it("should return an error if database already exists", (done) => {

            let expectedResult = `Database '${databaseToCreate}' already exists. Choose a different database name.`;
            let httpStatusCode = {httpStatusCode: 500, message: expectedResult};
            sqlCreateDatabaseStub.withArgs(databaseToCreate).rejects(httpStatusCode);

            chai
            .request(app)
            .post(`/db/${databaseToCreate}`)
            .end((err, res) => {
                expect(res.status).to.equal(500);
                expect(res.body.message).to.include(expectedResult);
                done();
            });
        });
    });

    describe("DELETE /db/:name - Delete a Database", () => {
        let databaseToDelete = "testDatabase";

        let sqlDropDatabaseStub;

        beforeEach(function() {
            sqlDropDatabaseStub = sinon.stub(sqlService, "dropDatabase");
        });

        afterEach(function() {
            sqlDropDatabaseStub.restore();
        });

        it("should delete a database", (done) => {

            let expectedResult = `Successfully dropped ${databaseToDelete} database!`;
            sqlDropDatabaseStub.withArgs(databaseToDelete).resolves(expectedResult);

            chai
            .request(app)
            .del(`/db/${databaseToDelete}`)
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body.message).to.include(expectedResult);
                done();
            });
        });
    });

    describe("DELETE /db/:name - Delete a Database", () => {
        let databaseToDelete = "nullDatabase";

        let sqlDropDatabaseStub;

        beforeEach(function() {
            sqlDropDatabaseStub = sinon.stub(sqlService, "dropDatabase");
        });

        afterEach(function() {
            sqlDropDatabaseStub.restore();
        });

        it("should return an error if database does not exist", (done) => {

            let expectedResult = `Cannot drop the database '${databaseToDelete}', because it does not exist or you do not have permission.`;
            sqlDropDatabaseStub.withArgs(databaseToDelete).rejects({message: expectedResult});

            chai
            .request(app)
            .del(`/db/${databaseToDelete}`)
            .end((err, res) => {
                res.should.have.status(500);
                expect(res.body.message).to.include(expectedResult);
                done();
            });
        });
    });
});