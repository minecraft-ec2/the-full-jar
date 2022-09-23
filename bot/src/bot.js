const { Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Colors
} = require('discord.js');

const { Instance } = require('./services/ec2');

const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
}),
    STATUS_COLORS = {
        stopped: Colors.Red,
        pending: Colors.Orange,
        stopping: Colors.Orange,
        running: Colors.Green,
    }, instance = new Instance(config.INSTANCE_ID);

function generateEmbed(color) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Server Status')
        .setDescription(config.EMBED_DESCRIPTION)
        .setTimestamp()
        .setFooter({ text: 'AWS Reporter', iconURL: config.EMBED_FOOTER_ICON_URL });
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
    const channel = client.channels.cache.get(config.CHANNEL_ID);
    await sendButtons(channel);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const isRefresh = interaction.customId === 'refresh-status';
    const currentStatus = await instance.status();
    const status = isRefresh || currentStatus === 'running' ? currentStatus : 'pending';
    const canStart = !isRefresh && config.DISABLED === false;

    if (canStart) {
        if (isHours()) {
            await instance.start();
        }
    }

    await sendButtons(interaction.channel, canStart);
    interaction.channel.send({ embeds: [generateEmbed(STATUS_COLORS[status])] });
});

client.login(config.BOT_TOKEN);