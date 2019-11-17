exports.seed = function(knex) {
  const tblName = "actor_movie";
  const rows = [
    // the Rock
    { movie_id: 1, person_id: 2 }, // Sean Connery
    { movie_id: 1, person_id: 3 }, // Nicolas Cage
    { movie_id: 1, person_id: 4 }, // Ed Harris
    // Night at the Museum
    { movie_id: 2, person_id: 7 }, // Ben Stiller
    { movie_id: 2, person_id: 8 }, // Gemma Chi
    { movie_id: 2, person_id: 9 }, // Coco Chanel
    { movie_id: 2, person_id: 10 }, // Carmen K
    { movie_id: 2, person_id: 11 }, // Ms. Tan
    { movie_id: 2, person_id: 12 }, // Kimmy K.
    // Angels Always
    { movie_id: 3, person_id: 13 }, // Wakama Kaya
    { movie_id: 3, person_id: 14 }, // Naobi Kuende
    { movie_id: 3, person_id: 1 }, // Lizzy Teh
    { movie_id: 3, person_id: 15 } // Glorious Fuele
  ];
  return knex(tblName)
    .del() // removes all rows from table
    .then(function() {
      return knex(tblName).insert(rows);
    });
};
