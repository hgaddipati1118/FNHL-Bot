const helper = require('./helper_methods');
const ranges = require('./ranges');

//Function simulates user passing
function simulate_pass(player_type, defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Passing Ranges go [Goal, Breakaway, 2 cleans, Clean, Sloppy, Offsides, Turnover, Penalty, Opp. Goal]
    let pass_range = ranges.passing_ranges[player_type];
    let results = ["Goal", "Breakaway", "2Cleans", "Clean", "Sloppy", "Offsides", "Turnover", "Penalty", "OppGoal"];
    let result = 0;
    while(pass_range[result] < diff){
        result++; //Finds result of play
    }
    return results[result];
}

//Function simulates user deking
function simulate_deke(player_type, defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Deking Ranges [Goal, Breakaway, 2 cleans, Success, Fail, Penalty, Opp. Goal]
    let deking_range = ranges.deke_ranges[player_type];
    let results = ["Goal", "Breakaway", "2Cleans", "Success", "Fail", "Penalty", "OppGoal"];
    let result = 0;
    while(deking_range[result] < diff){
        result++; //Finds result of play
    }
    return results[result];
}

//Function simulates user taking penalty/breakway
function simulate_penalty(player_type, defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Penalty Shot Ranges [Goal, Save]
    let penalty_range = ranges.penalty_shot_ranges[player_type];
    let results = ["Goal", "Save"];
    let result = 0;
    while(penalty_range[result] < diff){
        result++; //Finds result of play
    }
    return results[result];
}

//Function simulates user faceoff
function simulate_faceoff(defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Faceoff Ranges [Win +1 CP, Win, Lose, Lose +1 CP]
    let faceoff_range = ranges.faceoff_ranges[player_type];
    let results = ["WinCP", "Win","Loss","LossCP"];
    let result = 0;
    while(faceoff_range[result] < diff){
        result++; //Finds result of play
    }
    return results[result];
}

//Function simulates user shot without own goalie or opp. goalie pulled
function simulate_shot_normal(clean_passes, player_type, defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
    let shot_range = ranges.cp_ranges[clean_passes][player_type];
    let results = ["Goal", "Rebound","Save","Block", "Penalty", "OppGoal"];
    let result = 0;
    while(shot_range[result] < diff){
        result++; //Finds result of play
    }
    return results[result];
}

//Function simulates user shot with own goalie pulled and opp. goalie not pulled
function simulate_shot_goalie_pulled(clean_passes, player_type, defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
    let shot_range = ranges.cp_p_ranges[clean_passes][player_type];
    let results = ["Goal", "Rebound","Save","Block", "Penalty", "OppGoal"];
    let result = 0;
    while(shot_range[result] < diff){
        result++; //Finds result of play
    }
    return results[result];
}

//Function simulates user shot with opp. goalie pulled
function simulate_shot_opp_goalie_pulled(clean_passes, defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
    let shot_range = ranges.cp_opp_p_ranges[clean_passes];
    let results = ["Goal", "Rebound","Save","Block", "Penalty", "OppGoal"];
    let result = 0;
    while(shot_range[result] < diff){
        result++; //Finds result of play
    }
    return results[result];
}

// Export the simulators
module.exports = {
    simulate_deke: simulate_deke,
    simulate_faceoff: simulate_faceoff,
    simulate_pass: simulate_pass,
    simulate_penalty: simulate_penalty,
    simulate_shot_normal: simulate_shot_normal,
    simulate_shot_goalie_pulled,
    simulate_shot_opp_goalie_pulled
};