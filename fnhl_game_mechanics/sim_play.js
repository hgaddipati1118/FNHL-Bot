const helper = require('helper_methods.js');
const ranges = require('ranges.js');
//Function simulates user passing
function simulate_pass(player_type, game_state, defensive_num, offensive_num){
    let diff = helper.calculate_diff(defensive_num, offensive_num);
    //Passing Ranges go [Goal, Breakaway, 2 cleans, Clean, Sloppy, Offsides, Turnover, Penalty, Opp. Goal]
    
}