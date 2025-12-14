export async function up(knex) {
    return knex.schema.createTable('transactions', function(table) {

        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('order_id').unsigned().notNullable();
        table.foreign('order_id').references('id').inTable('orders').onDelete('RESTRICT');
        table.enum('type', ['BUY', 'SELL']).notNullable();
        table.string('symbol', 10).notNullable();
        table.integer('quantity').unsigned().notNullable();
        table.decimal('price_per_share', 10, 2).notNullable(); 
        table.decimal('total_amount', 15, 2).notNullable(); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('executed_at').defaultTo(knex.fn.now());
        table.index('user_id');
        table.index('order_id');
        table.index('symbol');
        table.index('executed_at');
    });
}

export async function down(knex) {
    return knex.schema.dropTableIfExists('transactions');
}