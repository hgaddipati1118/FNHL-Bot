const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('update_team_stadium')
        .setDescription('Add stadium for a team')
        .addStringOption(option =>
            option
                .setName('team_code')
                .setDescription('The team to update')
                .setRequired(true)
                .setAutocomplete(true))
        .addChannelOption(option =>
            option
                .setName('stadium')
                .setDescription('The team stadium')
                .setRequired(true)),
    async execute(interaction) {
        const stadium = interaction.options.getChannel('stadium');
        await interaction.reply(`Adding ${stadium} ...`);
        const team_code = interaction.options.getString('team_code');
        const team_json = await MongoHelper.get_document('teams', { team_code: team_code });
        team_json['stadium'] = stadium.id;
        MongoHelper.update_team(team_json);
        await interaction.editReply(`Added ${stadium} for ${team_json['team_name']}`);
    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = await MongoHelper.get_distinct_values('teams', 'team_code');
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
};