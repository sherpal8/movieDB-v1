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
  addMovie,
  updateMovie
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
  id: 32, // if id = 0, it means no ID has been assigned to it yet
  rating_id: 4, // rating of R
  director_id: 12, // director name: 'Ms J' ---> refers to ID in 'person' table
  actors: [15, 12], // name: 'DDA'
  tags: [12, 7], // Martial Arts, Drama
  title: "The Last Samurai Princess 3",
  releaseyr: 2003,
  score: 10,
  runtime: 154,
  lastplaydt: "2015-10-20",
  overview: "Part 2 - A Japanese film that the whole world loves."
};

updateMovie(newMovieObj) // to view the new movie object inserted: use get4Edit(), as below
  .then(function(result) {
    write(result, "pretty");
  })
  .catch(function(error) {
    console.log(error);
  })
  .finally(function() {
    db.destroy();
  });

// get4Edit(8) // movieID (best to check output.txt to see if ID exists) -> NOTE: different in postgress and sqlite3
//   .then(function(result) {
//     write(result, "pretty");
//   })
//   .catch(function(err) {
//     console.log(err);
//   })
//   .finally(function() {
//     db.destroy();
//   });
