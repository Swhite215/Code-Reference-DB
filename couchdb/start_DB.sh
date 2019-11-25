# Start a CouchDB container with exposed port
docker run -p 5984:5984 -d --name my-couchdb couchdb:latest

# Fauxton UI - localhost:5984/_utils/
