const { username, password } = require("./config");

module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./movie.sqlite" },
    migrations: { tableName: "knex_migrations" },
    seeds: { directory: "./seeds" },
    useNullAsDefault: false,
    debug: false
  },
  production: {
    client: "pg",
    connection: {
      host: "localhost",
      database: "movie",
      user: username
    },
    migrations: { tableName: "knex_migrations" },
    seed: { directory: "./seeds" },
    debug: false
  }
};
