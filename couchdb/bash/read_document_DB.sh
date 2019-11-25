# Get Document Information
curl -X GET 'http://localhost:5984/heroes/JOXOS'
curl -X GET 'http://localhost:5984/heroes/VI'
curl -X GET 'http://localhost:5984/heroes/ROKH_AEGIS'
curl -X GET 'http://localhost:5984/heroes/TRANQUILITY'
curl -X GET 'http://localhost:5984/heroes/BEATRIX_EMORY'
curl -X GET 'http://localhost:5984/heroes/INFERNO_FLARE'

# Get Document Header Information
curl -I HEAD 'http://localhost:5984/heroes/JOXOS'
curl -I HEAD 'http://localhost:5984/heroes/VI'
curl -I HEAD 'http://localhost:5984/heroes/ROKH_AEGIS'
curl -I HEAD 'http://localhost:5984/heroes/TRANQUILITY'
curl -I HEAD 'http://localhost:5984/heroes/BEATRIX_EMORY'
curl -I HEAD 'http://localhost:5984/heroes/INFERNO_FLARE'

