# Start a MongoDB container with exposed port and bind mount
docker run -p 27017:27017 --mount type=bind,source=/tmp/mongodb/data,target=/data --name my-mongodb -d mongo 

# MongoDB UI - Compass: https://www.mongodb.com/download-center/compass
# MongoDB URL - mongodb://localhost:27017