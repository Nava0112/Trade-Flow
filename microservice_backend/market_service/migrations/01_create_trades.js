export async function up(knex) {
    return knex.schema.createTable("trades", (table) => {
    table.increments("id").primary();
    table.string("symbol").notNullable();
    table
      .integer("buy_order_id")
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .integer("sell_order_id")
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table.decimal("price", 14, 2).notNullable();
    table.integer("quantity").notNullable();
    table.timestamp("executed_at").defaultTo(knex.fn.now());

    table.foreign("symbol").references("symbol").inTable("stocks");
  });
}

export async function down(knex) {
    return knex.schema.dropTable("trades");
}