"use strict";

const Promise = require("bluebird"); // 3rd party Promise library
const db = require("./db");
const { parseSortString, idToMMObjArr, getMMDelta } = require("./db-util");

const objFunc = {
  // ------------ Query functions --------------
  // return tag IDs for a movie ---> specifically: to be used to extract value for updateMovie() below
  getTagIDsFor: function(movieID) {
    return db("tag_movie")
      .pluck("tag_id")
      .where("movie_id", movieID)
      .then();
  },
  // return actor IDs for a movie ---> specifically: to be used to extract value for updateMovie() below
  getActorIDsFor: function(movieID) {
    return db("actor_movie")
      .pluck("person_id")
      .where("movie_id", movieID)
      .then();
  },
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
        // knex delete() cb returns number rows deleted by default
        return numberRowsDeleted;
      });
  },
  // ------------add new 'movie-graph' i.e. movie object --------------
  addMovie: function(movieObj) {
    // extract out the actors/ tags array from the 'movie graph' i.e. the new movie object
    const movieObjCopy = { ...movieObj };
    const actors = movieObjCopy.actors;
    const tags = movieObjCopy.tags;
    // process movie object to have the desired entries only
    delete movieObjCopy.actors;
    delete movieObjCopy.tags;
    // remove id as it is not the correctly auto-generated id value from the 'movie' table
    delete movieObjCopy.id;
    // to be used later
    let actorsObjArr = [];
    let tagsObjArr = [];
    // as this is a many-to-many data entry, best to have a knex.transaction(function(){}) set up
    return db.transaction(function(trx) {
      return (
        trx("movie")
          .insert(movieObjCopy, "id")
          .then(function(movieId) {
            // next, assign the correct generated ID
            movieObjCopy.id = movieId[0];
            // utils functions used for many-to-many object
            actorsObjArr = idToMMObjArr(
              "person_id",
              actors,
              "movie_id",
              movieId[0]
            );
            tagsObjArr = idToMMObjArr("tag_id", tags, "movie_id", movieId[0]);
            // insert newly created actors object into actor_movie table
            if (actorsObjArr.length > 0) {
              return trx("actor_movie").insert(actorsObjArr, "person_id");
            }
          })
          // resolved cb function above returns 'person_id'
          .then(function(person_id) {
            // insert new created tags object into tag_movie table
            if (tagsObjArr.length > 0) {
              return trx("tag_movie").insert(tagsObjArr, "tag_id");
            }
          })
          // resolved cb function above returns 'tag_id'
          .then(function(tag_id) {
            return movieObjCopy.id; // return the auto assigned ID to the newly inserted movie object
          })
      );
    });
  },

  // ------------ Update function --------------
  updateMovie: function(newMovieObj) {
    // make copy of the original input data i.e. newMovieObject to avoid mutation of original data
    const newMovieObjCopy = { ...newMovieObj };
    // extract out desired values into consts
    const movieID = newMovieObjCopy.id;
    const newActorIDs = newMovieObjCopy.actors;
    const newTagIDs = newMovieObjCopy.tags;
    // now, remove unwanted properties to allow for update
    delete newMovieObjCopy.actors;
    delete newMovieObjCopy.tags;
    delete newMovieObjCopy.id;

    // variables to hold actors/tags to add/delete from the movie schema
    let actorDelta = [],
      tagDelta = [];

    // get existing actor/ tag ids for the movie
    return Promise.all([
      objFunc.getActorIDsFor(movieID),
      objFunc.getTagIDsFor(movieID)
    ])
      .then(function(results) {
        // get changes to add/del hence `delta`
        actorDelta = getMMDelta(
          newActorIDs,
          results[0],
          "person_id",
          "movie_id",
          movieID
        );
        tagDelta = getMMDelta(
          newTagIDs,
          results[1],
          "tag_id",
          "movie_id",
          movieID
        );
      })
      .then(function() {
        return db.transaction(function(trx) {
          // purpose of funcArr below:
          // to avoid sql_misuse error when attempting to insert empty array into sqlite3
          // therefore, only includes knex.insert() commands if tag/actors addition arrays not empty
          let funcArr = [];
          if (actorDelta.additionArr.length > 0) {
            possibleFuncArr.push(
              trx("actor_movie").insert(actorDelta.additionArr)
            );
            if (tagDelta.additionArr.length > 0) {
              possibleFuncArr.push(
                trx("tag_movie").insert(tagDelta.additionArr)
              );
            }
          }
          return Promise.all([
            trx("movie")
              .where("id", movieID)
              .update(newMovieObjCopy),
            trx("actor_movie")
              .whereIn("person_id", actorDelta.deletionArr)
              .andWhere("movie_id", movieID)
              .del(),
            trx("tag_movie")
              .whereIn("tag_id", tagDelta.deletionArr)
              .andWhere("movie_id", movieID)
              .del(),
            ...funcArr
            // trx("actor_movie").insert(actorDelta.additionArr), // inserted into funcArr to overcome sql_misuse err
            // trx("tag_movie").insert(tagDelta.additionArr) // // inserted into funcArr to overcome sql_misuse err
          ]).then(function(result) {
            const labelArr = [
              "Insert into movie table:",
              "Delete from actor_movie table:",
              "Delete from tag_movie table:",
              "Insert into actor_movie table:",
              "Insert into tag_movie table:"
            ];
            return result.map(function(eachOutcome, i) {
              if (eachOutcome === 1) {
                return labelArr[i] + " successful operation";
              }
              return labelArr[i] + " unsuccessful operation";
            });
          });
        });
      });
  }
};

module.exports = objFunc;
