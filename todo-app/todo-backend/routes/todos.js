const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require("redis")
const config = require("../util/config")

let redisClient;

(async () => {
  redisClient = redis.createClient({
    url: config.REDIS_URL,
  });

  redisClient.on("error", (error) => console.log("Error redis:", error));

  await redisClient.connect();

  await redisClient.set("added_todos_counter", 0)
})()

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});



/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const added_counter = await redisClient.get("added_todos_counter")
  await redisClient.set("added_todos_counter", Number(added_counter) + 1)
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const todo = await req.todo;
  res.send(todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  req.todo.set(req.body)

  const updatedTodo = await req.todo.save()
  res.send(updatedTodo); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
