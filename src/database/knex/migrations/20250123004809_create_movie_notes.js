exports.up = knex => knex.schema.createTable("moovies_notes", table => {
    table.increments("id");
    table.text("title").notNullable();
    table.text("description");
    table.integer("rating").notNullable().checkBetween([0, 10]);
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("moovies_notes");
