const knex = require("knex");

exports.up = knex =>  knex.schema.createTable("dishes", table => {
    table.increments("id");
    table.text("title");
    table.text("category")
    table.varchar("image")
    table.text("price")
    table.text("description")


});


exports.down = knex =>  knex.schema.dropTable("dishes");
