const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('update_team_name')
        .setDescription('Add team_name for a team')
        .addStringOption(option =>
            option
                .setName('team_code')
                .setDescription('The team to update')
                .setRequired(true)
                .setAutocomplete(true))
        .addStringOption(option =>
            option
                .setName('team_name')
                .setDescription('The team team_name')
                .setRequired(true)),
    async execute(interaction) {
        const team_name = interaction.options.getString('team_name');
        await interaction.reply(`Adding ${team_name} ...`);
        const team_code = interaction.options.getString('team_code');
        const team_json = await MongoHelper.get_document('teams', { team_code: team_code });
        team_json['team_name'] = team_name;
        MongoHelper.update_team(team_json);
        await interaction.editReply(`Added ${team_name} for ${team_json['team_name']}`);
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