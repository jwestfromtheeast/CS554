"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data = require("../data");
const taskData = data.tasks;
class Tasks {
    routes(app) {
        app.route('/api/tasks/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield taskData.getTaskById(req.params.id);
                res.json(task);
            }
            catch (e) {
                console.log("Error in fetching task:", e);
                res.status(404).json({ message: "Task with supplied id not found!" });
            }
        }));
        app.route('/api/tasks/').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let len = 20;
            let start = 0;
            try {
                if (req.query.skip) {
                    start = Number(req.query.skip);
                    start = isNaN(start) ? 0 : start;
                    start = start < 0 ? 20 : start;
                }
                if (req.query.take) {
                    len = Number(req.query.take);
                    len = isNaN(len) ? 20 : len;
                    len = len < 0 ? 20 : len;
                    len = len > 100 ? 100 : len;
                }
                const taskList = yield taskData.getAllTasks();
                res.json(taskList.slice(start, start + len));
            }
            catch (e) {
                console.log("Error in fetching tasks:", e);
                res.status(500).send();
            }
        }));
        app.route('/api/tasks/').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.title || !req.body.description || !req.body.hoursEstimated) {
                    throw "Insufficient data supplied for POST request";
                }
                if (typeof req.body.title !== "string") {
                    throw "Invalid title";
                }
                if (typeof req.body.description !== "string") {
                    throw "Invalid description";
                }
                if (typeof req.body.hoursEstimated !== "number") {
                    throw "Invalid hoursEstimated";
                }
                if (typeof req.body.completed !== "boolean" &&
                    typeof req.body.completed !== "undefined") {
                    throw "Invalid hoursEstimated";
                }
                const newTask = yield taskData.addTask(req.body.title, req.body.description, req.body.hoursEstimated, req.body.completed);
                res.status(200).json(newTask);
            }
            catch (e) {
                console.log("Error in creating new task:", e);
                res.status(400).send();
            }
        }));
        app.route('/api/tasks/:id').put((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.title ||
                    !req.body.description ||
                    !req.body.hoursEstimated ||
                    typeof req.body.completed === 'undefined') {
                    throw "You must supply all fields in a PUT request";
                }
                if (typeof req.body.title !== "string") {
                    throw "Invalid title";
                }
                if (typeof req.body.description !== "string") {
                    throw "Invalid description";
                }
                if (typeof req.body.hoursEstimated !== "number") {
                    throw "Invalid hoursEstimated";
                }
                if (typeof req.body.completed !== "boolean" &&
                    typeof req.body.completed !== "undefined") {
                    throw "Invalid hoursEstimated";
                }
                console.log(req.body.completed);
                const updatedTask = yield taskData.updateTask(req.params.id, {
                    title: req.body.title,
                    description: req.body.description,
                    hoursEstimated: req.body.hoursEstimated,
                    completed: req.body.completed,
                });
                res.status(200).json(updatedTask);
            }
            catch (e) {
                console.log("Error:", e);
                res.status(404).json({ message: "Task with given id not found!" });
            }
        }));
        app.route('/api/tasks/:id').patch((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!(typeof req.body.title === "string" ||
                    typeof req.body.title === "undefined")) {
                    throw "Invalid title";
                }
                if (!(typeof req.body.description === "string" ||
                    typeof req.body.description === "undefined")) {
                    throw "Invalid description";
                }
                if (!(typeof req.body.hoursEstimated === "number" ||
                    typeof req.body.hoursEstimated === "undefined")) {
                    throw "Invalid hoursEstimated";
                }
                if (!(typeof req.body.completed === "boolean" ||
                    typeof req.body.completed === "undefined")) {
                    throw "Invalid hoursEstimated";
                }
                const updatedTask = yield taskData.updateTask(req.params.id, {
                    title: req.body.title,
                    description: req.body.description,
                    hoursEstimated: req.body.hoursEstimated,
                    completed: req.body.completed,
                });
                res.status(200).json(updatedTask);
            }
            catch (e) {
                console.log("Error:", e);
                res.status(404).json({ message: "Task with given id not found!" });
            }
        }));
        app.route('/api/tasks/:id/comments').post((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (typeof req.body.name !== "string") {
                    throw "Invalid name";
                }
                if (typeof req.body.comment !== "string") {
                    throw "Invalid comment";
                }
                const newComment = yield taskData.addComment(req.params.id, req.body.name, req.body.comment);
                res.status(200).json(newComment);
            }
            catch (e) {
                console.log("Error:", e);
                res.status(404).json({ message: "Task with given id not found!" });
            }
        }));
        app.route('/api/tasks/:taskId/:commentId').delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newComment = yield taskData.removeComment(req.params.taskId, req.params.commentId);
                res.status(200).json(newComment);
            }
            catch (e) {
                console.log("Error:", e);
                res.status(404).json({ message: "Comment with given id not found!" });
            }
        }));
        app.route('/api/tasks/:id').get((req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const task = yield taskData.getTaskById(req.params.id);
                res.json(task);
            }
            catch (e) {
                console.log("Error in fetching task:", e);
                res.status(404).json({ message: "Task with supplied id not found!" });
            }
        }));
    }
}
exports.Tasks = Tasks;
