const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Resend bot ping'),
    async execute(interaction) {
        await interaction.reply('Figuring out what is going on????');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.editReply('Figured it out :)');
    },
};