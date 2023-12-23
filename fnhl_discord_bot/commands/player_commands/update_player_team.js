const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('update_player_team')
        .setDescription('Change a player to a different team')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player to change')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('player_team_code')
                .setDescription('The new team code for the player')
                .setRequired(true)
                .setAutocomplete(true)),
    async execute(interaction) {
        const player = interaction.options.getUser('player');
        await interaction.reply(`Changing the team for ${player.username} ...`);
        const player_team = interaction.options.getString('player_team_code');
        const player_json = await MongoHelper.get_document('players', { discord_id: player.id });
        if (player_json == null) {
            await interaction.editReply('Either no player exists for the user or some error occurred, try again and contact penguino if an error is there');
            return;
        }
        player_json['team_code'] = player_team;
        MongoHelper.update_player(player_json);
        await interaction.editReply(`Changed ${player.username} team to ${player_team}`);
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