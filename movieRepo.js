"use strict";

const Promise = require("bluebird"); // 3rd party Promise library
const db = require("./db");
const { parseSortString, idToMMObjArr } = require("./db-util");

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
      .select(db.raw("p.id, p.firstname || ' ' || p.lastname AS text"))
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
      .count("* AS total")
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
  },
  // ------------delete movie with given id --------------
  deleteMovie: function(movieID) {
    return db("movie")
      .del() // avoid using `delete` as its a javascript word too, to avoid conflict
      .where("id", movieID)
      .then(function(numberRowsDeleted) {
        return numberRowsDeleted;
      });
  },
  // ------------add new 'movie-graph' i.e. movie object --------------
  addMovie: function(movieObj) {
    // extract out the actors/ tags array from the 'movie graph' i.e. the new movie object
    const actors = movieObj.actors;
    const tags = movieObj.tags;
    // process movie object to have the desired entries only
    delete movieObj.actors;
    delete movieObj.tags;
    // remove id as it is not the correctly auto-generated id value from the 'movie' table
    delete movieObj.id;
    // to be used later
    let actorsObj = {};
    let tagsObj = {};
    // as this is a many-to-many data entry, best to have a knex.transaction(function(){}) set up
    return db.transaction(function(trx) {
      return (
        trx("movie")
          .insert(movieObj, "id")
          .then(function(movieId) {
            // next, assign the correct generated ID
            movieObj.id = movieId[0];
            // utils functions used for many-to-many object
            actorsObj = idToMMObjArr(
              "person_id",
              actors,
              "movie_id",
              movieId[0]
            );
            tagsObj = idToMMObjArr("tag_id", tags, "movie_id", movieId[0]);
            // insert newly created actors object into actor_movie table
            return trx("actor_movie").insert(actorsObj, "person_id");
          })
          // resolved cb function above returns 'person_id'
          .then(function(person_id) {
            // insert new created tags object into tag_movie table
            return trx("tag_movie").insert(tagsObj, "tag_id");
          })
          // resolved cb function above returns 'tag_id'
          .then(function(tag_id) {
            return movieObj.id; // return the auto assigned ID to the newly inserted movie object
          })
      );
    });
  }
};

module.exports = objFunc;
