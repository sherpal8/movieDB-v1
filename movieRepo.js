"use strict";

const Promise = require("bluebird"); // 3rd party Promise library
const db = require("./db");
const { parseSortString } = require("./db-util");

const objFunc = {
  // list all tags
  listTags: function() {
    return db("tag")
      .select("id", "name AS text")
      .then();
  },
  // list all ratings
  listRatings: function() {
    return db("rating")
      .select("id", "name AS text")
      .then();
  },
  // get movie with specific ID
  getMovie: function(movieID) {
    return db("movie AS m")
      .join("person AS p", "p.id", "m.director_id")
      .select("m.*", "p.name AS director")
      .where("m.id", movieID)
      .first()
      .then();
  },
  // list tags for a particular movie id
  listTagsFor: function(movieID) {
    return db("tag AS t")
      .select("t.id", "t.name AS text")
      .joinRaw("JOIN tag_movie tm ON tm.tag_id=t.id AND tm.movie_id=?", movieID)
      .then();
  },
  // list actors for a particular movie id
  listActorsFor: function(movieID) {
    return db("person AS p")
      .select(db.raw("p.id, p.firstname || ' ' || p.lastname as text"))
      .join("actor_movie AS am", "am.person_id", "p.id")
      .where("am.movie_id", movieID)
      .then();
  },
  // returns a movie object for editing, along with its associated data
  get4Edit: function(movieID) {
    const pMovie = objFunc.getMovie(movieID),
      pActors = objFunc.listActorsFor(movieID),
      pTags = objFunc.listTagsFor(movieID);
    return Promise.all([pMovie, pActors, pTags]).then(function(results) {
      const movieData = results[0];
      movieData.actors = results[1];
      movieData.tags = results[2];
      return movieData;
    });
  },

  // lists movies matching the given query filter (qf)
  listMovies: function(qf) {
    const result = {},
      sort = parseSortString(qf.sort, "m.id"),
      pgSize = Math.min(qf.pgSize, 10),
      offset = (qf.pgNum - 1) * pgSize;
    return db("movie")
      .count("* as total")
      .then(function(rows) {
        result.total = rows[0].total;
        return result;
      })
      .then(function() {
        return db("movie AS m")
          .select(
            "m.id",
            "m.title",
            "m.lastplaydt",
            "m.score",
            "m.runtime",
            "m.releaseyr",
            "r.name as rating"
          )
          .join("rating AS r", "r.id", "m.rating_id")
          .limit(pgSize)
          .offset(offset)
          .orderBy(sort.column, sort.direction)
          .then();
      })
      .then(function(rows) {
        result.pgSize = pgSize;
        result.items = rows;
        return result;
      });
  }
};

module.exports = objFunc;
