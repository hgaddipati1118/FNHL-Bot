const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pull_goalie')
        .setDescription('Pull or unpull your goalie. You can only use this when you have the puck or on a faceoff'),
    async execute(interaction) {
        await interaction.reply('Figuring out what is going on????');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        let team = 'N/A';
        if (interaction.user.id == game_json['player_info']['home_gk']['discord_id']) {
            team = 'H';
        }
        else if (interaction.user.id == game_json['player_info']['home_d']['discord_id']) {
            team = 'H';
        }
        else if (interaction.user.id == game_json['player_info']['home_f']['discord_id']) {
            team = 'H';
        }
        else if (interaction.user.id == game_json['player_info']['away_gk']['discord_id']) {
            team = 'A';
        }
        else if (interaction.user.id == game_json['player_info']['away_d']['discord_id']) {
            team = 'A';
        }
        else if (interaction.user.id == game_json['player_info']['away_f']['discord_id']) {
            team = 'A';
        }
        else {
            await interaction.editReply('This is not your game, you can not pull a goalie');
            return;
        }
        if (game_json['game_info']['poss'] != team || game_json['game_info']['state'] == 'faceoff') {
            if (team == 'H') {
                game_json['game_info']['home_gk_pulled'] = !game_json['game_info']['home_gk_pulled'];
                await interaction.editReply(`${game_json['home_team_name']} goalie is ${game_json['game_info']['home_gk_pulled'] ? 'pulled' : 'not pulled'}`);
            }
            else {
                game_json['game_info']['away_gk_pulled'] = !game_json['game_info']['away_gk_pulled'];
                await interaction.editReply(`${game_json['away_team_name']} goalie is ${game_json['game_info']['away_gk_pulled'] ? 'pulled' : 'not pulled'}`);
            }
            MongoHelper.update_game(game_json);
        }
        else {
            await interaction.editReply('You can not pull/unpull your goalie you do not have the puck and it is not a faceoff');
            return;
        }
    },
};