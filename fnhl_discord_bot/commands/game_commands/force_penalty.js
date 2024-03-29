const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
const Run_Play = require('../../../fnhl_game_mechanics/run_play');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('force_penalty')
        .setDescription('Force penalty for a team')
        .addStringOption(option =>
            option
                .setName('team')
                .setDescription('Numbers will be converted to range between 1-1000')
                .setRequired(true)
                .addChoices(
                    { name: 'Home Team', value: 'H' },
                    { name: 'Away Team', value: 'A' },
                )),
    async execute(interaction) {
        await interaction.reply('Processing penalty ...');
        const team = interaction.options.getString('team');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        await Run_Play.force_penalty(game_json, team);
        await interaction.editReply('Penalty processed :)');
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);
        await MongoHelper.update_game(game_json);
    },
};