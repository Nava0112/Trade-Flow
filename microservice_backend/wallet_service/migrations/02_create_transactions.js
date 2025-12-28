export async function up(knex) {
  return knex.schema.createTable('transactions', function (table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable().references('id').inTable('wallets').onDelete('CASCADE');
    table.enum('type', ['DEPOSIT', 'WITHDRAW', 'BUY', 'SELL']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.enum('status', ['PENDING', 'SUCCESS', 'FAILED']).notNullable().defaultTo('PENDING');
    table.integer('order_id').unsigned().nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('executed_at').nullable();
    table.index('type');
    table.index('status');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('transactions');
}
