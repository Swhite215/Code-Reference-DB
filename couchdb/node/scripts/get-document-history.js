const axios = require("axios");

let database = "heroes"
let allDocumentsURL = `http://localhost:5984/${database}/_all_docs`;
let documentBaseURL = `http://localhost:5984/${database}/`;
let revQuery = "?revs=true";

(async function main() {

    try {
        // HTTP GET Request for All Documents in CouchDB Database
        let response = await axios.get(allDocumentsURL);

        //All Documents in CouchDB Database
        let documentArray = response.data.rows;

        //Collect Document ID and Key
        let documentIDArray = [];

        for (let document of documentArray) {
            documentIDArray.push({
                id: document.id,
                key: document.key
            });
        }

        //Get Full Document Revisions List
        let fullDocumentRevArray = {};

        for (let document of documentIDArray) {
            let documentRevIDsArray = await getDocumentRevisionList(document);
            let partialDocumentRevArray = await buildRevisionList(documentRevIDsArray)
    
            fullDocumentRevArray[document.id] = partialDocumentRevArray;
        }

        // Get Every Document Sorted Latest to Earliest
        let allDocuments = await gatherAllDocuments(fullDocumentRevArray);

        console.log(allDocuments[0].documents);

    } catch(e) {
        console.log("Error retrieving all documents: ", e);
    }

}())

// Function to Get All Partial Revision IDs for a Document
async function getDocumentRevisionList(document) {
    try {
        let response = await axios.get(documentBaseURL + document.id + revQuery);
        let documentRevIDsArray = response.data._revisions;
        return documentRevIDsArray;

    } catch(e) {
        console.log("Error retrieving document: ", e);
    }
}

// Function to Get All Full Revision IDs for a Document
async function buildRevisionList(documentRevIDsArray) {

    let partialDocumentRevArray = [];
    let startRevNum = documentRevIDsArray.start;
    let docCounter = 0;

    for (let i = startRevNum; i >= 1; i--) {
        partialDocumentRevArray.push(i + "-" + documentRevIDsArray.ids[docCounter]);
        docCounter++;
    }

    return partialDocumentRevArray;
}

// Function to Get All Documents of All Revisions
async function gatherAllDocuments(fullDocumentRevArray) {
    let allDocuments = [];

    let documentIDs = Object.keys(fullDocumentRevArray);

    for (let documentID of documentIDs) {
        let documentData  = {
            id: documentID,
            documents: []
        }

        for (let rev of fullDocumentRevArray[documentID]) {
            let documentRevURL = documentBaseURL + documentID + "?rev=" + rev;
            let document = await axios.get(documentRevURL);
            documentData.documents.push(document.data);
        }

        allDocuments.push(documentData);
    }

    return allDocuments;
}