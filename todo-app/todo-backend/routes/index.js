const express = require('express');
const router = express.Router();
const redis = require("redis");

const configs = require('../util/config')

let visits = 0

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: configs.REDIS_URL,
  });

  redisClient.on("error", (error) => console.log("Error redis:", error));

  await redisClient.connect();

  await redisClient.set("added_todos_counter", 0)
})()

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (_, res) => {
  const added_counter = await redisClient.get("added_todos_counter")
  res.send({added_todos: Number(added_counter)});
});

module.exports = router;
