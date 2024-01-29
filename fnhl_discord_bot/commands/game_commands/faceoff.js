const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
const Run_Play = require('../../../fnhl_game_mechanics/run_play');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('faceoff')
        .setDescription('Put in faceoff number')
        .addIntegerOption(option =>
            option
                .setName('faceoff')
                .setDescription('Numbers will be converted to range between 1-1000')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content: 'Processing faceoff ...', ephemeral: true });
        const faceoff_number = interaction.options.getInteger('faceoff');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        await interaction.editReply({ content: 'Processing faceoff ...', ephemeral: (game_json['game_info']['waiting_on'] == 'D') });
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        if (interaction.user.id != helper_methods.get_user_waiting_on(game_json)) {
            await interaction.editReply('Not waiting on a response from you');
            return;
        }
        if (game_json['game_info']['state'] != 'faceoff') {
            await interaction.editReply('You seemed to use the wrong command');
            return;
        }

        if (game_json['game_info']['waiting_on'] == 'D') {
            game_json['game_info']['d_num'] = helper_methods.convert_num(faceoff_number);
            game_json['game_info']['waiting_on'] = 'O';
            game_json['game_info']['puck_pos'] = 'F';
            game_json['game_info']['last_message'] = new Date();
            interaction.editReply(game_json['game_info']['d_num'] + ' is your faceoff number');
        }
        else {
            game_json['game_info']['last_message'] = new Date();
            await interaction.channel.send({ embeds: [await Run_Play.run_faceoff(game_json, helper_methods.convert_num(faceoff_number), interaction)] });
            if (Run_Play.check_game_over(interaction, game_json)) {
                await interaction.channel.send('Game Over');
                return;
            }
        }
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);
        await MongoHelper.update_game(game_json);
    },
};