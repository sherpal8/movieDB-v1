exports.up = function(knex) {
  return knex.schema.createTable("person", function(tbl) {
    // primary key
    tbl.increments("id");
    // fields
    tbl
      .string("firstname", 30)
      .notNullable()
      .defaultTo("n/a");
    tbl
      .string("lastname", 30)
      .notNullable()
      .defaultTo("n/a");
    tbl
      .string("junk", 60)
      .notNullable()
      .defaultTo("n/a");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("person");
};
