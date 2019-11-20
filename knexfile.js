const { username, password } = require("./config");

module.exports = {
  // development
  development: {
    client: "sqlite3",
    connection: { filename: "./movie.sqlite" },
    migrations: { tableName: "knex_migrations" },
    seeds: { directory: "./seeds" },
    // to enable Foreign Keys in sqlite3, as not enabled by default
    pool: {
      afterCreate: function(conn, cb) {
        conn.run("PRAGMA foreign_keys=ON", cb);
      }
    },
    useNullAsDefault: false,
    debug: false
  },

  // production
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
