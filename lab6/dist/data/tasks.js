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
const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const node_uuid_1 = require("node-uuid");
let exportedMethods = {
    getAllTasks() {
        return tasks().then(taskCollection => {
            return taskCollection.find({}).toArray();
        });
    },
    getTaskById(id) {
        return tasks().then(taskCollection => {
            return taskCollection.findOne({ _id: id }).then(task => {
                if (!task)
                    throw "Task not found";
                return task;
            });
        });
    },
    addTask(title, description, hoursEstimated, completed) {
        return tasks().then(taskCollection => {
            const newTask = {
                _id: node_uuid_1.v4(),
                title,
                description,
                hoursEstimated,
                completed: completed ? completed : false,
                comments: [],
            };
            return taskCollection
                .insertOne(newTask)
                .then(newTaskInformation => {
                return newTaskInformation.insertedId;
            })
                .then(newId => {
                return this.getTaskById(newId);
            });
        });
    },
    removeTask(id) {
        return tasks().then(taskCollection => {
            return taskCollection.removeOne({ _id: id }).then(deletionInfo => {
                if (deletionInfo.deletedCount === 0) {
                    throw `Could not delete task with id of ${id}`;
                }
            });
        });
    },
    updateTask(id, newParams) {
        return tasks().then(taskCollection => {
            this.getTaskById(id).then(updatedTask => {
                updatedTask = {
                    title: newParams.title ? newParams.title : updatedTask.title,
                    description: newParams.description ? newParams.description : updatedTask.description,
                    hoursEstimated: newParams.hoursEstimated ? newParams.hoursEstimated : updatedTask.hoursEstimated,
                    completed: (typeof newParams.completed !== 'undefined') ? newParams.completed : updatedTask.completed,
                    comments: newParams.comments ? newParams.comments : updatedTask.comments,
                };
                return taskCollection.updateOne({ _id: id }, { $set: updatedTask }).then(() => {
                    return this.getTaskById(id);
                });
            });
        });
    },
    addComment(id, name, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return tasks().then(taskCollection => {
                this.getTaskById(id).then(currentTask => {
                    currentTask.comments.push({
                        _id: node_uuid_1.v4(),
                        name,
                        comment,
                    });
                    return taskCollection.updateOne({ _id: id }, { $set: currentTask }).then(() => {
                        return this.getTaskById(id);
                    });
                });
            });
        });
    },
    removeComment(taskId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return tasks().then(taskCollection => {
                this.getTaskById(taskId).then(currentTask => {
                    if (!currentTask) {
                        throw "Task not found";
                    }
                    currentTask.comments = currentTask.comments.filter(comment => comment._id != commentId);
                    return taskCollection.updateOne({ _id: taskId }, { $set: currentTask }).then(() => {
                        return this.getTaskById(taskId);
                    });
                }).catch(e => console.log(e));
            });
        });
    },
};
module.exports = exportedMethods;
