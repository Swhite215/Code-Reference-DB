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

# Get Document List of Revisions
curl -X GET 'http://localhost:5984/heroes/JOXOS?revs=true'
curl -X GET 'http://localhost:5984/heroes/VI?revs=true'
curl -X GET 'http://localhost:5984/heroes/ROKH_AEGIS?revs=true'
curl -X GET 'http://localhost:5984/heroes/TRANQUILITY?revs=true'
curl -X GET 'http://localhost:5984/heroes/BEATRIX_EMORY?revs=true'
curl -X GET 'http://localhost:5984/heroes/INFERNO_FLARE?revs=true'

# Get Document Revision History
curl -X GET 'http://localhost:5984/heroes/JOXOS?revs_info=true'
curl -X GET 'http://localhost:5984/heroes/VI?revs_info=true'
curl -X GET 'http://localhost:5984/heroes/ROKH_AEGIS?revs_info=true'
curl -X GET 'http://localhost:5984/heroes/TRANQUILITY?revs_info=true'
curl -X GET 'http://localhost:5984/heroes/BEATRIX_EMORY?revs_info=true'
curl -X GET 'http://localhost:5984/heroes/INFERNO_FLARE?revs_info=true'
