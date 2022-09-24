#/bin/bash

cd $MC_SERVER_PATH

echo $1 > server.pipe

if [ "$1" = "stop" ]; then
    rm server.pipe
    cd ..
    rm out
fi