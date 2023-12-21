const helper = require('./helper_methods');
function game_start_embed(game_json){
    const embed = {
        color: 0x0099ff,
        title: `${game_json['away_team']} vs. ${game_json['home_team']}`,
        fields: [
            {
                name: 'Home Goalie',
                value: game_json['player_info']['home_gk']['name'],
                inline: true,
            },
            {
                name: 'Home Defender',
                value: game_json['player_info']['home_d']['name'],
                inline: true,
            },
            {
                name: 'Home Forward',
                value: game_json['player_info']['home_f']['name'],
                inline: true,
            },
            {
                name: '',
                value: '',
                inline: false,
            },
            {
                name: 'Away Goalie',
                value: game_json['player_info']['away_gk']['name'],
                inline: true,
            },
            {
                name: 'Away Defender',
                value: game_json['player_info']['away_d']['name'],
                inline: true,
            },
            {
                name: 'Away Forward',
                value: game_json['player_info']['away_f']['name'],
                inline: true,
            },
        ],
    };
    return embed;
}

function waiting_on_embed(game_json){
    const game_info = game_json['game_info'];
    const game_state = helper.get_game_state(game_json);
    const embed = {
        color: 0x0099ff,
        title: `${game_json['away_team']} ${game_info["away_score"]} | ${game_json['home_team']} ${game_info["home_score"]} | ${game_info["period"]}`,
        fields: [
            {
                name: 'Moves',
                value: game_info['moves'],
                inline: true,
            },
            {
                name: 'Clean Passes',
                value: game_info['clean_passes'],
                inline: true,
            },
            {
                name: 'State',
                value: game_state["state"],
                inline: true,
            },
            {
                name: 'Waiting On',
                value: game_state["waiting_on"],
                inline: false,
            },
        ],
    };
    return embed;
}

module.exports = {
    game_start: game_start_embed,
    waiting_on: waiting_on_embed
};