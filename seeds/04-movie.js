exports.seed = function(knex) {
  const tblName = "movie";
  const rows = [
    {
      director_id: 1,
      lastplaydt: "1999-07-01",
      overview: "Amazing film!",
      rating_id: 1,
      releaseyr: 1999,
      runtime: 100,
      score: 9,
      title: "Calling Gemma"
    },
    {
      director_id: 5,
      lastplaydt: "2000-06-01",
      overview: "Sad film!",
      rating_id: 2,
      releaseyr: 2000,
      runtime: 105,
      score: 8,
      title: "Calling Jack"
    },
    {
      director_id: 6,
      lastplaydt: "1998-04-03",
      overview: "Made me cry!",
      rating_id: 2,
      releaseyr: 2004,
      runtime: 90,
      score: 9,
      title: "Who is Kelly"
    },
    {
      director_id: 13,
      lastplaydt: "2000-06-01",
      overview: "Sad film!",
      rating_id: 3,
      releaseyr: 2000,
      runtime: 105,
      score: 8,
      title: "Calling Jack"
    },
    {
      director_id: 12,
      lastplaydt: "2004-04-03",
      overview: "Horrifying!",
      rating_id: 3,
      releaseyr: 2001,
      runtime: 95,
      score: 8,
      title: "Dying graceful"
    },
    {
      director_id: 11,
      lastplaydt: "2016-06-13",
      overview: "Soothing",
      rating_id: 1,
      releaseyr: 2004,
      runtime: 114,
      score: 9,
      title: "Electra"
    },
    {
      director_id: 7,
      lastplaydt: "1996-04-05",
      overview: "Laugh out loud",
      rating_id: 4,
      releaseyr: 2001,
      runtime: 195,
      score: 8,
      title: "Jo Anne"
    },
    {
      director_id: 8,
      lastplaydt: "2007-06-06",
      overview: "Love is amazing huh?",
      rating_id: 2,
      releaseyr: 2002,
      runtime: 125,
      score: 9,
      title: "Kiki"
    }
  ];
  return knex(tblName)
    .del() // removes all rows from table
    .then(function() {
      return knex(tblName).insert(rows);
    });
};
