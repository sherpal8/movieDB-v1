exports.up = function(knex) {
  return (
    knex.schema

      // <rating table>
      .createTable("rating", function(tbl) {
        // PK: primary key
        tbl.increments("id");
        // UQ: unique ID
        tbl
          .string("name", 5)
          .notNullable()
          .unique("unique_rating_name");
      })

      // <movie table>
      .createTable("movie", function(tbl) {
        // PK: primary key
        tbl.increments("id");
        // FK: foreign keys
        tbl
          .integer("rating_id")
          .notNullable()
          .references("id")
          .inTable("rating")
          .onDelete("CASCADE");
        tbl
          .integer("director_id")
          .notNullable()
          .references("id")
          .inTable("person")
          .onDelete("CASCADE");
        // Fields
        tbl
          .string("title", 200)
          .notNullable()
          .defaultTo("");
        tbl.string("overview", 999);
        tbl.integer("releaseyr");
        tbl
          .integer("score")
          .notNullable()
          .defaultTo(7);
        tbl
          .integer("runtime")
          .notNullable()
          .defaultTo(90);
        tbl.date("lastplaydt");
      })

      // <tag table>
      .createTable("tag", function(tbl) {
        // PK
        tbl.increments("id");
        // UQ
        tbl
          .string("name", 30)
          .notNullable()
          .unique("uq_tag_name");
      })

      // <tag_movie table> // a 'many-to-many' table
      .createTable("tag_movie", function(tbl) {
        // PKs (incidentally, also acts as a FKs)
        tbl
          .integer("tag_id")
          .notNullable()
          .references("id")
          .inTable("tag")
          .onDelete("CASCADE");
        tbl
          .integer("movie_id")
          .notNullable()
          .references("id")
          .inTable("movie")
          .onDelete("CASCADE");
        tbl.primary(["tag_id", "movie_id"]); // primary() to specify the primary keys(s)
      })

      // <actor_movie table> // a 'many-to-many' relationship table
      .createTable("actor_movie", function(tbl) {
        // PKs also FKs
        tbl
          .integer("person_id")
          .notNullable()
          .references("id")
          .inTable("person")
          .onDelete("CASCADE");
        tbl
          .integer("movie_id")
          .notNullable()
          .references("id")
          .inTable("movie")
          .onDelete("CASCADE");
        tbl.primary(["person_id", "movie_id"]);
      })
  );
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("tag_movie")
    .dropTable("actor_movie")
    .dropTable("movie")
    .dropTable("rating")
    .dropTable("tag");
};
