const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../node/api_docs_server');

// Assertions
const expect = chai.expect;
const should = chai.should();

// Sinon to Stub Nano in CouchDB Service
const sinon = require("sinon");
const couchDBService = require("../node/services/couchdb")

// Needed for Self-Signed Certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("CouchDB Database Endpoints", () => {
    describe('GET /db/:name - Get a Specific Database', () => {

        afterEach(function() {
            couchDBService.getDatabase.restore();
        })
    
    
        it('should return database name and document count', done => {
    
            let dbName = "heroes";
            let expectedRes = {
                db_name: dbName,
                doc_count: 12
            }
    
            sinon.stub(couchDBService, "getDatabase").withArgs(dbName).resolves(expectedRes)
    
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

        afterEach(function() {
            couchDBService.getDatabases.restore();
        });
    
    
        it('should return all databases on the server', done => {

            let expectedRes = ["database1", "database2", "database2"]
    
            sinon.stub(couchDBService, "getDatabases").resolves(expectedRes)
    
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
});
