const express = require('express');
const router = express.Router();
const getById = require('../data/people');
const bluebird = require('bluebird');
const redis = require('redis');
const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

/**
 * Shows the most recent 20 people in the cache
 */
router.get("/history", async (req, res) => {
  try {
    const recentIds = await client.lrangeAsync('recent', 0, 19);
    const recentPeople = [];
    for (const id of recentIds) {
      const person = await client.getAsync(id);
      recentPeople.push(JSON.parse(person));
    }
    res.status(200).json(recentPeople);
  } catch (e) {
    console.log('Error: ', e);
    res.status(404).json({ message: "404: History not found!" });
  }
});

/**
 * Shows the person with the given id
 */
router.get('/:id', async (req, res) => {
  try {
    const exists = await client.existsAsync(req.params.id);
    if (exists) {
      const person = await client.getAsync(req.params.id);
      await client.lpushAsync('recent', req.params.id);
      res.json(JSON.parse(person));
    } else {
      const person = await getById(req.params.id);
      await client.setAsync(req.params.id, JSON.stringify(person));
      await client.lpushAsync('recent', req.params.id);
      res.json(person);
    }
  } catch (e) {
    console.log('Error: person with specified id not found: ', e);
    res.status(404).json({ message: "404: Person with specified ID not found!" });
  }
});

module.exports = router;
