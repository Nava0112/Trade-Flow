
export async function up(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 100).notNullable().unique();
    table.string('password', 100).notNullable();
    table.string('role', 50).notNullable().defaultTo('user');
    table.decimal('balance').notNullable();
    table.decimal('locked_balance').notNullable().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

export async function down(knex) {
  return knex.schema.dropTableIfExists('users');
};
