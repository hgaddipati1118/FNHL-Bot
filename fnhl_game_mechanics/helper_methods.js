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

module.exports = {
    calculate_diff: calculate_diff
};