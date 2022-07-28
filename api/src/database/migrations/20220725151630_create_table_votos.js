/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("votos", (table)=> { 
        table.integer("enqueteId").notNullable()
        table.integer("ownerId").notNullable()
        table.integer("opcaoId").notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("votos")
};
