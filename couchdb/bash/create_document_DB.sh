# Create Document - NOTE: Uses jq for JSON
JOXOS='{"name": "Joxos", "health": 250, "stamina": 150, "atk":25, "items": ["Unity Stone"], "canFight": true}'
VI='{"name": "Vi", "health": 75, "mana": 150, "atk": 5, "magic": 25,"items": ["Tetrahedron", "Octahedron", "Cube", "Icosahedron"], "canFight": true, "canCast": true}'
ROKH_AEGIS='{"name": "Rokh", "health": 100, "stamina": 125, "atk":35, "items": ["Aegis Core"], "canFight": true, "canSteal": true}'
TRANQUILITY='{"name": "Tranquility", "health": 125, "stamina": 100, "atk":20, "items": ["Serenity Key"], "canFight": true}'
BEATRIX_EMORY='{"name": "Beatrix", "health": 125, "mana": 125, "atk":15, "magic": 20, "items": ["Emory Mantle"], "canFight": true, "canCast": true, "canHeal": true}'
INFERNO_FLARE='{"name": "Inferno", "health": 150, "stamina": 75, "atk":40, "items": ["Blazing Blade"], "canFight": true, "canCast": true}'

echo $JOXOS
echo $VI
echo $ROKH_AEGIS
echo $TRANQUILITY
echo $BEATRIX_EMORY
echo $INFERNO_FLARE

# Create document with dynamic id allocation
jq -n "$JOXOS" | curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes' -d @-
jq -n "$VI" | curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes' -d @-
jq -n "$ROKH_AEGIS" | curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes' -d @-
jq -n "$TRANQUILITY" | curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes' -d @-
jq -n "$BEATRIX_EMORY" | curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes' -d @-
jq -n "$INFERNO_FLARE" | curl -H 'Content-Type:application/json' -X POST 'http://admin:password@localhost:5984/heroes' -d @-

# Create document with custom id
jq -n "$JOXOS" | curl -H 'Content-Type:application/json' -X PUT 'http://admin:password@localhost:5984/heroes/JOXOS' -d @-
jq -n "$VI" | curl -H 'Content-Type:application/json' -X PUT 'http://admin:password@localhost:5984/heroes/VI' -d @-
jq -n "$ROKH_AEGIS" | curl -H 'Content-Type:application/json' -X PUT 'http://admin:password@localhost:5984/heroes/ROKH_AEGIS' -d @-
jq -n "$TRANQUILITY" | curl -H 'Content-Type:application/json' -X PUT 'http://admin:password@localhost:5984/heroes/TRANQUILITY' -d @-
jq -n "$BEATRIX_EMORY" | curl -H 'Content-Type:application/json' -X PUT 'http://admin:password@localhost:5984/heroes/BEATRIX_EMORY' -d @-
jq -n "$INFERNO_FLARE" | curl -H 'Content-Type:application/json' -X PUT 'http://admin:password@localhost:5984/heroes/INFERNO_FLARE' -d @-
