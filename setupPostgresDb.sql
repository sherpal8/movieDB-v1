-- DROP DATABASE IF EXISTS movie;
-- CREATE DATABASE movie;

\c movie
\dt

SELECT * FROM rating;
SELECT * FROM tag;
SELECT * FROM person;
SELECT * FROM movie;
SELECT * FROM actor_movie;
SELECT * FROM tag_movie;

\q

