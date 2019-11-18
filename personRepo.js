"use strict";

const Promise = require("bluebird"); // 3rd party Promise library
const db = require("./db");

module.exports = {
  listPeople: function(searchText) {
    return db("person")
      .select("id", "name AS text")
      .whereRaw("LOWER(name) like '%' || LOWER(?) || '%'", searchText) // 'binding' used to avoid SQL injection as its raw
      .orderBy("name")
      .then();
  }
};
