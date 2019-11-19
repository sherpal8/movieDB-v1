const { username, password } = require("./config");

module.exports = {
  development: {
    client: "sqlite3",
    connection: { filename: "./movie.sqlite" },
    migrations: { tableName: "knex_migrations" },
    seeds: { directory: "./seeds" },
    // sqlite3 does not have default FK set-up
    // therefore this code allows FK (and, 'CASCADE') on delete
    pool: {
      afterCreate: function(conn, cb) {
        conn.run("PRAGMA foreign_keys=ON", cb);
      }
    },
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
