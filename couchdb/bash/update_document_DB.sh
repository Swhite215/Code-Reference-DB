# Update Document - CAN BE IMPROVED - LOOP: GRAB REV, PARSE, CREATE URL, UPDATE DOCUMENT
JOXOS='{"name": "Joxos", "health": 500, "stamina": 300, "atk":50, "items": ["Unity Stone"], "canFight": true, "current_location": "E.C.R.I.C."}'
VI='{"name": "Vi", "health": 150, "mana": 300, "atk": 10, "magic": 50,"items": ["Tetrahedron", "Octahedron", "Cube", "Icosahedron"], "canFight": true, "canCast": true, "current_location": "E.C.R.I.C."}'
ROKH_AEGIS='{"name": "Rokh", "health": 200, "stamina": 250, "atk":70, "items": ["Aegis Core"], "canFight": true, "canSteal": true, "current_location": "E.C.R.I.C."}'
TRANQUILITY='{"name": "Tranquility", "health": 250, "stamina": 200, "atk":40, "items": ["Serenity Key"], "canFight": true, "current_location": "Hope`s Haven"}'
BEATRIX_EMORY='{"name": "Beatrix", "health": 250, "mana": 250, "atk":30, "magic": 40, "items": ["Emory Mantle"], "canFight": true, "canCast": true, "canHeal": true, "current_location": "Mundi Forest"}'
INFERNO_FLARE='{"name": "Inferno", "health": 300, "stamina": 150, "atk":80, "items": ["Blazing Blade"], "canFight": true, "canCast": true, "current_location": "Hope`s Haven"}'

echo $JOXOS
echo $VI
echo $ROKH_AEGIS
echo $TRANQUILITY
echo $BEATRIX_EMORY
echo $INFERNO_FLARE

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
JOXOS_URL="http://localhost:5984/heroes/JOXOS?rev=$JOXOS_REV"
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

# Update Documents Using Latest Revision Number
jq -n "$JOXOS" | curl -H 'Content-Type:application/json' -X PUT $JOXOS_URL -d @-
jq -n "$VI" | curl -H 'Content-Type:application/json' -X PUT $VI_URL -d @-
jq -n "$ROKH_AEGIS" | curl -H 'Content-Type:application/json' -X PUT $ROKH_AEGIS_URL -d @-
jq -n "$TRANQUILITY" | curl -H 'Content-Type:application/json' -X PUT $TRANQUILITY_URL -d @-
jq -n "$BEATRIX_EMORY" | curl -H 'Content-Type:application/json' -X PUT $BEATRIX_EMORY_URL -d @-
jq -n "$INFERNO_FLARE" | curl -H 'Content-Type:application/json' -X PUT $INFERNO_FLARE_URL -d @-
