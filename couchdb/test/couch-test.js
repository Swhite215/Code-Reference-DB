const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../node/api_docs_server');

const expect = chai.expect;
const should = chai.should();

const sinon = require("sinon");
const couchDBService = require("../node/services/couchdb")

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('GET /db/:name', () => {

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
            console.log(err)
            console.log(res)
            res.should.have.status(200);
            expect(res.body).to.include(expectedRes);
            done();
        });
    });
  });