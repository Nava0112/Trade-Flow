export async function up(knex) {
    return knex.schema.createTable('orders', function(table) {
        // Primary key
        table.increments('id').primary();
        
        // User reference
        table.integer('user_id').unsigned().notNullable();
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        
        // Stock reference
        table.string('symbol', 10).notNullable();
        table.foreign('symbol').references('symbol').inTable('stocks').onDelete('RESTRICT');
        
        // Order details
        table.enum('order_type', ['BUY', 'SELL']).notNullable();
        table.integer('quantity').unsigned().notNullable();
        table.decimal('price', 10, 2).notNullable(); // Limit price user wanted
        
        // Status - PENDING, FILLED, PARTIAL, CANCELLED, FAILED
        table.enum('status', ['PENDING', 'FILLED', 'PARTIAL', 'CANCELLED', 'FAILED']).defaultTo('PENDING');
        
        // Timestamps
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('filled_at').nullable();
        table.timestamp('cancelled_at').nullable();
        
        // Indexes for performance
        table.index('user_id');
        table.index('symbol');
        table.index('status');
        table.index('created_at');
    });
}

export async function down(knex) {
    return knex.schema.dropTableIfExists('orders');
}