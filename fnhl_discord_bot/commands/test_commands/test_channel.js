const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('test_channel')
        .setDescription('Add stadium for a team')
        .addChannelOption(option =>
            option
                .setName('stadium')
                .setDescription('The team stadium')
                .setRequired(true)),
    async execute(interaction) {
        const stadium = interaction.options.getChannel('stadium');
        const channel = await interaction.guild.channels.fetch('763682731270995969');
        await channel.send('W');
    },
};