"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const tasks_1 = require("./routes/tasks");
const reqcount = {};
class App {
    constructor() {
        this.taskRoutes = new tasks_1.Tasks();
        this.Middleware1 = (req, res, next) => {
            console.log("======= Middleware =======");
            console.log("Request body:");
            console.log(JSON.stringify(req.body));
            console.log("URL path: " + req.path);
            console.log("Request verb: " + req.method);
            next();
        };
        this.Middleware2 = (req, res, next) => {
            if (req.path in reqcount) {
                reqcount[req.path] += 1;
            }
            else {
                reqcount[req.path] = 1;
            }
            console.log("Current route visited " + reqcount[req.path] + " time(s)");
            console.log("");
            next();
        };
        this.app = express();
        this.config();
        this.taskRoutes.routes(this.app);
        this.app.use("*", (req, res) => {
            res.status(404).json({ error: "Not found" });
        });
    }
    config() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(this.Middleware1);
        this.app.use(this.Middleware2);
    }
}
exports.default = new App().app;
