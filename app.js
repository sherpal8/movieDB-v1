"use strict";

const db = require("./db");
const { clearTerminalScreen, write } = require("./screen");

clearTerminalScreen();

db("movie")
  .count()
  .then(function(result) {
    write(result, "pretty");
  })
  .catch(function(error) {
    console.log(error);
  })
  .finally(function() {
    db.destroy();
  });
