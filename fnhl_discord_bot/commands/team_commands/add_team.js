const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_team')
        .setDescription('Add a team')
        .addStringOption(option =>
            option.setName('team_code')
                .setDescription('Unique 3 character code for team like ("TOR")')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('team_name')
                .setDescription('Name of team')
                .setRequired(true))
        .addChannelOption(option =>
            option
                .setName('stadium')
                .setDescription('Team stadium')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Hexcode in format #abcdef')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Adding team right now ...');
        const team_json = {
            'team_code': interaction.options.getString('team_code'),
            'team_name': interaction.options.getString('team_name'),
            'stadium': interaction.options.getChannel('stadium').name,
            'hex_code': interaction.options.getString('color'),
        };
        await MongoHelper.add_team(team_json);
        await interaction.editReply(`${team_json.team_name} added!`);
    },
};