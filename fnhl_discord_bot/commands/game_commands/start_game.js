const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('start_game')
        .setDescription('Start a game')
        .addStringOption(option =>
            option
                .setName('home_team_code')
                .setDescription('The home team')
                .setRequired(true)
                .setAutocomplete(true))
        .addUserOption(option =>
            option
                .setName('home_gk')
                .setDescription('Home Goalie')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('home_d')
                .setDescription('Home Defender')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('home_f')
                .setDescription('Home Forward')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('away_team_code')
                .setDescription('The away team')
                .setRequired(true)
                .setAutocomplete(true))
        .addUserOption(option =>
            option
                .setName('away_gk')
                .setDescription('Away Goalie')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('away_d')
                .setDescription('Away Defender')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('away_f')
                .setDescription('Away Forward')
                .setRequired(true)),
    async execute(interaction) {
        const home_team = interaction.options.getString('home_team_code');
        const away_team = interaction.options.getString('away_team_code');
        const home_gk = interaction.options.getUser('home_gk');
        const home_d = interaction.options.getUser('home_d');
        const home_f = interaction.options.getUser('home_f');
        const away_gk = interaction.options.getUser('away_gk');
        const away_d = interaction.options.getUser('away_d');
        const away_f = interaction.options.getUser('away_f');
        await interaction.reply('creating game');
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