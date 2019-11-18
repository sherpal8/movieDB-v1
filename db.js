"use strict";

const cfg = require("./knexfile");
const knex = require("knex")(cfg.production);

module.exports = knex;
