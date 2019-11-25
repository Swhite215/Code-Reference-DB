# Get CouchDB Information
echo "curl 'http://localhost:5984'"
curl 'http://localhost:5984'

echo "curl -X GET 'http://localhost:5984'" 
curl -X GET 'http://localhost:5984'

# Get Database Information
echo "curl -X GET 'http://localhost:5984/heroes'" 
curl -X GET 'http://localhost:5984/heroes'

echo "curl -I HEAD 'http://localhost:5984/heroes'" 
curl -I HEAD 'http://localhost:5984/heroes'

# Get Database Information
echo "curl -X GET 'http://localhost:5984/villians'" 
curl -X GET 'http://localhost:5984/villians'

echo "curl -I HEAD 'http://localhost:5984/villians'" 
curl -I HEAD 'http://localhost:5984/villians'