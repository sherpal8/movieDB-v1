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
  listMovies,
  deleteMovie,
  addMovie
} = require("./movieRepo");
const { listPeople, addPerson } = require("./personRepo");

clearTerminalScreen();

const queryFilter = { pgNum: 1, pgSize: 10, sort: "title" };

const newPersonInfo = {
  firstname: "Kiki",
  lastname: "Lolita",
  name: "Ms J"
};

const newMovieObj = {
  id: 0, // new movie as no ID has been assigned to it yet
  rating_id: 4, // rating of R
  director_id: 21, // director name: 'Ms J' ---> refers to ID in 'person' table
  actors: [16], // name: 'DDA'
  tags: [2, 7], // Action, Drama
  title: "The Last Samurai Princess",
  releaseyr: 2004,
  score: 10,
  runtime: 1254,
  lastplaydt: "2015-10-20",
  overview: "A Japanese film that the whole world loves."
};

addMovie(newMovieObj)
  .then(function(result) {
    write(result, "pretty");
  })
  .catch(function(error) {
    console.log(error);
  })
  .finally(function() {
    db.destroy();
  });
