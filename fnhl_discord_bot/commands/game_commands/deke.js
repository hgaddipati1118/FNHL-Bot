const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
const Run_Play = require('../../../fnhl_game_mechanics/run_play');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('deke')
        .setDescription('Put in deke number')
        .addIntegerOption(option =>
            option
                .setName('deke')
                .setDescription('Numbers will be converted to range between 1-1000')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content: 'Processing deke ...', ephemeral: true });
        const deke_number = interaction.options.getInteger('deke');
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        const dog_team = await Run_Play.calc_dog(game_json);
        if (dog_team != false) {
            interaction.editReply('Delay of game being processed ...');
            await Run_Play.force_penalty(game_json, dog_team);
            await interaction.editReply('Penalty processed :)');
        }
        else if (interaction.user.id != helper_methods.get_user_waiting_on(game_json)) {
            await interaction.editReply('Not waiting on a response from you');
            return;
        }
        else if (game_json['game_info']['waiting_on'] == 'D') {
            await interaction.editReply('Not waiting on a response from you');
            return;
        }
        else if (game_json['game_info']['state'] != 'deke, /pass, /shot') {
            await interaction.editReply('You seemed to use the wrong command');
            return;
        }
        else {
            game_json['game_info']['state'] = 'deke';
            await interaction.channel.send({ embeds: [await Run_Play.run_deke(game_json, helper_methods.convert_num(deke_number), interaction)] });
            game_json['game_info']['last_message'] = new Date();
            interaction.editReply('Deke processed :)');
            if (await Run_Play.check_game_over(interaction, game_json)) {
                await interaction.channel.send('Game Over');
                return;
            }
        }
        await MongoHelper.update_game(game_json);
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);
        await MongoHelper.update_game(game_json);
    },
};