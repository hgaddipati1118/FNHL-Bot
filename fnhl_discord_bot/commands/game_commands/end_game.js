const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Run_Play = require('../../../fnhl_game_mechanics/run_play');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('end_game')
        .setDescription('Ends Game'),
    async execute(interaction) {
        await interaction.reply('Deleting game ...');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        await Run_Play.end_game(interaction, game_json);
        await interaction.editReply('Game ended :)');
    },
};