export async function up(knex) {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();

    table.integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table.enum('type', ['DEPOSIT', 'WITHDRAW', 'BUY', 'SELL'])
      .notNullable();

    // Amount of money affected (always positive)
    table.decimal('amount', 15, 2).notNullable();

    table.enum('status', ['PENDING', 'SUCCESS', 'FAILED'])
      .notNullable()
      .defaultTo('PENDING');

    // Nullable because DEPOSIT / WITHDRAW have no order
    table.integer('order_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('orders')
      .onDelete('SET NULL');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('executed_at').nullable();

    table.index('user_id');
    table.index('type');
    table.index('status');
    table.index('order_id');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('transactions');
}
