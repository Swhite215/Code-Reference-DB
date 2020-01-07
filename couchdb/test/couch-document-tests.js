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

    describe("GET /db/:db/query/document - Get documents that meet search criteria", function() {

        let db = "heroes";

        let testQuery = {
            selector: {
                name: {"$eq": "Joxos"},
                stamina: {"$gt": 125}
            },
            fields: ["name", "health", "stamina", "atk", "items"],
            limit: 100
        }

        let emptyQuery = {
            selector: {
                name: {"$eq": "Titan"}
            },
            fields: ["name", "health", "stamina", "atk", "items"],
            limit: 1
        }

        let queryDocumentsStub;

        let expectedResult = {
            docs: [{"name": "Joxos"}],
            bookmark: "TEST BOOKMARK"
        }

        let expectedEmptyResult = {
            docs: [],
            bookmark: "TEST BOOKMARK" 
        }

        beforeEach(function() {
            queryDocumentsStub = sinon.stub(couchDBService, "queryDocuments");
        });

        afterEach(function() {
            queryDocumentsStub.restore();
        })

        it("should use a function named queryDocuments", function() {
            assert.isFunction(couchDBService.queryDocuments);
        });

        it("queryDocuments should return an object with matching documents", function(done) {

            queryDocumentsStub.withArgs(db, testQuery).resolves(expectedResult);

            couchDBService.queryDocuments(db, testQuery).then((value) => {
                expect(value).to.have.any.keys("docs", "bookmark");
                expect(value.docs).to.be.a("array");
                expect(value.docs.length).to.be.above(0);
                done();
            });
        });

        it("queryDocuments should return an object with no documents if none match criteria", function(done) {
            
            queryDocumentsStub.withArgs(db, emptyQuery).resolves(expectedEmptyResult);

            couchDBService.queryDocuments(db, emptyQuery).then((value) => {
                expect(value).to.have.any.keys("docs", "bookmark");
                expect(value.docs).to.be.a("array");
                expect(value.docs.length).to.equal(0);
                done();
            }).catch(err => console.log);
        });

        it("should be an endpoint that returns documents that meet search criteria", function(done) {

            queryDocumentsStub.withArgs(db, testQuery).resolves(expectedResult);

            chai
                .request(app)
                .get(`/db/${db}/query/document`)
                .send(testQuery)
                .end((err, res) => {
                    res.should.have.status(200)
                    expect(res.body).to.have.any.keys("docs", "bookmark");
                    expect(res.body.docs).to.be.a("array")
                    expect(res.body.docs.length).to.be.above(0);
                    done();
                })
        });
    });

    describe("POST /db/:db/document/:id - Creates a document", function() {

        let db = "heroes";
        let documentID = "ARMADIAS_REED_" + Math.floor(Math.random() * 100);
        let documentBody = {"name": "Armadias", "health": 200, "stamina": 125, "atk":20, "items": ["Ceaseless Protection Shield", "Reed's Harness", "Air'Go Sword"], "canFight": true, "canHeal": true}
        let documentIDNew = documentID + "_" + Math.floor(Math.random() * 100);

        let createDocumentStub;

        let expectedResult = {
            ok: "OK",
            id: "Document ID",
            _rev: "Document Revision Number"
        }

        let errorResult = {
            reason: "CouchDB Service Error creating Document: Error: Document update conflict."
        }

        beforeEach(function() {
            createDocumentStub = sinon.stub(couchDBService, "createDocument");
        });

        afterEach(function() {
            createDocumentStub.restore();
        });

        it("should use a function called createDocument", function() {
            assert.isFunction(couchDBService.createDocument);
        });

        it("createDocument should create a document", function(done) {

            createDocumentStub.withArgs(db, documentBody, documentID).resolves(expectedResult);

            couchDBService.createDocument(db, documentBody, documentID).then((value) => {
                expect(value).to.have.any.keys("ok", "id", "_rev");
                done();
            }).catch(err => console.log);
        });

        it("createDocument should return an error if document already exists", function(done) {
            
            createDocumentStub.withArgs(db, documentBody, documentID).resolves(errorResult)

            couchDBService.createDocument(db, documentBody, documentID).then((value) => {
                throw(value)
            }).catch((err) => {
                expect(err.reason).to.include("Document update conflict");
                done();
            });
        });

        it("should be an endpoint that creates a new document", function(done) {

            createDocumentStub.withArgs(db, documentBody, documentID).resolves(expectedResult);

            chai
                .request(app)
                .post(`/db/${db}/document/${documentID}`)
                .send(documentBody)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.any.keys("ok", "id", "_rev");
                    done();
                });
        });
    });

    describe("DELETE /db/:db/document/:id - Deletes a document", function() {

        let db = "heroes";
        let documentID = "ARMADIAS_REED_54";
        let nonExistentID = "INVALID DOCUMENT ID";

        let expectedResult = {
            "ok": "OK",
            "id": "DOCUMENT ID",
            "_rev": "DOCUMENT REVISION NUMBER"
        }

        let errorResult = {
            reason: "missing"
        }

        let deleteDocumentStub;

        beforeEach(function() {
            deleteDocumentStub = sinon.stub(couchDBService, "deleteDocument");
        });

        afterEach(function() {
            deleteDocumentStub.restore();
        });
       
        it("should use a function called deleteDocument", function() {
            assert.isFunction(couchDBService.deleteDocument);
        });

        it("deleteDocument should delete a document", function(done) {

            deleteDocumentStub.withArgs(db, documentID).resolves(expectedResult);

            couchDBService.deleteDocument(db, documentID).then((value) => {
                expect(value).to.have.any.keys("ok", "id", "_rev");
                done();
            }).catch(err => console.log);
        });

        it("deleteDocument should return an error if document doesn't exist", function(done) {

            deleteDocumentStub.withArgs(db, nonExistentID).resolves(errorResult);

            couchDBService.deleteDocument(db, nonExistentID).then((value) => {
                throw(value)
            }).catch((err) => {
                expect(err.reason).to.include("missing");
                done();
            });
        });

        it("should be an endpoint that deletes a document", function(done) {

            deleteDocumentStub.withArgs(db, documentID).resolves(expectedResult);

            chai
                .request(app)
                .del(`/db/${db}/document/${documentID}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.any.keys("ok", "id", "_rev");
                    done();
                });
        })
    });
});