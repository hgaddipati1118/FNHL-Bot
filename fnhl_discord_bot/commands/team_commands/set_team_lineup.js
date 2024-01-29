const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_team_lineup')
        .setDescription('Set lineup for a team')
        .addStringOption(option =>
            option
                .setName('team_code')
                .setDescription('The team to update')
                .setRequired(true)
                .setAutocomplete(true))
        .addUserOption(option =>
            option
                .setName('gk')
                .setDescription('Goalie')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('d')
                .setDescription('Defender')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('f')
                .setDescription('Forward')
                .setRequired(true)),
    async execute(interaction) {
        const team_code = interaction.options.getString('team_code');
        await interaction.reply(`Setting lineup for ${team_code} ...`);
        const team_json = await MongoHelper.get_document('teams', { team_code: team_code });
        const gk = interaction.options.getUser('gk');
        const d = interaction.options.getUser('d');
        const f = interaction.options.getUser('f');
        const gk_info = await MongoHelper.get_document('players', { discord_id: gk.id });
        if (!this.check_team_pos(gk_info, 2, team_code)) {
            await interaction.editReply('Error adding goalie');
            return;
        }
        const d_info = await MongoHelper.get_document('players', { discord_id: d.id });
        if (!this.check_team_pos(d_info, 1, team_code)) {
            await interaction.editReply('Error adding defender');
            return;
        }
        const f_info = await MongoHelper.get_document('players', { discord_id: f.id });
        if (!this.check_team_pos(f_info, 0, team_code)) {
            await interaction.editReply('Error adding forward');
            return;
        }
        console.log(gk_info);
        team_json['lineup'] = { 'gk': gk.id, 'd': d.id, 'f': f.id };
        await MongoHelper.update_team(team_json);
        await interaction.editReply(`Lineup for ${team_code} is ${gk_info.name} at GK, ${d_info.name} at D, ${f_info.name} at F`);
    },
    check_team_pos(player_info, pos, team_code) {
        return (player_info['team_code'] == team_code && player_info['pos'] == pos);
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