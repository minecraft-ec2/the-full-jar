const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

exports.generateEmbed = (color, username, ip) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Server Status')
        .setDescription('The embed color indicates the status of the server. This can be updated with the Refresh button.')
        .addFields(
            { name: '\u200BStarted By', value: '@' + username, inline: true },
            { name: 'IP', value: ip, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: 'AWS Reporter', iconURL: process.env.EMBED_FOOTER_ICON_URL });
};

exports.sendButtons = async (channel, disableFirstButton = false) => {
    await channel.bulkDelete(10);

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