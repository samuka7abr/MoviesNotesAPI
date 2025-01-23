exports.up = knex => knex.schema.createTable("moovies_tags", table => {
    table.increments("id");
    table.text("name").notNullable();
  
    table.integer("moovie_id").references("id").inTable("moovies_notes").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users");
});

exports.down = knex => knex.schema.dropTable("moovies_tags");
