const { Client, GatewayIntentBits } = require('discord.js');
const { EC2Client } = require('@aws-sdk/client-ec2');

const { Instance } = require('./services/ec2');
const { isHours } = require('./services/time');
const { generateEmbed, sendButtons } = require('./services/utils');

process.env = Object.assign(process.env, require('./config.json'));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
}),
    colors = {
        stopped: 0xed4245,
        pending: 0xe67e22,
        stopping: 0xe67e22,
        running: 0x57f287,
        terminated: 0x2c2f33
    }, instance = new Instance(process.env.INSTANCE_ID, new EC2Client({
        region: 'us-west-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    }));

client.once('ready', async () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    await sendButtons(channel);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const isRefresh = interaction.customId === 'refresh-status';
    const currentStatus = await instance.status();
    const isRunning = currentStatus === 'running';
    const color = colors[isRefresh || isRunning ? currentStatus.toString() : 'pending'];
    const canStart =
        !isRefresh
        &&
        process.env.DISABLED == 'false'
        &&
        isHours();

    if (canStart && !isRunning) await instance.start();

    // Update Buttons
    await sendButtons(interaction.channel, canStart || isRunning);

    // Update Discord Embed
    interaction.channel.send({
        embeds: [
            generateEmbed(
                color,
                interaction.member.displayName,
                await instance.ip()
            )
        ]
    });
});

client.login(process.env.BOT_TOKEN);