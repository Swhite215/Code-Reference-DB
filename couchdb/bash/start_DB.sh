# Start a CouchDB container with exposed port and bind mount
docker run -p 5984:5984 --mount type=bind,source=/tmp/couchdb/data,target=/opt/couchdb/data -d --name my-couchdb couchdb:latest

# Fauxton UI - localhost:5984/_utils/