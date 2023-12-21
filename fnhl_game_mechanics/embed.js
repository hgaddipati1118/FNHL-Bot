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

module.exports = {
    game_start: game_start_embed
};