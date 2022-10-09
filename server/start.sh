#/usr/bin/bash
cd $MC_SERVER_PATH

rm server.pipe

mkfifo server.pipe

java -Xms7500M -Xmx7500M -jar server.jar --nogui < server.pipe > ../out 2>&1 &

sleep infinity > server.pipe &