const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_team_info')
        .setDescription('Give information about team')
        .addStringOption(option =>
            option
                .setName('team_code')
                .setDescription('The team to update')
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        const team_code = interaction.options.getString('team_code');
        await interaction.reply(`Getting info for ${team_code}`);
        const team_json = await MongoHelper.get_document('teams', { team_code: team_code });
        if (team_json['emoji'] == undefined) {
            team_json['emoji'] = 'N/A';
        }
        if (team_json['role'] == undefined) {
            team_json['role'] = 'N/A';
        }
        if (team_json['lineup'] == undefined) {
            team_json['lineup'] = { 'gk': 'N/A', 'd': 'N/A', 'f': 'N/A' };
        }
        else {
            team_json['lineup']['gk'] = (await MongoHelper.get_document('players', { discord_id: team_json['lineup']['gk'] }))['name'] + ' (' + `<@${team_json['lineup']['gk']}>` + ')';
            team_json['lineup']['d'] = (await MongoHelper.get_document('players', { discord_id: team_json['lineup']['d'] }))['name'] + ' (' + `<@${team_json['lineup']['d']}>` + ')';
            team_json['lineup']['f'] = (await MongoHelper.get_document('players', { discord_id: team_json['lineup']['f'] }))['name'] + ' (' + `<@${team_json['lineup']['f']}>` + ')';
            console.log(team_json);
        }
        const team_embed = new EmbedBuilder()
            .setColor(team_json['hex_code'])
            .setTitle(team_json['team_name'])
            .addFields(
                { name: 'Stadium', value: `<#${team_json['stadium']}>` },
                { name: 'Emoji', value: team_json['emoji'] },
                { name: 'Role', value:  team_json['role'] },
                { name: 'GK', value: team_json['lineup']['gk'] },
                { name: 'D', value: team_json['lineup']['d'] },
                { name: 'F', value: team_json['lineup']['f'] },
            );
        await interaction.channel.send({ embeds: [team_embed] });
        await interaction.editReply('Got the info :)');
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