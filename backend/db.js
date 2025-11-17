// db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected");

    db = client.db("Hive");   // use sample database

  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };
