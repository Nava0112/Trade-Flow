
exports.up = function(knex) {
  return knex.schema.createTable('stocks', function(table) {
    table.string('symbol').primary();
    table.string('name', 100).notNullable();
    table.decimal('price').notNullable();
    table.decimal('day_high').notNullable();
    table.decimal('day_low').notNullable();
    table.bigInteger('volume').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('stocks');
};
