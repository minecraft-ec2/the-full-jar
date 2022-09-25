const { Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
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
    colors = {
        stopped: 0xed4245,
        pending: 0xe67e22,
        stopping: 0xe67e22,
        running: 0x57f287,
        terminated: 0x2c2f33
    }, instance = new Instance(config.INSTANCE_ID);

function generateEmbed(color, username) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Server Status')
        .setDescription(config.EMBED_DESCRIPTION)
        .addFields(
            { name: '\u200BStarted By', value: '@' + username, inline: true },
        )
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
    const color = colors[isRefresh || currentStatus === 'running' ? currentStatus.toString() : 'pending'];
    const canStart =
        !isRefresh
        &&
        config.DISABLED === false
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
                interaction.member.displayName
            )
        ]
    });
});

client.login(config.BOT_TOKEN);