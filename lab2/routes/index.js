const mainRoutes = require('./main');

const constructorMethod = app => {
  app.use("/", mainRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "404: Not found" });
  });

};

module.exports = constructorMethod;
