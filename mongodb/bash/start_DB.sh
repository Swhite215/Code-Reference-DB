# Start a MongoDB container with exposed port and bind mount
docker run -p 27017:27017 --mount type=bind,source=/tmp/mongodb/data,target=/data --name my-mongodb -d mongo 