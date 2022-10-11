# Minecraft Server

This folder is for testing interaction with the Minecraft Server. Go to [PaperMC](https://papermc.io/downloads) & download the latest jar file and place it in the server sub-folder relative to this README.

### Start
Running `start.sh` will start the Minecraft Server as a background process.
`bash
bash start.sh
`
### Execute A Server Command
Running `execute.sh` with an argument will send it to `stdin` of the Minecraft Server.
```bash
bash execute.sh {help | kill [player] | your command }
```
I suggest running this with `tail -F out` so you can see the live output of your command

### Stop
This will clean up the `stdout` & `stdin` for the Minecraft Server & properly shut down the server.
```bash
bash execute.sh stop
```