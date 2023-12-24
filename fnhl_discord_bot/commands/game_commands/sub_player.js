const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('sub_player')
        .setDescription('Sub a player into the game')
        .addStringOption(option =>
            option
                .setName('position')
                .setDescription('Position to sub out')
                .setRequired(true)
                .addChoices(
                    { name: 'Away Goalie', value: 'away_gk' },
                    { name: 'Away Defender', value: 'away_d' },
                    { name: 'Away Forward', value: 'away_f' },
                    { name: 'Home Goalie', value: 'home_gk' },
                    { name: 'Home Defender', value: 'home_d' },
                    { name: 'Home Forward', value: 'home_f' }))
        .addUserOption(option =>
            option
                .setName('sub_player')
                .setDescription('Player to sub in')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Processing sub');
        const pos = interaction.options.getString('position');
        const sub = interaction.options.getUser('sub_player');
        const sub_json = await MongoHelper.get_document('players', { discord_id: sub.id });
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        const old_player = game_json['player_info'][pos];
        game_json['player_info'][pos] = sub_json;
        MongoHelper.update_game(game_json);
        await interaction.editReply(`Subbed ${sub_json['name']} in for ${old_player['name']}`);

    },
};