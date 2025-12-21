export async function up(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.decimal("locked_balance", 14, 2).notNullable().defaultTo(0);
  });

  await knex.schema.alterTable("portfolios", (table) => {
    table
      .integer("locked_quantity")
      .notNullable()
      .defaultTo(0);
  });

  await knex.schema.alterTable("orders", (table) => {
    table
      .integer("filled_quantity")
      .notNullable()
      .defaultTo(0);
  });

  // Fix portfolio quantity constraint (allow zero)
  await knex.raw(`
    ALTER TABLE portfolios
    DROP CONSTRAINT IF EXISTS portfolios_quantity_check
  `);

  await knex.raw(`
    ALTER TABLE portfolios
    ADD CONSTRAINT portfolios_quantity_check CHECK (quantity >= 0)
  `);

  // Trades table (core execution record)
  await knex.schema.createTable("trades", (table) => {
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
  await knex.schema.dropTableIfExists("trades");

  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("filled_quantity");
  });

  await knex.schema.alterTable("portfolios", (table) => {
    table.dropColumn("locked_quantity");
  });

  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("locked_balance");
  });

  // Restore old portfolio constraint (quantity > 0)
  await knex.raw(`
    ALTER TABLE portfolios
    DROP CONSTRAINT IF EXISTS portfolios_quantity_check
  `);

  await knex.raw(`
    ALTER TABLE portfolios
    ADD CONSTRAINT portfolios_quantity_check CHECK (quantity > 0)
  `);
}
