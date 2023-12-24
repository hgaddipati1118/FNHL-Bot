const simulator = require('./play_simulators');
const Embed = require('./embed');
const helper = require('./helper_methods');
const { send } = require('process');
const helper_methods = require('./helper_methods');
const channel_ids = {
    'FNHL Power Play': '763682731270995969',
    'FNHL Play Log': '1188228858961461317',
    'FNHL Scores': '752023105647542284',
    'FNHL Score Updates': '1188232378452299848'
}
async function run_play(game_json, offensive_num, interaction){
    if(game_json['game_info']['state'] == 'faceoff'){
        return await run_faceoff(game_json, offensive_num, interaction);
    } 
    else if (game_json['game_info']['state'] == 'breakaway'){
        return await run_penalty(game_json, offensive_num, interaction);
    } 
    else if (game_json['game_info']['state'] == 'penalty'){
        return await run_penalty(game_json, offensive_num, interaction);
    }
    else if (game_json['game_info']['state'] == 'pass'){
        return await run_pass(game_json, offensive_num, interaction);
    }
    else if (game_json['game_info']['state'] == 'deke'){
        return await run_deke(game_json, offensive_num, interaction);
    } else if(game_json['game_info']['state'] == 'shot'){
        return await run_shot(game_json, offensive_num, interaction);
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

function get_off_player_name(game_json){
    let player_info = game_json['player_info'];
    let game_info = game_json['game_info'];
    if(game_info['puck_pos'] == 'D'){
        if(game_info['poss'] == 'H'){
            return player_info['home_d']['name'];
        }
        else {
            return player_info['away_d']['name'];
        }
    }
    else {
        if(game_info['poss'] == 'H'){
            return player_info['home_f']['name'];
        }
        else {
            return player_info['away_f']['name'];
        }
    }
}

async function run_faceoff(game_json, offensive_num, interaction){
    const game_info = game_json['game_info'];
    const diff = helper.calculate_diff(game_info['d_num'], offensive_num);
    const play_result = simulator.simulate_faceoff(diff);
    await add_to_play_log(game_json, 'faceoff', offensive_num, 'faceoff', diff, play_result);
    const pp = game_info['moves'] <= 3;
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
    await send_to_play_log(embed, interaction, game_json, pp);
    return embed;
}

async function run_penalty(game_json, offensive_num, interaction){
    const game_info = game_json['game_info'];
    const pen_break = game_info['state'];
    var goalie_num;
    if(game_info['poss'] == 'H'){
        goalie_num = game_info['away_gk_nums'].shift();
    } else {
        goalie_num = game_info['home_gk_nums'].shift();
    }
    const diff = helper.calculate_diff(goalie_num, offensive_num);
    const play_result = simulator.simulate_penalty(get_player_type(game_json), diff);
    await add_to_play_log(game_json, pen_break, offensive_num, pen_break, diff, play_result);
    game_info['waiting_on'] = 'D';
    game_info['clean_passes'] = 0;
    game_info['moves'] -= 1;
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
            await process_goal(game_json, 'H', interaction);
        } else {
            game_info['away_score'] += 1;
            await process_goal(game_json, 'A', interaction);
        }
    }
    game_info['state'] = 'faceoff'; 
    const embed = Embed.play_result(game_json, pen_break, offensive_num, goalie_num, diff, play_result);
    await send_to_play_log(embed, interaction, game_json, true);
    return embed;
}

async function run_shot(game_json, offensive_num, interaction){
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
    await add_to_play_log(game_json, 'normal', offensive_num, 'shot', diff, play_result);
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
            await process_goal(game_json, 'H', interaction);
        } else {
            game_info['away_score'] += 1;
            await process_goal(game_json, 'A', interaction);
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
            await process_goal(game_json, 'H', interaction);
        } else {
            game_info['away_score'] += 1;
            await process_goal(game_json, 'A', interaction);
        }
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
    } 
    game_info['clean_passes'] = 0;
    game_info['moves'] -= 1;
    const embed = Embed.play_result(game_json, 'shot', offensive_num, game_info['d_num'], diff, play_result);
    await send_to_play_log(embed, interaction, game_json, true);
    return embed;
}

async function run_pass(game_json, offensive_num, interaction){
    const game_info = game_json['game_info'];
    const diff = helper.calculate_diff(game_info['d_num'], offensive_num);
    const play_result = simulator.simulate_pass(get_player_type(game_json), diff);
    await add_to_play_log(game_json, 'normal', offensive_num, 'pass', diff, play_result);
    let pp = (game_info['clean_passes'] >= 3 || game_info['moves'] <= 3);
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
            await process_goal(game_json, 'H', interaction);
        } else {
            game_info['away_score'] += 1;
            await process_goal(game_json, 'A', interaction);
        }
        game_info['state'] = 'faceoff'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'D';
        pp = true;
    } 
    else if(play_result == "Breakaway"){
        game_info['puck_pos'] = (game_info['puck_pos'] == 'D') ? 'F' : 'D';
        game_info['state'] = 'breakaway'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'O';
        pp = true;
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
        pp = true;
    } 
    else if(play_result == "OppGoal"){
        if(game_info['poss'] == 'A'){
            await process_goal(game_json, 'H', interaction);
            game_info['home_score'] += 1;
        } else {
            game_info['away_score'] += 1;
            await process_goal(game_json, 'A', interaction);
        }
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
        pp = true;
        game_info['clean_passes'] = 0;
    } 
    game_info['moves'] -= 1;
    game_info['clean_passes'] = Math.min(game_info['clean_passes'], 4);
    const embed = Embed.play_result(game_json, 'pass', offensive_num, game_info['d_num'], diff, play_result);
    await send_to_play_log(embed, interaction, game_json, pp);
    return embed;
}

async function run_deke(game_json, offensive_num, interaction){
    const game_info = game_json['game_info'];
    let pp = false;
    if(game_info['clean_passes'] >= 3 || game_info['moves'] <= 3) {
        pp = true;
    }
    const diff = helper.calculate_diff(game_info['d_num'], offensive_num);
    const play_result = simulator.simulate_deke(get_player_type(game_json), diff);
    await add_to_play_log(game_json, 'normal', offensive_num, 'deke', diff, play_result);
    if(play_result == "Goal"){
        if(game_info['poss'] == 'H'){
            game_info['home_score'] += 1;
            await process_goal(game_json, 'H', interaction);
        } else {
            game_info['away_score'] += 1;
            await process_goal(game_json, 'A', interaction);
        }
        game_info['state'] = 'faceoff'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'D';
        pp = true;
    } 
    else if(play_result == "Breakaway"){
        game_info['state'] = 'breakaway'; 
        game_info['clean_passes'] = 0;
        game_info['waiting_on'] = 'O';
        pp = true;
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
        pp = true;
    } 
    else if(play_result == "OppGoal"){
        if(game_info['poss'] == 'A'){
            game_info['home_score'] += 1;
            await process_goal(game_json, 'H', interaction);
        } else {
            game_info['away_score'] += 1;
            await process_goal(game_json, 'A', interaction);
        }
        game_info['clean_passes'] = 0;
        game_info['state'] = 'faceoff'; 
        game_info['waiting_on'] = 'D';
        pp = true;
    } 
    game_info['moves'] -= 1;
    game_info['clean_passes'] = Math.min(game_info['clean_passes'], 4);
    const embed = Embed.play_result(game_json, 'deke', offensive_num, game_info['d_num'], diff, play_result);
    await send_to_play_log(embed, interaction, game_json, pp);
    return embed;
}

async function process_goal(game_json, scoring_team, interaction){
    const game_info = game_json['game_info'];
    if(scoring_team == 'H'){
        await interaction.channel.send(game_json['home_team_role'] + ' GOALLLLLLLL!!!!!');
    } else {
        await interaction.channel.send(game_json['away_team_role'] + ' GOALLLLLLLL!!!!!');
    }
    const score_channel = await interaction.guild.channels.fetch(channel_ids['FNHL Score Updates']);
        await score_channel.send(
        `**Score Update**\n${game_json['away_team_emoji']} ${game_json['away_team']} ${game_info["away_score"]} | ${game_json['home_team_emoji']} ${game_json['home_team']} ${game_info["home_score"]} | ${game_info["period"]} (${game_info["moves"]})`);
}
async function send_to_play_log(embed, interaction, game_json, pp){
    embed['fields'].push({
        name: 'Channel',
        value: `<#${game_json['channel_id']}>`
    })
    const play_channel = await interaction.guild.channels.fetch(channel_ids['FNHL Play Log']);
    await play_channel.send({ embeds: [embed] });
    if(pp){
        const pp_channel = await interaction.guild.channels.fetch(channel_ids['FNHL Power Play']);
        await pp_channel.send({embeds: [embed] });
    }
}

async function add_to_play_log(game_json, type, offensive_num, call, diff, result){
    const game_info = game_json['game_info'];
    const play_log = [game_json['week'], game_json['home_team'], game_json['away_team'], type,
    game_info['poss'], get_off_player_name(game_json), offensive_num, 
    game_info['poss'] == 'H' ? game_json['player_info']['away_d']['name']: game_json['player_info']['home_d']['name'], game_info['d_num'],
    call, diff, result, game_info['home_gk_pulled'], game_info['away_gk_pulled'],
    game_info['period'], game_info['moves'], game_info['home_score'], game_info['away_score'], game_info['clean_passes']];
    helper_methods.send_to_game_log(play_log);
}
module.exports = {
    run_faceoff: run_faceoff,
    run_penalty: run_penalty,
    run_breakaway: run_penalty,
    run_shot: run_shot,
    run_deke: run_deke,
    run_pass: run_pass,
};