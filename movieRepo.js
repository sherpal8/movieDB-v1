"use strict";

const Promise = require("bluebird"); // 3rd party Promise library
const db = require("./db");

module.exports = {
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
  // list tags for a particular movie
  listTagsFor: function(movieID) {
    return db("tag AS t")
      .select("t.id", "t.name AS text")
      .joinRaw("JOIN tag_movie tm ON tm.tag_id=t.id AND tm.movie_id=?", movieID)
      .then();
  },
  listActorsFor: function(movieID) {
    return db("person AS p")
      .select(db.raw("p.id, p.firstname || ' ' || p.lastname as text"))
      .join("actor_movie AS am", "am.person_id", "p.id")
      .where("am.movie_id", movieID)
      .then();
  }
};
