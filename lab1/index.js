const express = require("express");
const app = express();
const configRoutes = require("./routes");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Middleware 1
app.use((req, res, next) => {
  console.log("======= Middleware =======")
  console.log("Request body:");
  console.log(JSON.stringify(req.body));
  console.log("URL path: " + req.path);
  console.log("Request verb: " + req.method);
  next();
});

const reqcount = {};
// Middleware 2
app.use((req, res, next) => {
  if (req.path in reqcount) {
    reqcount[req.path] += 1;
  } else {
    reqcount[req.path] = 1;
  }
  console.log("Current route visited " + reqcount[req.path] + " time(s)");
  console.log("");
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
