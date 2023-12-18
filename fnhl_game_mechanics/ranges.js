// Passing Ranges [Goal, Breakaway, 2 cleans, Clean, Sloppy, Offsides, Turnover, Penalty, Opp. Goal]
const passing_ranges = [
    [0, 15, 25, 310, 400, 425, 480, 499, 500], // Playmaker
    [0, 15, 25, 270, 390, 415, 480, 499, 500], // Sniper
    [0, 15, 25, 280, 395, 420, 480, 499, 500], // Dangler
    [0, 15, 25, 310, 400, 425, 480, 499, 500], // Offensive Def.
    [0, 15, 25, 270, 390, 415, 480, 499, 500], // Two-Way Def.
    [0, 15, 25, 280, 395, 420, 480, 499, 500] // Finesser
];

// Deking Ranges [Goal, Breakaway, 2 cleans, Success, Fail, Penalty, Opp. Goal]
const deking_ranges = [
    [0, 15, 45, 280, 480, 499, 500], // Playmaker
    [0, 15, 45, 290, 480, 499, 500], // Sniper
    [0, 15, 65, 300, 480, 499, 500], // Dangler
    [0, 15, 45, 280, 480, 499, 500], // Offensive Def.
    [0, 15, 45, 280, 480, 499, 500], // Two-Way Def.
    [0, 15, 65, 300, 480, 499, 500] // Finesser
];

// Penalty Shot Ranges [Goal, Save]
const penalty_shot_ranges = [
    [175, 500], // Playmaker
    [190, 500], // Sniper
    [160, 500], // Dangler
    [175, 500], // Offensive Def.
    [190, 500], // Two-Way Def.
    [160, 500] // Finesser
];

// Faceoff Ranges [Win +1 CP, Win, Lose, Lose +1 CP]
const faceoff_ranges = [15, 250, 485, 500];

// Zero Clean Passes Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const zero_cp_ranges = [
    [20, 120, 325, 480, 499, 500], // Playmaker
    [32, 145, 367, 480, 499, 500], // Sniper
    [22, 125, 332, 480, 499, 500], // Dangler
    [17, 110, 315, 480, 499, 500], // Offensive Def.
    [25, 130, 350, 480, 499, 500], // Two-Way Def.
    [19, 116, 323, 480, 499, 500] // Finesser
];

// One Clean Passes Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const one_cp_ranges = [
    [68, 172, 332, 480, 499, 500], // Playmaker
    [74, 205, 360, 480, 499, 500], // Sniper
    [70, 175, 335, 480, 499, 500], // Dangler
    [63, 155, 318, 480, 499, 500], // Offensive Def.
    [72, 195, 348, 480, 499, 500], // Two-Way Def.
    [65, 166, 325, 480, 499, 500] // Finesser
];

// Two Clean Passes Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const two_cp_ranges = [
    [108, 184, 338, 480, 499, 500], // Playmaker
    [125, 215, 367, 480, 499, 500], // Sniper
    [114, 189, 346, 480, 499, 500], // Dangler
    [108, 180, 328, 480, 499, 500], // Offensive Def.
    [120, 202, 353, 480, 499, 500], // Two-Way Def.
    [105, 178, 324, 480, 499, 500] // Finesser
];

// Three Clean Passes Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const three_cp_ranges = [
    [137, 250, 355, 480, 499, 500], // Playmaker
    [160, 268, 373, 480, 499, 500], // Sniper
    [145, 262, 361, 480, 499, 500], // Dangler
    [128, 245, 350, 480, 499, 500], // Offensive Def.
    [153, 261, 367, 480, 499, 500], // Two-Way Def.
    [134, 249, 351, 480, 499, 500] // Finesser
];

// Four Clean Passes Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const four_cp_ranges = [
    [160, 257, 358, 480, 499, 500], // Playmaker
    [186, 285, 388, 480, 499, 500], // Sniper
    [167, 267, 366, 480, 499, 500], // Dangler
    [150, 240, 345, 480, 499, 500], // Offensive Def.
    [175, 272, 375, 480, 499, 500], // Two-Way Def.
    [156, 248, 352, 480, 499, 500] // Finesser
];

// Zero Clean Passes Pulled Goalie Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const zero_cp_p_ranges = [
    [23, 124, 333, 480, 499, 500], // Playmaker
    [36, 150, 373, 480, 499, 500], // Sniper
    [26, 131, 339, 480, 499, 500], // Dangler
    [20, 114, 319, 480, 499, 500], // Offensive Def.
    [27, 133, 352, 480, 499, 500], // Two-Way Def.
    [23, 120, 330, 480, 499, 500] // Finesser
];

// One Clean Passes Pulled Goalie Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const one_cp_p_ranges = [
    [74, 177, 338, 480, 499, 500], // Playmaker
    [84, 218, 368, 480, 499, 500], // Sniper
    [77, 180, 342, 480, 499, 500], // Dangler
    [69, 166, 330, 480, 499, 500], // Offensive Def.
    [77, 201, 358, 480, 499, 500], // Two-Way Def.
    [73, 175, 334, 480, 499, 500] // Finesser
];

// Two Clean Passes Pulled Goalie Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const two_cp_p_ranges = [
    [117, 189, 346, 480, 499, 500], // Playmaker
    [133, 223, 378, 480, 499, 500], // Sniper
    [120, 195, 360, 480, 499, 500], // Dangler
    [113, 189, 340, 480, 499, 500], // Offensive Def.
    [128, 218, 361, 480, 499, 500], // Two-Way Def.
    [115, 185, 338, 480, 499, 500] // Finesser
];

// Three Clean Passes Pulled Goalie Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const three_cp_p_ranges = [
    [149, 262, 371, 480, 499, 500], // Playmaker
    [175, 277, 382, 480, 499, 500], // Sniper
    [157, 269, 376, 480, 499, 500], // Dangler
    [140, 251, 363, 480, 499, 500], // Offensive Def.
    [171, 270, 375, 480, 499, 500], // Two-Way Def.
    [147, 258, 367, 480, 499, 500] // Finesser
];

// Four Clean Passes Pulled Goalie Shot Ranges [Goal, Rebound, Save, Block, Penalty, Opp. Goal]
const four_cp_p_ranges = [
    [171, 269, 372, 480, 499, 500], // Playmaker
    [198, 295, 385, 480, 499, 500], // Sniper
    [175, 274, 376, 480, 499, 500], // Dangler
    [165, 265, 378, 480, 499, 500], // Offensive Def.
    [190, 284, 381, 480, 499, 500], // Two-Way Def.
    [164, 267, 380, 480, 499, 500] // Finesser
];

// Opponent Pulled Goalie Zero Clean Passes Shot Ranges [Goal, Rebound, Block, Penalty, Opp. Goal]
const zero_cp_opp_p_ranges = [
    60, 170, 475, 499, 500
]

// Opponent Pulled Goalie One Clean Passes Shot Ranges [Goal, Rebound, Block, Penalty, Opp. Goal]
const one_cp_opp_p_ranges = [
    175, 270, 475, 499, 500
]

// Opponent Pulled Goalie Two Clean Passes Shot Ranges [Goal, Rebound, Block, Penalty, Opp. Goal]
const two_cp_opp_p_ranges = [
    250, 350, 475, 499, 500
]

// Opponent Pulled Goalie Three Clean Passes Shot Ranges [Goal, Rebound, Block, Penalty, Opp. Goal]
const three_cp_opp_p_ranges = [
    350, 425, 475, 499, 500
]

// Opponent Pulled Goalie Four Clean Passes Shot Ranges [Goal, Rebound, Block, Penalty, Opp. Goal]
const four_cp_opp_p_ranges = [
    350, 425, 475, 499, 500
]
// Export the ranges
module.exports = {
    passing_ranges: passing_ranges,
    deking_ranges: deking_ranges,
    penalty_shot_ranges: penalty_shot_ranges,
    faceoff_ranges: faceoff_ranges,
    zero_cp_ranges: zero_cp_ranges,
    one_cp_ranges: one_cp_ranges, 
    two_cp_ranges: two_cp_ranges, 
    three_cp_ranges: three_cp_ranges, 
    four_cp_ranges: four_cp_ranges,
    zero_cp_p_ranges: zero_cp_p_ranges, 
    one_cp_p_ranges: one_cp_p_ranges, 
    two_cp_p_ranges: two_cp_p_ranges, 
    three_cp_p_ranges: three_cp_p_ranges, 
    four_cp_p_ranges: four_cp_p_ranges,
    zero_cp_opp_p_ranges: zero_cp_opp_p_ranges, 
    one_cp_opp_p_ranges: one_cp_opp_p_ranges, 
    two_cp_opp_p_ranges: two_cp_opp_p_ranges, 
    three_cp_opp_p_ranges: three_cp_opp_p_ranges, 
    four_cp_opp_p_ranges: four_cp_opp_p_ranges  
};