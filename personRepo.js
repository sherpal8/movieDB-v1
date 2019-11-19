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
  },
  // inserts a person object and **resolves** to its ID (meaning, the callback returns its 'id')
  addPerson: function(newPerson) {
    return db("person")
      .insert(newPerson, "id") // 2nd arg is the column data we want upon a resolved callback
      .then();
  }
};
