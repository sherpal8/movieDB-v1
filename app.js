"use strict";

const db = require("./db");
const { clearTerminalScreen, write } = require("./screen");
const {
  listTags,
  listRatings,
  getMovie,
  listTagsFor,
  listActorsFor,
  get4Edit,
  listMovies
} = require("./movieRepo");
const { listPeople } = require("./personRepo");

clearTerminalScreen();

const queryFilter = { pgNum: 1, pgSize: 10, sort: "title" };

listMovies(queryFilter)
  .then(function(result) {
    write(result, "pretty");
  })
  .catch(function(error) {
    console.log(error);
  })
  .finally(function() {
    db.destroy();
  });
