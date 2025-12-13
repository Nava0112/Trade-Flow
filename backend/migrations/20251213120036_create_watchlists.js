export async function up(knex) {
    return knex.schema.createTable('watchlists', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.string('symbol', 10).notNullable();
        table.foreign('symbol').references('symbol').inTable('stocks').onDelete('CASCADE');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.unique(['user_id', 'symbol']);
        table.index('user_id');
        table.index('symbol');
    });
}

export async function down(knex) {
    return knex.schema.dropTableIfExists('watchlists');
}