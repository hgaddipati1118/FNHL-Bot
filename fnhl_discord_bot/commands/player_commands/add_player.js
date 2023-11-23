const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_player')
        .setDescription('Add a player')
        .addUserOption(option =>
            option
                .setName('player')
                .setDescription('The person to add')
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
        const player_type = interaction.options.getInteger('player_type');
        const player = interaction.options.getUser('player');
        const position = (player_type < 3) ? 'F' : ((player_type < 6) ? 'D' : 'GK');
        const player_types = ['Playmaker', 'Sniper', 'Dangler', 'Offensive Def.', 'Two-Way Def.', 'Finesser', 'Goalie'];
        await interaction.reply(`Adding ${player.username} as ${position} with type ${player_types[player_type]}`);
    },
};