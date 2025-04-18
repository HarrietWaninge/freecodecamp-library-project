require("dotenv").config();
const { MongoClient } = require("mongodb");

async function main(callback) {
  const URI = process.env.DB;
  const client = new MongoClient(URI);

  try {
    client.connect();
    await callback(client).then(() => {
      console.log("successfully connected to the database");
    });
  } catch {
    // Catch any errors
    console.error(e);
    throw new Error("Unable to Connect to Database");
  }
}

module.exports = main;
