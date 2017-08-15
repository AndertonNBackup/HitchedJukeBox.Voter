#!/bin/bash

IMAGE_NAME=hitchedjukebox.voter
CONTAINER_NAME=voter.dev

docker stop ${CONTAINER_NAME}  
docker rm ${CONTAINER_NAME}

docker run \
    -d \
    -p 4200:4200 \
    -p 49153:49153 \
    -p 8080:8080 \
    --name ${CONTAINER_NAME} \
    -e "NODE_ENV=development" \
    -v `pwd`/client:/usr/code/client \
    -v `pwd`/server:/usr/code/server \
    ${IMAGE_NAME}:dev \
    /usr/code/dev_entry_point.sh 