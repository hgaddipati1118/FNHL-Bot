
const dotenv = require('dotenv');
//Load env in
dotenv.config();
const { MongoClient, ServerApiVersion } = require('mongodb');

function create_mongo_client(){
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    console.log(process.env.URI);
    const client = new MongoClient(process.env.URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    });
    return client;
}

function create_mongo_db_conn(client){
    // Creates db instance for client connected to our cluster
    return client.db(process.env.DB);
}

module.exports = {
    create_mongo_client:create_mongo_client,
    create_mongo_db_conn:create_mongo_db_conn
  };