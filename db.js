"use strict";

const cfg = require("./knexfile");
const knex = require("knex")(cfg.development); // production || development

module.exports = knex;
