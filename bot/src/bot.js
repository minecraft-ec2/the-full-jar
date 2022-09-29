const { Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');
const { EC2Client } = require('@aws-sdk/client-ec2');

const { Instance } = require('./services/ec2');

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


function generateEmbed(color, username, ip) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Server Status')
        .setDescription(process.env.EMBED_DESCRIPTION)
        .addFields(
            { name: '\u200BStarted By', value: '@' + username, inline: true },
            { name: 'IP', value: ip.toString(), inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'AWS Reporter', iconURL: process.env.EMBED_FOOTER_ICON_URL });
};

async function sendButtons(channel, disableFirstButton = false) {
    await channel.bulkDelete(4);

    const ButtonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('start-server')
                .setLabel('Start Server')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(disableFirstButton),
            new ButtonBuilder()
                .setCustomId('refresh-status')
                .setLabel('Refresh')
                .setStyle(ButtonStyle.Primary)
        );

    channel.send({ components: [ButtonRow] });
};

client.once('ready', async () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    await sendButtons(channel);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const isRefresh = interaction.customId === 'refresh-status';
    const currentStatus = await instance.status();
    const color = colors[isRefresh || currentStatus === 'running' ? currentStatus.toString() : 'pending'];
    const canStart =
        !isRefresh
        &&
        process.env.DISABLED == true
        &&
        isHours()
        &&
        currentStatus !== 'running';

    if (canStart) await instance.start();

    await sendButtons(interaction.channel, canStart);
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