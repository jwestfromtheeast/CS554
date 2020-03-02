const people = require('./peopleData');

const getById = (async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id >= 1 && id <= 1000) {
            resolve(people[id - 1]);
        } else {
            reject(new Error("Invalid person ID! ID should be between 1 and 1000."));
        }}, 5000);
      });
})

module.exports = getById;