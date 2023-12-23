const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_player_info')
        .setDescription('Give information about a player')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player to change')
                .setRequired(true)),
    async execute(interaction) {
        const player = interaction.options.getUser('player');
        const player_json = await MongoHelper.get_document('players', { discord_id: player.id });
        if (player_json == null) {
            await interaction.editReply('Either no player exists for the user or some error occurred, try again and contact penguino if an error is there');
            return;
        }
        await interaction.reply(`Getting info for ${player.username}`);
        let team_json = await MongoHelper.get_document('teams', { team_code: player_json['team_code'] });
        if (team_json == null) {
            team_json = {
                'hex_code': '#FFFFFF',
                'team_name': 'FA',
            };
        }
        const player_types = ['Playmaker', 'Sniper', 'Dangler', 'Offensive Def.', 'Two-Way Def.', 'Finesser', 'Goalie'];
        const position = (player_json['type'] < 3) ? 'F' : ((player_json['type'] < 6) ? 'D' : 'GK');
        const player_embed = new EmbedBuilder()
            .setColor(team_json['hex_code'])
            .setTitle(player_json['name'])
            .setDescription(`<@${player.id}>`)
            .addFields(
                { name: 'Team', value: team_json['team_name'] },
                { name: 'Position', value: position },
                { name: 'Type', value:  player_types[player_json['type']] },
            );
        await interaction.channel.send({ embeds: [player_embed] });
        await interaction.editReply('Got the info :)');
    },
};