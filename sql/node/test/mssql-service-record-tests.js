// Chai
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const assert = chai.assert;

// Sinon to Stub MSSQL in MSSQL Service
const sinon = require("sinon");
const sqlService = require("../services/sqlService");

describe("MSSQL Service Functions", function() {
    describe("MSSQL Record Operations", function() {
        describe("sqlService.insertRecord()", function() {

            let sqlInsertRecordStub;

            let rokh = {
                name: 'Rokh',
                health: 100,
                stamina: 125,
                atk: 35,
                canFight: 1
            }

            let expectedResult = `Successfully inserted ${rokh.name} into table!`

            beforeEach(function() {
                sqlInsertRecordStub = sinon.stub(sqlService, "insertRecord");
            });
            
            afterEach(function() {
                sqlInsertRecordStub.restore();
            });


            it("should be a function", function() {
                assert.isFunction(sqlService.insertRecord)
            });

            it("should insert a new record", function(done) {

                sqlInsertRecordStub.withArgs(rokh).resolves(expectedResult)

                sqlService.insertRecord(rokh).then((res) => {
                    expect(res).to.contain(`Successfully inserted ${rokh.name} into table!`)
                    done();
                });
            });
        });
    });
});

