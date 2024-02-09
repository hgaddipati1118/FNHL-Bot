const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
const Run_Play = require('../../../fnhl_game_mechanics/run_play');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('defense')
        .setDescription('Put in defense number')
        .addIntegerOption(option =>
            option
                .setName('defense')
                .setDescription('Numbers will be converted to range between 1-1000')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content: 'Processing number ...', ephemeral: true });
        const faceoff_number = interaction.options.getInteger('defense');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        const dog_team = Run_Play.calc_dog(game_json);
        if (dog_team != false) {
            interaction.editReply('Delay of game being processed ...');
            await Run_Play.force_penalty(game_json, dog_team);
            await interaction.editReply('Penalty processed :)');
            return;
        }
        if (interaction.user.id != helper_methods.get_user_waiting_on(game_json)) {
            await interaction.editReply('Not waiting on a response from you');
            return;
        }
        if (game_json['game_info']['state'] != 'defense') {
            await interaction.editReply('You seemed to use the wrong command');
            return;
        }
        if (game_json['game_info']['waiting_on'] == 'D') {
            game_json['game_info']['d_num'] = helper_methods.convert_num(faceoff_number);
            game_json['game_info']['waiting_on'] = 'O';
            game_json['game_info']['state'] = 'deke, /pass, /shot';
            game_json['game_info']['last_message'] = new Date();
            interaction.editReply(game_json['game_info']['d_num'] + ' is your defensive number');
        }
        else {
            await interaction.editReply('Not waiting on a response from you');
            return;
        }
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);
        await MongoHelper.update_game(game_json);
    },
};