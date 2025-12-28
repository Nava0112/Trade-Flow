export async function up(knex) {
    return knex.schema.createTable("trades", (table) => {
    table.increments("id").primary();
    table.string("symbol").notNullable();
    table.integer("buy_order_id").notNullable();
    table.integer("sell_order_id").notNullable();
    table.decimal("price", 14, 2).notNullable();
    table.integer("quantity").notNullable();
    table.timestamp("executed_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
    return knex.schema.dropTable("trades");
}