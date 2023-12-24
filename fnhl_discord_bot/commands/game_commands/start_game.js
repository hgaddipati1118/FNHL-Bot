const { SlashCommandBuilder } = require('discord.js');
const MongoHelper = require('../../../fnhl_api/db_methods');
const Embeds = require('../../../fnhl_game_mechanics/embed');
const helper_methods = require('../../../fnhl_game_mechanics/helper_methods');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('start_game')
        .setDescription('Start a game')
        .addChannelOption(option =>
            option
                .setName('stadium')
                .setDescription('Game Stadium')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('week')
                .setDescription('Week')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('home_team_code')
                .setDescription('The home team')
                .setRequired(true)
                .setAutocomplete(true))
        .addUserOption(option =>
            option
                .setName('home_gk')
                .setDescription('Home Goalie')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('home_d')
                .setDescription('Home Defender')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('home_f')
                .setDescription('Home Forward')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('away_team_code')
                .setDescription('The away team')
                .setRequired(true)
                .setAutocomplete(true))
        .addUserOption(option =>
            option
                .setName('away_gk')
                .setDescription('Away Goalie')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('away_d')
                .setDescription('Away Defender')
                .setRequired(true))
        .addUserOption(option =>
            option
                .setName('away_f')
                .setDescription('Away Forward')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.reply('creating game');
        const stadium = interaction.options.getChannel('stadium');
        const week = interaction.options.getString('week');
        const home_team = interaction.options.getString('home_team_code');
        const away_team = interaction.options.getString('away_team_code');
        const home_gk = interaction.options.getUser('home_gk');
        const home_d = interaction.options.getUser('home_d');
        const home_f = interaction.options.getUser('home_f');
        const away_gk = interaction.options.getUser('away_gk');
        const away_d = interaction.options.getUser('away_d');
        const away_f = interaction.options.getUser('away_f');

        // Gets positions, name, and discord_id of all players
        const player_info = {
            home_gk: await MongoHelper.get_document('players', { discord_id: home_gk.id }),
            home_d: await MongoHelper.get_document('players', { discord_id: home_d.id }),
            home_f: await MongoHelper.get_document('players', { discord_id: home_f.id }),
            away_gk: await MongoHelper.get_document('players', { discord_id: away_gk.id }),
            away_d: await MongoHelper.get_document('players', { discord_id: away_d.id }),
            away_f: await MongoHelper.get_document('players', { discord_id: away_f.id }),
        };

        //  Initial Game State
        const game_info = {
            moves: 25,
            period: 1,
            home_score: 0,
            away_score: 0,
            d_num: 1,
            state: 'faceoff',
            waiting_on: 'D', // D = defense, O = Offense
            clean_passes: 0,
            poss: 'H', // H = home, A = away
            puck_pos: 'F', // Who on offense has puck (D = defense, F = forward)
            home_gk_nums: [],
            away_gk_nums: [],
            home_gk_pulled: false,
            away_gk_pulled: false,
            last_message: new Date(),
        };
        const home_team_json = await MongoHelper.get_document('teams', { team_code: home_team });
        const away_team_json = await MongoHelper.get_document('teams', { team_code: away_team });
        if (home_team_json['emoji'] == undefined) {
            home_team_json['emoji'] = '';
        }
        if (home_team_json['role'] == undefined) {
            home_team_json['role'] = '';
        }
        if (away_team_json['emoji'] == undefined) {
            away_team_json['emoji'] = '';
        }
        if (away_team_json['role'] == undefined) {
            away_team_json['role'] = '';
        }
        const game_json = {
            channel_id: stadium.id,
            week: week,
            player_info: player_info,
            home_team: home_team,
            home_team_name: home_team_json['team_name'],
            home_team_emoji: home_team_json['emoji'],
            home_team_role: home_team_json['role'],
            home_team_color: parseInt(home_team_json['hex_code'].toLowerCase().replace('#', ''), 16),
            away_team: away_team,
            away_team_name: away_team_json['team_name'],
            away_team_emoji: away_team_json['emoji'],
            away_team_role: away_team_json['role'],
            away_team_color: parseInt(away_team_json['hex_code'].toLowerCase().replace('#', ''), 16),
            game_active: true,
            game_info: game_info,
        };
        const game_start_embed = Embeds.game_start(game_json);
        if ((await MongoHelper.get_document('games', { channel_id: stadium.id, game_active: true })) != null) {
            await interaction.editReply('A game already exists in the stadium');
            return;
        }
        await stadium.send({ embeds: [game_start_embed] });
        await MongoHelper.add_game(game_json);
        await interaction.editReply('Game created!!!');
        await interaction.channel.send({ embeds: [Embeds.waiting_on(game_json)] });
        await interaction.channel.send(`<@${helper_methods.get_user_waiting_on(game_json)}>`);

    },
    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = await MongoHelper.get_distinct_values('teams', 'team_code');
        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
};