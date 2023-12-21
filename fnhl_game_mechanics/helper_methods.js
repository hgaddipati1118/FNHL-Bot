const user = require("../fnhl_discord_bot/commands/test_commands/user");

function calculate_diff(defensive_num, offensive_num){
    let result = Math.abs(defensive_num - offensive_num);
    if(result > 1000){
        result = result % 1000;
    }
    if(result > 500){
        result = 1000 - result;
    }
    return result;
}

function get_game_state(game_json){
    const game_info = game_json["game_info"];
    const player_info = game_json["player_info"];
    let output = {
        "waiting_on": "" ,
        "state": game_info["state"], // Can be GK Numbers, Penalty/Breakaway, Faceoff, Normal Play
    }

    //First check if gk numbers needed
    if(game_info['away_gk_nums'].length < 1 || game_info["home_gk_nums"] < 1){
        output["state"] = "Waiting on GK Numbers"
        if(game_info['away_gk_nums'].length < 1){
            output["waiting_on"] = `<@${player_info["away_gk"]["discord_id"]}> needs to submit their gk numbers, use /add_gk_nums to add goalie numbers \n`;
        }
        if(game_info['home_gk_nums'].length < 1){
            output["waiting_on"] += `<@${player_info["home_gk"]["discord_id"]}> needs to submit their gk numbers, use /add_gk_nums to add goalie numbers \n`;
        }
    }
    let player_waiting_on = user_waiting_on(game_json);
    if( game_info['waiting_on'] == 'D'){
        output['waiting_on'] = `<@${player_waiting_on}> needs to submit defensive number for ${output['state']} use /${output['state']}`;
    } else {
        output['waiting_on'] = `<@${player_waiting_on}> needs to submit offensive number for ${output['state']} use /${output['state']}`;
    }
    return output;
}

function convert_num(number){
    number = parseInt(number);
    if(isNaN(number)){
        return number;
    }
    number = number % 1000;
    if(number == 0){
        return 1000;
    }
    return number;
}

function user_waiting_on(game_json){
    const game_info = game_json["game_info"];
    const player_info = game_json["player_info"];
    let player_waiting_on = player_info["away_d"]["discord_id"];
    if( game_info['waiting_on'] == 'D'){
        if(game_info["poss"] == 'A'){
            player_waiting_on = player_info["home_d"]["discord_id"];
        }
    } 
    else {
        if(game_info["poss"] == 'A' && game_info["puck_pos"] == "F"){
            player_waiting_on = player_info["away_f"]["discord_id"];
        } else if (game_info["poss"] == "H"){
            player_waiting_on = player_info["home_d"]["discord_id"];
            if(game_info["puck_pos"] == "F"){
                player_waiting_on = player_info["home_f"]["discord_id"];
            }
        }
    }
    return player_waiting_on;
}
module.exports = {
    calculate_diff: calculate_diff,
    get_game_state: get_game_state,
    convert_num: convert_num,
    get_user_waiting_on: user_waiting_on,
};