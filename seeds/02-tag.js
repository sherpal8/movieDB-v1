exports.seed = function(knex) {
  const tblName = "tag";
  const rows = [
    { name: "3D" },
    { name: "Action" },
    { name: "Animation" },
    { name: "Comedy" },
    { name: "Crime" },
    { name: "Disaster" },
    { name: "Drama" },
    { name: "Family" },
    { name: "Holiday" },
    { name: "Horror" },
    { name: "Martial Arts" },
    { name: "Musical" },
    { name: "Mystery" },
    { name: "Romance" },
    { name: "Sci-Fi" },
    { name: "Sports" },
    { name: "Suspense" },
    { name: "Thriller" },
    { name: "War" },
    { name: "Western" }
  ];
  return knex(tblName)
    .del() // removes all rows from table
    .then(function() {
      return knex(tblName).insert(rows);
    });
};
