# Minecraft on EC2

This repo contains the code for a Minecraft server on Amazon EC2.

Note that this code is fine-tuned towards Ubuntu 22.04 with 4 GB of memory.

### Directories

* `bot`: A Discord bot that provides an interface for Discord users to interact with the given EC2 instance via the `AWS SDK`
* `functions`: A Firebase Cloud Function that stops the EC2 instance at a given time
* `pricing`: A simple script to calculate the pricing of a given EC2 instance. (See `instancePricing` in `pricing.js`)
* `server`: Handy bash scripts that start a Minecraft and send commands to the `stdin` of that process

### Hidden Files:
Both `functions/src` & `bot/src` contain `config.jsoplications might need. (e.g: Discord embed data)n` in production. This file stores both the `AWS IAM` credentials, the Discord bot credentials, as well as any extra static data the respective applications might need. (e.g: Discord embed data)

Feel free to submit a pull request or email me!

------------------

**Main Developer**: [humanfriend22](https://github.com/humanfriend22)
