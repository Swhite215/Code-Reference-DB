# Get Database Information - curl http://domain:port or curl -X METHOD http://domain:port
echo "curl 'http://localhost:5984'"

curl 'http://localhost:5984'

echo "curl -X GET 'http://localhost:5984'" 
curl -X GET 'http://localhost:5984'


echo "curl -X GET 'http://localhost:5984/heroes'" 
curl -X GET 'http://localhost:5984/heroes'
