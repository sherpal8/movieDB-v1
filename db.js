"use strict";

const cfg = require("./knexfile");
const knex = require("knex")(cfg.production); // production || development

module.exports = knex;
