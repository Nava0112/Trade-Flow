export async function up(knex) {
    return knex.schema.createTable('wallets', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.decimal('balance').notNullable();
        table.decimal('locked_balance').notNullable().defaultTo(0);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex) {
    return knex.schema.dropTable('wallets');
}
