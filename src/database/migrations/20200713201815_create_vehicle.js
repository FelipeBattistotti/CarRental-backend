
exports.up = function(knex) {
    return knex.schema.createTable('vehicle', function (table) {
        table.increments();
        table.string('plate').notNullable();
        
        table.string('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('user');
      })
};

exports.down = function(knex) {
    return knex.schema.dropTable('vehicle');
};
