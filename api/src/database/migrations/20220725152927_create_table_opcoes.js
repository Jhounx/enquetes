/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("opcoes", (table)=> {
        table.integer("enqueteId").notNullable()
        table.increments("opcaoId").notNullable()
        table.string("opcao_str").notNullable()
        table.integer("num_votos").defaultTo(0)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("opcoes");
};
