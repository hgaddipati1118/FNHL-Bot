const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('update_player_type')
        .setDescription('Change a player type')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The player to change')
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
                )),
    async execute(interaction) {
        const player = interaction.options.getUser('player');
        await interaction.reply(`Changing the player type for ${player.username} ...`);
        const player_type = interaction.options.getInteger('player_type');
        const position = (player_type < 3) ? 'F' : ((player_type < 6) ? 'D' : 'GK');
        const player_types = ['Playmaker', 'Sniper', 'Dangler', 'Offensive Def.', 'Two-Way Def.', 'Finesser', 'Goalie'];
        const player_json = await MongoHelper.get_document('players', { discord_id: player.id });
        if (player_json == null) {
            await interaction.editReply('Either no player exists for the user or some error occurred, try again and contact penguino if an error is there');
            return;
        }
        player_json['type'] = player_type;
        player_json['pos'] = (Math.floor(player_type / 3));
        MongoHelper.update_player(player_json);
        await interaction.editReply(`Changed ${player.username} to ${position} with type ${player_types[player_type]}`);
    },
};