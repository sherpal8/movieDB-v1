"use strict";

const cfg = require("./knexfile");
const knex = require("knex")(cfg.development);

module.exports = knex;
