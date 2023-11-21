// Update with your config settings.
require("dotenv").config({
  path: "./.env",
});

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "pg",
    connection: process.env.DB_URL || {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    // connection: {
    //   database: "pokedicts",
    //   // user: DB_USER,
    //   // password: DB_PASSWORD,
    // },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
