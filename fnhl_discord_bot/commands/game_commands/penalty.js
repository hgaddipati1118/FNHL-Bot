const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
const Run_Play = require('../../../fnhl_game_mechanics/run_play');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('penalty')
        .setDescription('Put in penalty shot number')
        .addIntegerOption(option =>
            option
                .setName('shot')
                .setDescription('Numbers will be converted to range between 1-1000')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Processing shot ...');
        const shot_number = interaction.options.getInteger('shot');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        if (interaction.user.id != helper_methods.get_user_waiting_on(game_json)) {
            await interaction.editReply('Not waiting on a response from you');
            return;
        }
        if (game_json['game_info']['waiting_on'] == 'D') {
            await interaction.editReply('Not waiting on a response from you');
            return;
        }
        if (game_json['game_info']['state'] != 'penalty') {
            await interaction.editReply('You seemed to use the wrong command');
            return;
        }
        else {
            await interaction.channel.send({ embeds: [Run_Play.run_penalty(game_json, helper_methods.convert_num(shot_number))] });
            game_json['game_info']['last_message'] = new Date();
            interaction.editReply('Shot processed :)');
        }
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);
        await MongoHelper.update_game(game_json);
    },
};