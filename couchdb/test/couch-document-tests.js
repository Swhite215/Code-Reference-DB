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

describe("CouchDB Document Endpoints", function() {
    describe("GET /db/:db/document/:id - Get a Specific Document", function() {
        
        let db = "heroes";
        let documentID = "JOXOS";

        // Step Three - Mock
        let getDocumentStub;

        let expectedRes = { _id: 'Document ID',
        _rev: 'Current Document Revision Number',
        parameter: 'Parameters - Int, String, Bool, Array, Obj, Etc.' }

        beforeEach(function() {
            getDocumentStub = sinon.stub(couchDBService, "getDocument");
        });

        afterEach(function() {
            getDocumentStub.restore();
        })

        // Step One - Service Function
        it("should be a function that returns a document object", function(done) {
            assert.isFunction(couchDBService.getDocument)

            getDocumentStub.withArgs(db, documentID).resolves(expectedRes)

            couchDBService.getDocument(db, documentID).then((value) => {
                console.log(value)
                expect(value).to.have.any.keys("_id", "_rev");
                done();
            }).catch(err => console.log);

        });

        // Step Two - Endpoint
        it("should be a endpoint that returns a document object", function(done) {

            getDocumentStub.withArgs(db, documentID).resolves(expectedRes)

            chai
                .request(app)
                .get(`/db/${db}/document/${documentID}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body).to.have.any.keys("_id", "_rev");
                    done();
                })
        });
    });
});