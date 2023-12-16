const {create_mongo_client, create_mongo_db_conn} = require('./create_mongo_client.js');

async function upsert_team(team_json){
    const client = create_mongo_client();
    const db = create_mongo_db_conn(client);
    const teams = db.collection('teams');
    let filter = {team_code:team_json["team_code"]};
    
    /* Set the upsert option to insert a document if no documents match
    the filter */
    const options = { upsert: true };
    // Specify the update to set a value for the plot field
    const updateDoc = {
      $set: team_json,
    };
    // Update the first document that matches the filter
    const result = await teams.updateOne(filter, updateDoc, options);
    client.close();
}

async function upsert_player(player_json, id_type){
    const client = create_mongo_client();
    const db = create_mongo_db_conn(client);
    const players = db.collection('players');
    //Change if add other sites than discord
    console.log(player_json);
    let filter = {discord_id:player_json["discord_id"]}; 
    
    /* Set the upsert option to insert a document if no documents match
    the filter */
    const options = { upsert: true };
    // Specify the update to set a value for the plot field
    const updateDoc = {
      $set: player_json,
    };
    // Update the first document that matches the filter
    const result = await players.updateOne(filter, updateDoc, options);
    client.close();
}

// Gets all the unique values for a key in a collection across documents
async function get_distinct_values(collection_name, key_name){
    const client = create_mongo_client();
    const db = await create_mongo_db_conn(client);
    const collection = db.collection(collection_name);
    const pipeline = [
        {
          $group: {
            _id: `$${key_name}` // Group by the specified field
          }
        },
        {
          $project: {
            _id: true // Include the distinct values
          }
        }
    ];
    const distinctValues = await collection.aggregate(pipeline).toArray();
    //console.log(distinctValues.map(element => element["_id"]));
    client.close();
    return distinctValues.map(element => element["_id"]);
}
module.exports = {
    add_team: upsert_team,
    add_player: upsert_player,
    edit_team: upsert_team,
    edit_player: upsert_player,
    get_distinct_values: get_distinct_values
};