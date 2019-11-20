"use strict";

const cfg = require("./knexfile");
const knex = require("knex")(cfg.development); // or, cfg.development

module.exports = knex;
