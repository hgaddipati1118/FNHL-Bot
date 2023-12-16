const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_player')
        .setDescription('Add a player')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The person to add')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The name of the player')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('player_type')
                .setDescription('The type of player')
                .setRequired(true)
                .addChoices(
                    { name: 'Playmaker', value: 0 },
                    { name: 'Sniper', value: 1 },
                    { name: 'Dangler', value: 2 },
                    { name: 'Offensive Def.', value: 3 },
                    { name: 'Two-Way Def.', value: 4 },
                    { name: 'Finesser', value: 5 },
                    { name: 'Goalie', value: 6 },
                ))
        .addStringOption(option =>
            option
                .setName('team_code')
                .setDescription('The team for the player (put FA if no team)')
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        const player_type = interaction.options.getInteger('player_type');
        const player = interaction.options.getUser('player');
        const name = interaction.options.getString('name');
        const team_code = interaction.options.getString('team_code');
        const position = (player_type < 3) ? 'F' : ((player_type < 6) ? 'D' : 'GK');
        const player_types = ['Playmaker', 'Sniper', 'Dangler', 'Offensive Def.', 'Two-Way Def.', 'Finesser', 'Goalie'];
        await interaction.reply(`Adding ${name} ...`);
        const player_json = {
            name: name,
            pos: (Math.floor(player_type / 3)),
            type: player_type,
            team_code: team_code,
            discord_id: player.id,
        };
        await MongoHelper.add_player(player_json, 'DISCORD');
        await interaction.editReply(`Adding ${name} as ${position} with type ${player_types[player_type]} for ${team_code}`);
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