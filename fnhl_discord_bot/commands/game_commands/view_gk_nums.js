const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('view_gk_nums')
        .setDescription('View numbers as a goalie'),
    async execute(interaction) {
        await interaction.reply({ content: 'Fetching numbers ...', ephemeral: true });
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        if (game_json['player_info']['home_gk']['discord_id'] == interaction.user.id) {
            interaction.editReply(game_json['game_info']['home_gk_nums'].join(', ') + ' are your goalie numbers');
        }
        else if (game_json['player_info']['away_gk']['discord_id'] == interaction.user.id) {
            interaction.editReply(game_json['game_info']['away_gk_nums'].join(', ') + ' are your goalie numbers');
        }
        else {
            interaction.editReply('You are not a goalie for a game in this channel');
            return;
        }
    },
};