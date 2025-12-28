export async function up(knex) {
    return knex.schema.createTable('portfolios', function (table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('symbol').notNullable();
        table.integer('quantity').notNullable().checkPositive();
        table.integer('locked_quantity').notNullable().defaultTo(0);
        table.decimal('average_buy_price', 10, 2).notNullable();
        table.unique(['user_id', 'symbol']);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    return knex.schema.dropTableIfExists('portfolios');
}
