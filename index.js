const cool = require("cool-ascii-faces");
const express = require("express");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 5000;

let client, db, collection;

function showTimes() {
  let result = "";
  const times = process.env.TIMES || 5;

  for (let index = 0; index < times; index++) {
    result += index + " ";
  }

  return result;
}

(async () => {
  try {
    client = await MongoClient.connect(process.env.QOVERY_DATABASE_QOVERY_CONNECTION_URI, {
      useUnifiedTopology: true,
      writeConcern: { wtimeout: 2500 },
    });

    db = await client.db("heroku");
    collection = await db.collection("n-node-js-getting-started");

    express()
      .get("/", (req, res) => res.send('hello nodejs'))
      .get("/cool", (req, res) => res.send(cool()))
      .get("/db", async (req, res) => {
        try {
          const results = await collection.find({}).toArray();
          res.json(results)
        } catch (error) {
          console.error(error);
          res.send(`Error: ${error}`);
        }
      })
      .get("/times", (req, res) => res.send(showTimes()))
      .listen(PORT, () => console.log(`Listening on ${PORT}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
