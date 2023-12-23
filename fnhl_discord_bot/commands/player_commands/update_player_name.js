const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('update_player_name')
        .setDescription('Change a player name')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player to change')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('player_name')
                .setDescription('The new player_name')
                .setRequired(true)),
    async execute(interaction) {
        const player = interaction.options.getUser('player');
        await interaction.reply(`Changing the name for ${player.username} ...`);
        const player_name = interaction.options.getString('player_name');
        const player_json = await MongoHelper.get_document('players', { discord_id: player.id });
        if (player_json == null) {
            await interaction.editReply('Either no player exists for the user or some error occurred, try again and contact penguino if an error is there');
            return;
        }
        player_json['name'] = player_name;
        MongoHelper.update_player(player_json);
        await interaction.editReply(`Changed ${player.username} name to ${player_name}`);
    },
};