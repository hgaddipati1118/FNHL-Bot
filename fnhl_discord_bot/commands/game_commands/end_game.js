const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('end_game')
        .setDescription('Ends Game'),
    async execute(interaction) {
        await interaction.reply('Deleting game ...');
        await MongoHelper.delete_document('games', { channel_id: interaction.channelId, game_active: true });
        await interaction.editReply('Game ended :)');
    },
};