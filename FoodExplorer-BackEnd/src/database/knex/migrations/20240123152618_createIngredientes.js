
exports.up = knex => knex.schema.createTable("ingredients", table => {
    table.increments("id")
    table.text("name")
    table.integer("dishes_id").references("id").inTable("dishes").toDelete("CASCADE")

});


exports.down = knex => knex.schema.dropTable("ingredients");
