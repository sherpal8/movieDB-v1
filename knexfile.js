const { username, password } = require("./config");
console.log(username);
module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./movie.sqlite" },
    migrations: { tableName: "knex_migrations" },
    seeds: { directory: "./seeds" },
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
