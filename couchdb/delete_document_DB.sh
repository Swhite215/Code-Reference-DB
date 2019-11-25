# Delete Document - CAN BE IMPROVED - LOOP: GRAB REV, PARSE, CREATE URL, DELETE DOCUMENT

# Grab Latest Revision and Save to File
curl -X GET 'http://localhost:5984/heroes/JOXOS?revs=true' | jq '._rev' > joxos_rev.txt
curl -X GET 'http://localhost:5984/heroes/VI?revs=true' | jq '._rev' > vi_rev.txt
curl -X GET 'http://localhost:5984/heroes/ROKH_AEGIS?revs=true' | jq '._rev' > rokh_aegis_rev.txt
curl -X GET 'http://localhost:5984/heroes/TRANQUILITY?revs=true' | jq '._rev' > tranquility_rev.txt
curl -X GET 'http://localhost:5984/heroes/BEATRIX_EMORY?revs=true' | jq '._rev' > beatrix_emory_rev.txt
curl -X GET 'http://localhost:5984/heroes/INFERNO_FLARE?revs=true' | jq '._rev' > inferno_flare_rev.txt

# Remove Qoutes from Revision
sed 's/\"//g' joxos_rev.txt > joxos_rev_value.txt
sed 's/\"//g' vi_rev.txt > vi_rev_value.txt
sed 's/\"//g' rokh_aegis_rev.txt > rokh_aegis_rev_value.txt
sed 's/\"//g' tranquility_rev.txt > tranquility_rev_value.txt
sed 's/\"//g' beatrix_emory_rev.txt > beatrix_emory_rev_value.txt
sed 's/\"//g' inferno_flare_rev.txt > inferno_flare_rev_value.txt

# Check Revision Values
JOXOS_REV=`cat joxos_rev_value.txt`
VI_REV=`cat vi_rev_value.txt`
ROKH_AEGIS_REV=`cat rokh_aegis_rev_value.txt`
TRANQUILITY_REV=`cat tranquility_rev_value.txt`
BEATRIX_EMORY_REV=`cat beatrix_emory_rev_value.txt`
INFERNO_FLARE_REV=`cat inferno_flare_rev_value.txt`

echo $JOXOS_REV
echo $VI_REV
echo $ROKH_AEGIS_REV
echo $TRANQUILITY_REV
echo $BEATRIX_EMORY_REV
echo $INFERNO_FLARE_REV

# Combine Revision with URL
JOXOS_URL="http://localhost:5984/heroes/JOXOS?rev=$VI_REV"
VI_URL="http://localhost:5984/heroes/VI?rev=$VI_REV"
ROKH_AEGIS_URL="http://localhost:5984/heroes/ROKH_AEGIS?rev=$ROKH_AEGIS_REV"
TRANQUILITY_URL="http://localhost:5984/heroes/TRANQUILITY?rev=$TRANQUILITY_REV"
BEATRIX_EMORY_URL="http://localhost:5984/heroes/BEATRIX_EMORY?rev=$BEATRIX_EMORY_REV"
INFERNO_FLARE_URL="http://localhost:5984/heroes/INFERNO_FLARE?rev=$INFERNO_FLARE_REV"

# Check URLS
echo $JOXOS_URL
echo $VI_URL
echo $ROKH_AEGIS_URL
echo $TRANQUILITY_URL
echo $BEATRIX_EMORY_URL
echo $INFERNO_FLARE_URL

# Delete Documents
curl -X DELETE $JOXOS_URL
curl -X DELETE $VI_URL
curl -X DELETE $ROKH_AEGIS_URL
curl -X DELETE $TRANQUILITY_URL
curl -X DELETE $BEATRIX_EMORY_URL
curl -X DELETE $INFERNO_FLARE_URL