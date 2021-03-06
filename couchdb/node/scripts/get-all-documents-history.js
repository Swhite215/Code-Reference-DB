const axios = require("axios");

let database = process.argv[2];

if (!process.argv[2]) {
    throw new Error("Missing required CLI arguments...");
}

let documentBaseURL = `http://localhost:5984/${database}/`;
let revQuery = "?revs=true";
let allDocPath = "_all_docs";

(async function main() {

    try {
        // HTTP GET Request for All Documents in CouchDB Database
        let response = await axios.get(documentBaseURL + allDocPath);

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
            let documentRevArray = await buildRevisionList(documentRevIDsArray)
    
            fullDocumentRevArray[document.id] = documentRevArray;
        }

        // Get Every Document Sorted Latest to Earliest
        let allDocuments = await gatherAllDocuments(fullDocumentRevArray);

        // Log the Results
        for (let documentGroup of allDocuments) {
            console.log(`Document ${documentGroup.id} has ${documentGroup.documents.length} versions:`);

            for (var i = 0; i < documentGroup.documents.length; i++) {
                console.group();
                console.log(documentGroup.documents[i]);
                console.groupEnd();
            }
        }

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
        console.log("Error getting partial document revision list: ", e);
    }
}

// Function to Get All Full Revision IDs for a Document
async function buildRevisionList(documentRevIDsArray) {

    let documentRevArray = [];
    let startRevNum = documentRevIDsArray.start;
    let docCounter = 0;

    for (let i = startRevNum; i >= 1; i--) {
        documentRevArray.push(i + "-" + documentRevIDsArray.ids[docCounter]);
        docCounter++;
    }

    return documentRevArray;
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

            try {
                let document = await axios.get(documentRevURL);
                documentData.documents.push(document.data);
            } catch(e) {
                console.log("Error getting full document revision list: ", e);
            }
        }

        allDocuments.push(documentData);
    }

    return allDocuments;
}