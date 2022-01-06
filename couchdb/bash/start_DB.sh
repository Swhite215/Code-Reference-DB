mkdir /tmp/couchdb
mkdir /tmp/couchdb/data

# Start a CouchDB container with exposed port and bind mount
docker run -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password --mount type=bind,source=/tmp/couchdb/data,target=/opt/couchdb/data -d --name my-couchdb couchdb:latest

# Fauxton UI - localhost:5984/_utils/