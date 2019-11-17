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
