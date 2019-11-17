exports.seed = function(knex) {
  const tblName = "person";
  const rows = [
    { name: "A", firstname: "B", lastname: "C" },
    { name: "C", firstname: "B", lastname: "A" },
    { name: "B", firstname: "C", lastname: "D" },
    { name: "D", firstname: "C", lastname: "B" },
    { name: "AA", firstname: "BA", lastname: "CA" },
    { name: "CA", firstname: "AB", lastname: "AA" },
    { name: "BA", firstname: "CA", lastname: "DA" },
    { name: "DA", firstname: "CA", lastname: "BA" },
    { name: "DA", firstname: "DB", lastname: "DC" },
    { name: "DC", firstname: "DB", lastname: "DA" },
    { name: "BD", firstname: "DC", lastname: "DD" },
    { name: "DD", firstname: "CD", lastname: "BD" },
    { name: "ADA", firstname: "BDA", lastname: "CDA" },
    { name: "CDA", firstname: "ADB", lastname: "ADA" },
    { name: "BDA", firstname: "CDA", lastname: "DDA" },
    { name: "DDA", firstname: "DCA", lastname: "BDA" }
  ];
  return knex(tblName)
    .del() // removes all rows from table
    .then(function() {
      return knex(tblName).insert(rows);
    });
};
