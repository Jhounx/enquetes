/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("enquetes", (table) => { 
        table.increments("id").primary();
        table.integer("ownerId").notNullable();
        table.string("title", 40).notNullable();
        table.string("description", 165).notNullable()
        table.dateTime("startAt").notNullable();
        table.dateTime("endAt").notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("enquetes");
};
