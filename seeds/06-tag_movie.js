exports.seed = function(knex) {
  const tblName = "tag_movie";
  const rows = [
    // The Rock
    { movie_id: 1, tag_id: 2 }, // Action
    // Night at the Museum
    { movie_id: 2, tag_id: 2 }, // Action
    { movie_id: 2, tag_id: 4 }, // Comedy
    // Angels Always
    { movie_id: 3, tag_id: 7 } // Martial Arts
  ];
  return knex(tblName)
    .del() // removes all rows from table
    .then(function() {
      return knex(tblName).insert(rows);
    });
};
