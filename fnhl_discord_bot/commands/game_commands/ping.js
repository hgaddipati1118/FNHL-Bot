const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
const Run_Play = require('../../../fnhl_game_mechanics/run_play');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Resend bot ping'),
    async execute(interaction) {
        await interaction.reply('Figuring out what is going on????');
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
            await MongoHelper.update_game(game_json);
        }
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);
        await interaction.editReply('Figured it out :)');
    },
};