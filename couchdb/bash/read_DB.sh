# Get CouchDB Information
echo "curl 'http://admin:password@localhost:5984'"
curl 'http://admin:password@localhost:5984'

echo "curl -X GET 'http://admin:password@localhost:5984'" 
curl -X GET 'http://admin:password@localhost:5984'

# Get All Server Databases
echo "curl -X GET 'http://admin:password@localhost:5984/_all_dbs'" 
curl -X GET 'http://admin:password@localhost:5984/_all_dbs'

# Get Database Information
echo "curl -X GET 'http://admin:password@localhost:5984/heroes'" 
curl -X GET 'http://admin:password@localhost:5984/heroes'

echo "curl -I HEAD 'http://admin:password@localhost:5984/heroes'" 
curl -I HEAD 'http://admin:password@localhost:5984/heroes'

# Get All Documents in Database
echo "curl -X GET 'http://admin:password@localhost:5984/heroes/_all_docs'" 
curl -X GET 'http://admin:password@localhost:5984/heroes/_all_docs'

# Find All Documents that Satisfy Parameters
echo "curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes/_find' -d {JSON}"
curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes/_find' -d '{"selector": {"name": { "$gt": "0" }}, "fields": ["name", "health"], "limit": 20}'

# Find All Document Changes
echo "curl -X GET 'http://admin:password@localhost:5984/heroes/_changes'" 
curl -X GET 'http://admin:password@localhost:5984/heroes/_changes'
