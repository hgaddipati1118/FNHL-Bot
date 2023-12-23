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

async function upsert_game(game_json){
  const client = create_mongo_client();
  const db = create_mongo_db_conn(client);
  const games = db.collection('games');
  let filter = { channel_id: game_json['channel_id'], game_active: true }; 
  
  /* Set the upsert option to insert a document if no documents match
  the filter */
  const options = { upsert: true };
  // Specify the update to set a value for the plot field
  const updateDoc = {
    $set: game_json,
  };
  // Update the first document that matches the filter
  const result = await games.updateOne(filter, updateDoc, options);
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

//Return a single document given filter, used for finding specific player or team
async function find_one_document(collection_name, filter) {
  const client = create_mongo_client();
  try {
    const db = await create_mongo_db_conn(client);
    const collection = db.collection(collection_name);
    const result = await collection.findOne(filter);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
      client.close();
      console.log('Connection closed');
  }
}

//Delete a single document given filter
async function delete_one_document(collection_name, filter) {
  const client = create_mongo_client();
  try {
    const db = await create_mongo_db_conn(client);
    const collection = db.collection(collection_name);
    const result = await collection.deleteOne(filter);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
      client.close();
      console.log('Connection closed');
  }
}

module.exports = {
    add_team: upsert_team,
    add_player: upsert_player,
    add_game: upsert_game,
    update_team: upsert_team,
    update_player: upsert_player,
    update_game: upsert_game,
    get_distinct_values: get_distinct_values,
    get_document: find_one_document,
    delete_document: delete_one_document,
};