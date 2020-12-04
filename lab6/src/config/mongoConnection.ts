import { MongoClient, Db } from 'mongodb';

const mongoSettings = {
  "mongoConfig": {
    "serverUrl": "mongodb://localhost:27017/",
    "database": "Westley-Justin-CS554-Lab6"
  }
}

const mongoConfig: {
  serverUrl: string,
  database: string
} = mongoSettings.mongoConfig;

let _connection: MongoClient = undefined;
let _db: Db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, { useNewUrlParser: true });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};
