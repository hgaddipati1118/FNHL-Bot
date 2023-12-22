const simulator = require('./play_simulators');
const Embed = require('./embed');
const helper = require('./helper_methods');

function run_play(game_json, offensive_num){
    if(game_json['game_info']['state'] == 'faceoff'){
        return run_faceoff(game_json, offensive_num);
    } 
    else if (game_json['game_info']['state'] == 'breakaway'){
        return run_penalty(game_json, offensive_num);
    } 
    else if (game_json['game_info']['state'] == 'penalty'){
        return run_penalty(game_json, offensive_num);
    }
    else if (game_json['game_info']['state'] == 'pass'){
        return run_pass(game_json, offensive_num);
    }
    else if (game_json['game_info']['state'] == 'deke'){
        return run_deke(game_json, offensive_num);
    } else if(game_json['game_info']['state'] == 'shot'){
        return run_shot(game_json, offensive_num);
    }
}

function get_player_type(game_json){
    let player_info = game_json['player_info'];
    let game_info = game_json['game_info'];
    if(game_info['puck_pos'] == 'D'){
        if(game_info['poss'] == 'H'){
            return player_info['home_d']['type'];
        }
        else {
            return player_info['away_d']['type'];
        }
    }
    else {
        if(game_info['poss'] == 'H'){
            return player_info['home_f']['type'];
        }
        else {
            return player_info['away_f']['type'];
        }
    }
}

function run_faceoff(game_json, offensive_num){
    const game_info = game_json['game_info'];
    const diff = helper.calculate_diff(game_info['d_num'], offensive_num);
    const play_result = simulator.simulate_faceoff(diff);
    game_info['puck_pos'] = 'D';
    game_info['waiting_on'] = 'D';
    if(play_result == "WinCP" || play_result == "LossCP"){
        game_info['clean_passes'] = 1;
    }
    if(play_result.includes('Loss')){
        game_info['poss'] = (game_info['poss'] == 'H')?'A':'H';
    }
    game_info['state'] = 'defense'; 
    const embed = Embed.play_result(game_json, 'faceoff', offensive_num, game_info['d_num'], diff, play_result);
    return embed;
}

function run_penalty(game_json, offensive_num){
    const game_info = game_json['game_info'];
    var goalie_num;
    if(game_info['poss'] == 'H'){
        goalie_num = game_info['away_gk_nums'].shift();
    } else {
        goalie_num = game_info['home_gk_nums'].shift();
    }
    const diff = helper.calculate_diff(goalie_num, offensive_num);
    const play_result = simulator.simulate_penalty(get_player_type(game_json), diff);
    game_info['waiting_on'] = 'D';
    game_info['clean_passes'] = 0;
    game_info['moves'] -= 1;
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
        }
    }
    game_info['state'] = 'faceoff'; 
    const embed = Embed.play_result(game_json, game_json['game_info']['state'], offensive_num, goalie_num, diff, play_result);
    return embed;
}

function run_shot(game_json, offensive_num){
    const game_info = game_json['game_info'];
    var goalie_num;
    var goalie_pulled;
    var opp_goalie_pulled;
    if(game_info['poss'] == 'H'){
        goalie_num = game_info['away_gk_nums'].shift();
        goalie_pulled = game_info['home_gk_pulled'];
        opp_goalie_pulled = game_info['away_gk_pulled'];
    } else {
        goalie_num = game_info['home_gk_nums'].shift();
        goalie_pulled = game_info['away_gk_pulled'];
        opp_goalie_pulled = game_info['home_gk_pulled'];
    }
    const diff = helper.calculate_diff(goalie_num, offensive_num);
    var play_result;
    if(opp_goalie_pulled){
        play_result = simulator.simulate_shot_opp_goalie_pulled(game_info['clean_passes'], diff);
    } else if (goalie_pulled){
        play_result = simulator.simulate_shot_goalie_pulled(game_info['clean_passes'], get_player_type(game_json), diff);
    } else {
        play_result = simulator.simulate_shot_normal(game_info['clean_passes'], get_player_type(game_json), diff);
    }
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
        }
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Rebound"){
        game_info['puck_pos'] = (game_info['puck_pos'] == 'D') ? 'F' : 'D';
        game_info['state'] = 'defense'; 
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Save"){
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Block"){
        game_info['puck_pos'] = (game_info['clean_passes'] <= 1)? 'F' : 'D';
        game_info['poss'] = (game_info['poss'] == "H")?'A':'H';
        game_info['state'] = 'defense'; 
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Penalty"){
        game_info['poss'] = (game_info['poss'] == "H")?'A':'H';
        game_info['puck_pos'] = (game_info['clean_passes'] <= 1)? 'F' : 'D';
        game_info['state'] = 'penalty'; 
        game_info['waiting_on'] = 'O';
    } else if(play_result == "OppGoal"){
        if(game_info['poss'] == 'A'){
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
        }
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
    } 
    game_info['clean_passes'] = 0;
    game_info['moves'] -= 1;
    const embed = Embed.play_result(game_json, game_json['game_info']['state'], offensive_num, goalie_num, diff, play_result);
    return embed;
}

function run_pass(game_json, offensive_num){
    const game_info = game_json['game_info'];
    const diff = helper.calculate_diff(game_info['d_num'], offensive_num);
    const play_result = simulator.simulate_pass(get_player_type(game_json), diff);
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
        }
        game_info['state'] = 'faceoff'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Breakaway"){
        game_info['puck_pos'] = (game_info['puck_pos'] == 'D') ? 'F' : 'D';
        game_info['state'] = 'breakaway'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'O';
    } 
    else if(play_result == "2Cleans"){
        game_info['puck_pos'] = (game_info['puck_pos'] == 'D') ? 'F' : 'D';
        game_info['state'] = 'defense'; 
        game_info['clean_passes'] += 2;
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Clean"){
        game_info['puck_pos'] = (game_info['puck_pos'] == 'D') ? 'F' : 'D';
        game_info['state'] = 'defense'; 
        game_info['clean_passes'] += 1;
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Sloppy"){
        game_info['puck_pos'] = (game_info['puck_pos'] == 'D') ? 'F' : 'D';
        game_info['state'] = 'defense'; 
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Offsides"){
        game_info['state'] = 'faceoff'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Turnover"){
        game_info['puck_pos'] = (game_info['clean_passes'] <= 1)? 'F' : 'D';
        game_info['poss'] = (game_info['poss'] == "H")?'A':'H';
        game_info['state'] = 'defense'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'D';
    }
    else if(play_result == "Penalty"){
        game_info['poss'] = (game_info['poss'] == "H")?'A':'H';
        game_info['puck_pos'] = (game_info['clean_passes'] <= 1)? 'F' : 'D';
        game_info['state'] = 'penalty'; 
        game_info['waiting_on'] = 'O';
    } 
    else if(play_result == "OppGoal"){
        if(game_info['poss'] == 'A'){
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
        }
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
    } 
    game_info['moves'] -= 1;
    game_info['clean_passes'] = Math.min(game_info['clean_passes'], 4);
    const embed = Embed.play_result(game_json, game_json['game_info']['state'], offensive_num, game_info['d_num'], diff, play_result);
    return embed;
}

function run_deke(game_json, offensive_num){
    const game_info = game_json['game_info'];
    const diff = helper.calculate_diff(game_info['d_num'], offensive_num);
    const play_result = simulator.simulate_deke(get_player_type(game_json), diff);
    console.log(play_result);
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
        }
        game_info['state'] = 'faceoff'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Breakaway"){
        game_info['state'] = 'breakaway'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'O';
    } 
    else if(play_result == "2Cleans"){
        game_info['state'] = 'defense'; 
        game_info['clean_passes'] += 2;
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Success"){
        game_info['state'] = 'defense'; 
        game_info['clean_passes'] += 1;
        game_info['waiting_on'] = 'D';
    } 
    else if(play_result == "Fail"){
        game_info['puck_pos'] = (game_info['clean_passes'] <= 1)? 'F' : 'D';
        game_info['poss'] = (game_info['poss'] == "H")?'A':'H';
        game_info['state'] = 'defense'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'D';
    }
    else if(play_result == "Penalty"){
        game_info['poss'] = (game_info['poss'] == "H")?'A':'H';
        game_info['puck_pos'] = (game_info['clean_passes'] <= 1)? 'F' : 'D';
        game_info['state'] = 'penalty'; 
        game_info['waiting_on'] = 'O';
    } 
    else if(play_result == "OppGoal"){
        if(game_info['poss'] == 'A'){
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
        }
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
    } 
    game_info['moves'] -= 1;
    game_info['clean_passes'] = Math.min(game_info['clean_passes'], 4);
    const embed = Embed.play_result(game_json, game_json['game_info']['state'], offensive_num, game_info['d_num'], diff, play_result);
    return embed;
}

module.exports = {
    run_faceoff: run_faceoff,
    run_penalty: run_penalty,
    run_breakaway: run_penalty,
    run_shot: run_shot,
    run_deke: run_deke,
    run_pass: run_pass,
};