exports.seed = function(knex) {
  const tblName = "rating";
  const rows = [
    { name: "G" },
    { name: "PG" },
    { name: "PG-13" },
    { name: "R" }
  ];
  return knex(tblName)
    .del() // removes all rows from table
    .then(function() {
      return knex(tblName).insert(rows);
    });
};
