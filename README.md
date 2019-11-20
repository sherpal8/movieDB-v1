# movieDB-v1

Practise along tutoral to using knex.js to create a Movie Database.

sqlite3: Used for a local database for development.

pg: Used as database for production.

Knex: Used to create schema, also to populate data.

bluebird: To have some familiarity with 3rd party Promises.

prettyjson: To present data in terminal with greater clarity.

JSON.stringify(): To improve understanding of this method for data presentation.

Commands on CLI used include:

- knex init (creates knexfile.js)
- knex migrate:make \$desiredFileNameInMigrationsFolder (creates migrations folder for schemae building)
- knex migrate:latest (for development database)
- knex migrate:rollback (for development database)
- knex migrate:latest --env production (for production database)
- knex migrate:rollback --env production (for production database)
- knex seed:make 01-\$desiredSchemaNameInSeedFolder (number to organise schema population)
- knex seed:make 02-\$desiredSchemaNameInSeedFolder (number to organise schema population)
- knex seed:run (populate development schemae)
- knex seed:run --env production (populate production schemae)

What was learned:

1. The CRUD operations of sqlite3 as well as PG.
2. To enable Foreign Keys in sqlite3 with flag and PRAGMA statement.
3. To understand the complexities of many-to-many table.
4. Utils functions to handle, extract and process desired data for insertion e.g. many-to-many objects array.
