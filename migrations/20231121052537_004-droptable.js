/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.dropTable("pokedict");
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.createTable("pokedict", function (table) {
    table.increments("id").primary();
    table.integer("user_id", 8);
    table.integer("pokemon_id", 8);
    table.integer("eng_name", 16);
    table.integer("jp_name", 16);
    table.integer("img_url", 256);
    table.boolean("correct_or_incorrect");
  });
};
