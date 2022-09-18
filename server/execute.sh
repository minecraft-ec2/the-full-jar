#/bin/bash

echo $1 > server/server.pipe 

if [ "$1" = "stop" ]; then
    rm server/server.pipe
    rm out
fi