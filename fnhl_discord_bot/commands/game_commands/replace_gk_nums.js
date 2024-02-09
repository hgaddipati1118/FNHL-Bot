const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('replace_gk_nums')
        .setDescription('Replace numbers as a goalie (replaces any previous numbers)')
        .addStringOption(option =>
            option
                .setName('gk_nums')
                .setDescription('Seperate each number by a "," each number should be 1-1000')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content: 'Adding numbers ...', ephemeral: true });
        let gk_numbers = interaction.options.getString('gk_nums');
        gk_numbers = gk_numbers.split(',').map((number) => (helper_methods.convert_num(number)));
        // response validation
        if (gk_numbers.some(number => isNaN(number))) {
            interaction.editReply('Please only put numbers and commas, try the command again :)');
            return;
        }
        const game_json = await MongoHelper.get_document('games', { channel_id: interaction.channelId, game_active: true });
        let send_ping = false;
        let gk_team = game_json['home_team'];
        if (game_json == null) {
            await interaction.editReply('There is no active game in this channel');
            return;
        }
        if (game_json['player_info']['home_gk']['discord_id'] == interaction.user.id) {
            if (game_json['game_info']['home_gk_nums'].length == 0) {
                send_ping = true;
            }
            game_json['game_info']['home_gk_nums'] = gk_numbers;
            interaction.editReply(gk_numbers.join(', ') + ' are your goalie numbers');
        }
        else if (game_json['player_info']['away_gk']['discord_id'] == interaction.user.id) {
            if (game_json['game_info']['away_gk_nums'].length == 0) {
                send_ping = false;
                gk_team = game_json['away_team'];
            }
            game_json['game_info']['away_gk_nums'] = gk_numbers;
            interaction.editReply(gk_numbers.join(', ') + ' are your goalie numbers');
        }
        else {
            interaction.editReply('You are not a goalie for a game in this channel');
            return;
        }
        if (send_ping) {
            await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
            await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);
        }
        else {
            await interaction.channel.send(`${gk_team} Goalie Numbers Changed`);
        }
        await MongoHelper.update_game(game_json);

    },
};