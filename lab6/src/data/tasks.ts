const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
import { v4 as uuidv4 } from 'node-uuid';
import { Task, Comment } from '../types';

let exportedMethods: Object = {
    getAllTasks() {
      return tasks().then(taskCollection => {
        return taskCollection.find({}).toArray();
      });
    },
    getTaskById(id: string) {
      return tasks().then(taskCollection => {
        return taskCollection.findOne({ _id: id }).then(task => {
          if (!task) throw "Task not found";
          return task;
        });
      });
    },
    addTask(title: string, description: string, hoursEstimated: number, completed: boolean) {
      return tasks().then(taskCollection => {
        const newTask: Task = {
          _id: uuidv4(),
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
    removeTask(id: string) {
      return tasks().then(taskCollection => {
        return taskCollection.removeOne({ _id: id }).then(deletionInfo => {
          if (deletionInfo.deletedCount === 0) {
            throw `Could not delete task with id of ${id}`;
          }
        });
      });
    },
    updateTask(id: string, newParams: Task) {
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
    async addComment(id: string, name: string, comment: string) {
      return tasks().then(taskCollection => {
        this.getTaskById(id).then(currentTask => {
          currentTask.comments.push({
            _id: uuidv4(),
            name,
            comment,
          });
          return taskCollection.updateOne({ _id: id }, { $set: currentTask }).then(() => {
            return this.getTaskById(id);
          });
        });
      });
    },
    async removeComment(taskId: string, commentId: string) {
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
    },
  };
  
  module.exports = exportedMethods;