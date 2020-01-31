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

        describe("sqlService.deleteRecord()", function() {

            let hero = "Test"

            let expectedResult = `Successfully deleted ${hero} record!`

            let sqlDeleteRecordStub;

            beforeEach(function() {
                sqlDeleteRecordStub = sinon.stub(sqlService, "deleteRecord");
            });
            
            afterEach(function() {
                sqlDeleteRecordStub.restore();
            });
            

            it("should be a function", function() {
                assert.isFunction(sqlService.deleteRecord);
            });

            it("should delete a record", function(done) {

                sqlDeleteRecordStub.withArgs(hero).resolves(expectedResult);
                
                sqlService.deleteRecord(hero).then((res) => {
                    expect(res).to.contain(`Successfully deleted ${hero} record!`)
                    done();
                });
            });
        });

        describe("sqlService.updateRecord()", function() {

            let id = "Rokh";

            let rokh = {
                firstname: 'Rokh',
                health: 1000,
                stamina: 400,
                atk: 98,
                canfight: 1
            }

            let expectedResult = `Successfully updated ${id} record!`

            let sqlUpdateRecordStub;

            beforeEach(function() {
                sqlUpdateRecordStub = sinon.stub(sqlService, "updateRecord");
            });
            
            afterEach(function() {
                sqlUpdateRecordStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.updateRecord)
            });

            it("should update a record", function(done) {

                sqlUpdateRecordStub.withArgs(id, rokh).resolves(expectedResult);

                sqlService.updateRecord(id, rokh).then((res) => {
                    expect(res).to.contain(`Successfully updated ${id} record!`);
                    done();
                });
            })
        });

        describe("sqlService.selectAllRecords()", function() {

            let sqlSelectAllRecordsStub;

            beforeEach(function() {
                sqlSelectAllRecordsStub = sinon.stub(sqlService, "selectAllRecords");
            });
            
            afterEach(function() {
                sqlSelectAllRecordsStub.restore();
            });

            it("should be a function", function() {
                assert.isFunction(sqlService.selectAllRecords);
            });

            it("should select and return all records", function(done) {

                sqlSelectAllRecordsStub.withArgs("heroes").resolves([{}, {}, {}])

                sqlService.selectAllRecords("heroes").then((res) => {
                    expect(res).to.be.a("array");
                    done()
                });
            });

            it("should return an error if table does not exist", function(done) {

                sqlSelectAllRecordsStub.withArgs("test").rejects("error", "Invalid object name 'test'.")

                sqlService.selectAllRecords("test").catch((e) => {
                    expect(e.message).to.contain("Invalid object name");
                    done()
                });
            });

        });
    });
});

