const express = require("express");
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

/**
 * Shows the task with the supplied id
 */
router.get("/:id", async (req, res) => {
  try {
    const task = await taskData.getTaskById(req.params.id);
    res.json(task);
  } catch (e) {
    console.log('Error:', e);
    res.status(404).json({ message: "not found!" });
  }
});

/**
 * Shows a list of tasks
 */
router.get("/", async (req, res) => {
  let len = 20;
  let start = 0;
  try {
    if (req.query.skip) {
      start = parseInt(req.query.skip);
      start = isNaN(start) ? 0 : start;
      start = start < 0 ? 20 : start;
    }
    if (req.query.take) {
      len = parseInt(req.query.take);
      len = isNaN(len) ? 20 : len;
      len = len < 0 ? 20 : len;
      len = len > 100 ? 100 : len;
    }
    const taskList = await taskData.getAllTasks();
    res.json(taskList.slice(start, start + len));
  } catch (e) {
    console.log('Error:', e);
    res.status(500).send();
  }
});

/**
 * Creates a new task with the supplied details
 */
router.post("/", async (req, res) => {
  try { 
    if (!req.body.title || !req.body.description || !req.body.hoursEstimated) {
      throw "Insufficient data supplied for POST request";
    }
    if (typeof req.body.title !== 'string') {
      throw "Invalid title";
    }
    if (typeof req.body.description !== 'string') {
      throw "Invalid description";
    }
    if (typeof req.body.hoursEstimated !== 'number') {
      throw "Invalid hoursEstimated";
    }
    if (typeof req.body.completed !== 'boolean' && typeof req.body.completed !== 'undefined') {
      throw "Invalid hoursEstimated";
    }
    const newTask = await taskData.addTask(
      req.body.title,
      req.body.description,
      req.body.hoursEstimated,
      req.body.completed
    );
    res.status(200).json(newTask);
  } catch (e) {
    console.log('Error:', e);
    res.status(400).send();
  }
});

/**
 * Updates the task with the supplied id
 */
router.put("/:id", async (req, res) => {
  try { 
    if (!req.body.title || !req.body.description || !req.body.hoursEstimated || !req.body.completed) {
      throw "You must supply all fields in a PUT request";
    }
    if (typeof req.body.title !== 'string') {
      throw "Invalid title";
    }
    if (typeof req.body.description !== 'string') {
      throw "Invalid description";
    }
    if (typeof req.body.hoursEstimated !== 'number') {
      throw "Invalid hoursEstimated";
    }
    if (typeof req.body.completed !== 'boolean' && typeof req.body.completed !== 'undefined') {
      throw "Invalid hoursEstimated";
    }
    const updatedTask = await taskData.updateTask(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      hoursEstimated: req.body.hoursEstimated,
      completed: req.body.completed
    })
    res.status(200).json(updatedTask);
  } catch (e) {
    console.log('Error:', e);
    res.status(400).send();
  }
});

/**
 * Updates the task with the supplied id
 */
router.patch("/:id", async (req, res) => {
  try { 
    if (!(typeof req.body.title === 'string' || typeof req.body.title === 'undefined')) {
      throw "Invalid title";
    }
    if (!(typeof req.body.description === 'string' || typeof req.body.description === 'undefined')) {
      throw "Invalid description";
    }
    if (!(typeof req.body.hoursEstimated === 'number' || typeof req.body.hoursEstimated === 'undefined')) {
      throw "Invalid hoursEstimated";
    }
    if (!(typeof req.body.completed === 'boolean' || typeof req.body.completed === 'undefined')) {
      throw "Invalid hoursEstimated";
    }
    const updatedTask = await taskData.updateTask(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      hoursEstimated: req.body.hoursEstimated,
      completed: req.body.completed
    })
    res.status(200).json(updatedTask);
  } catch (e) {
    console.log('Error:', e);
    res.status(400).send();
  }
});

/**
 * Adds a new comment to the task
 */
router.post("/:id/comments", async (req, res) => {
  try { 
    if (typeof req.body.name !== 'string') {
      throw "Invalid name";
    }
    if (typeof req.body.comment !== 'string') {
      throw "Invalid comment";
    }
    const newComment = await taskData.addComment(req.params.id, req.body.name, req.body.comment);
    res.status(200).json(newComment);
  } catch (e) {
    console.log('Error:', e);
    res.status(400).send();
  }
});

/**
 * Deletes the comment with the given id on the task with the given id
 */
router.delete("/:taskId/:commentId", async (req, res) => {
  try { 
    const newComment = await taskData.removeComment(req.params.taskId, req.params.commentId);
    res.status(200).json(newComment);
  } catch (e) {
    console.log('Error:', e);
    res.status(404).json({ message: "not found!" });
  }
});

module.exports = router;
