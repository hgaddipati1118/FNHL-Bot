const {create_mongo_client, create_mongo_db_conn} = require('./create_mongo_client.js');

const client = create_mongo_client();
const db = create_mongo_db_conn(client);
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    //Create the different collections
    await createPlayerCollection();
    await createTeamCollection();
    await createGameCollection();
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

async function createPlayerCollection(){
    //Delete collection if created already
    db.dropCollection('players', (err, res) => {
        if (err) {
          console.error('Error dropping collection:', err.message);
          return;
        }
      
        console.log('Collection dropped successfully!');
    });

    await db.createCollection('players', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['name', 'pos', 'type', 'team_code'],
            properties: {
              name: {
                bsonType: 'string'
              },
              pos: {
                bsonType: 'int'
              },
              type: {
                bsonType: 'int'
              },
              team_code: {
                bsonType: 'string'
              }
            }
          }
        }
      });
}

async function createTeamCollection(){
     //Delete collection if created already
     db.dropCollection('teams', (err, res) => {
        if (err) {
          console.error('Error dropping collection:', err.message);
          return;
        }
      
        console.log('Collection dropped successfully!');
    });

    await db.createCollection('teams', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['team_code', 'team_name', 'stadium'],
            properties: {
              team_code: {
                bsonType: 'string'
              },
              team_name: {
                bsonType: 'string'
              },
              stadium: {
                bsonType: 'string'
              }
            }
          }
        }
      });
    const teams = db.collection('teams');
    await teams.createIndex({ team_code: 1 }, (err, res) => {
        if (err) {
          console.error('Error creating index:', err.message);
          return;
        }
      
        console.log('Index created successfully!');
      });
}

async function createGameCollection(){
     //Delete collection if created already
     db.dropCollection('games', (err, res) => {
        if (err) {
          console.error('Error dropping collection:', err.message);
          return;
        }
      
        console.log('Collection dropped successfully!');
    });

    await db.createCollection('games', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['home_code', 'away_code', 'period', 'stadium', 'moves', 'status', 'clean_passes', 'home_score', 'away_score', 
            'pos', 'waiting_on', 'defense_num', 'home_goalie_nums', 'away_goalie_nums', 'home_goalie_pulled', 'away_goalie_pulled',
            'last_action'
        ],
            properties: {
              home_code: {
                bsonType: 'string'
              },
              away_code: {
                bsonType: 'string'
              },
              period: {
                bsonType: 'int'
              },
              stadium: {
                bsonType: 'string'
              },
              movies: {
                bsonType: 'int'
              },
              status: {
                bsonType: 'int'
              },
              clean_passes: {
                bsonType: 'int'
              },
              home_score: {
                bsonType: 'int'
              },
              away_score: {
                bsonType: 'int'
              },
              pos: {
                bsonType: 'int'
              },
              waiting_on: {
                bsonType: 'int'
              },
              defense_num: {
                bsonType: 'int'
              },
              home_goalie_pulled:{
                bsonType: 'bool'
              },
              away_goalie_pulled:{
                bsonType: 'bool'
              },
              last_action:{
                bsonType: 'timestamp'
              }

            }
          }
        }
      });
}