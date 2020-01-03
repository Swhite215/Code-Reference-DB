// Chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;
chai.use(chaiHttp);

// Server
const app = require("../node/api_docs_server")

// Sinon to Stub Nano in CouchDB Service
const sinon = require("sinon");
const couchDBService = require("../node/services/couchdb")

// Needed for Self-Signed Certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("CouchDB Database Endpoints", () => {
    describe('GET /db/:name - Get a Specific Database', () => {

        let getDatabaseStub;

        beforeEach(function() {
            getDatabaseStub = sinon.stub(couchDBService, "getDatabase")
        });

        afterEach(function() {
            couchDBService.getDatabase.restore();
        })
    
    
        it('should return database name and document count', done => {


            assert.isFunction(couchDBService.getDatabase);
    
            let dbName = "heroes";
            let expectedRes = {
                db_name: dbName,
                doc_count: 12
            }
    
            getDatabaseStub.withArgs(dbName).resolves(expectedRes)
    
            chai
                .request(app)
                .get(`/db/${dbName}`)
                .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.include(expectedRes);
                done();
            });
        });
      });

      describe('GET /dbs - Get All Databases', () => {


        let getDatabasesStub;

        beforeEach(function() {
            getDatabasesStub = sinon.stub(couchDBService, "getDatabases")
        });

        afterEach(function() {
            getDatabasesStub.restore();
        });
    
    
        it('should return all databases on the server', done => {


            assert.isFunction(couchDBService.getDatabases);

            let expectedRes = ["database1", "database2", "database2"]
    
            getDatabasesStub.resolves(expectedRes)
    
            chai
                .request(app)
                .get(`/dbs`)
                .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.deep.equal(expectedRes);
                done();
            });
        });
      });

      describe('GET /db/change/:name - Get All Changes to a Database', () => {

        let getDatabaseChangesStub;

        beforeEach(function() {
            getDatabaseChangesStub = sinon.stub(couchDBService, "getDatabaseChanges")
        });

        afterEach(function() {
            getDatabaseChangesStub.restore();
        });
    
    
        it('should return all changes for a database', done => {

            assert.isFunction(couchDBService.getDatabaseChanges);

            let expectedRes = {results: [
                {"seq": "String", "id": "String", "changes": []}
            ]}
    
            let dbName = "heroes";

            getDatabaseChangesStub.withArgs(dbName).resolves(expectedRes)
    
            chai
                .request(app)
                .get(`/db/changes/${dbName}`)
                .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.any.keys("results")
                expect(res.body.results[0]).to.have.any.keys("seq", "id", "changes");
                done();
            });
        });
      });

      describe('POST /db/:name - Create a Database', () => {

        let createDatabaseStub;

        beforeEach(function() {
            createDatabaseStub = sinon.stub(couchDBService, "createDatabase")
        });

        afterEach(function() {
            createDatabaseStub.restore();
        });
    
    
        it('should create a new database', done => {

            assert.isFunction(couchDBService.createDatabase);

            let expectedRes = {"ok": true}
    
            let dbName = "test";

            createDatabaseStub.withArgs(dbName).resolves(expectedRes)
    
            chai
                .request(app)
                .post(`/db/${dbName}`)
                .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.any.keys("ok")
                expect(res.body.ok).to.be.true;
                done();
            });
        });
      });

      describe('DELETE /db/:name - Delete a Database', () => {

        let deleteDatabaseStub;

        beforeEach(function() {
            deleteDatabaseStub = sinon.stub(couchDBService, "deleteDatabase")
        });

        afterEach(function() {
            deleteDatabaseStub.restore();
        });
    
    
        it('should delete a database', done => {

            let expectedRes = {"ok": true}
    
            let dbName = "test";

            deleteDatabaseStub.withArgs(dbName).resolves(expectedRes)

           assert.isFunction(couchDBService.deleteDatabase);
    
            chai
                .request(app)
                .del(`/db/${dbName}`)
                .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.have.any.keys("ok")
                expect(res.body.ok).to.be.true;
                done();
            });
        });
      });
});
