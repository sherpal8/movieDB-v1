"use strict";

const db = require("./db");
const { clearTerminalScreen, write } = require("./screen");
const {
  listTags,
  listRatings,
  getMovie,
  listTagsFor,
  listActorsFor
} = require("./movieRepo");
const { listPeople } = require("./personRepo");

clearTerminalScreen();

// db("movie")
//   .count()

listActorsFor(1)
  .then(function(result) {
    write(result, "pretty");
  })
  .catch(function(error) {
    console.log(error);
  })
  .finally(function() {
    db.destroy();
  });
