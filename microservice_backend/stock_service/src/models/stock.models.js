import db from "../db/knex.js";

const STOCK_COLUMNS = [
  "symbol",
  "name",
  "price",
  "day_high",
  "day_low",
  "volume",
  "created_at",
  "updated_at",
];

const sanitizeStockUpdate = (data) => {
  const allowed = ["name", "price", "day_high", "day_low", "volume"];
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => allowed.includes(key))
  );
};


export const getStocks = async () => {
  return db("stocks").select(STOCK_COLUMNS);
};

export const getStockBySymbol = async (symbol) => {
  return db("stocks").where({ symbol }).first();
};


export const addStock = async ({
  symbol,
  name,
  price,
  day_high,
  day_low,
  volume,
}) => {
  const [stock] = await db("stocks")
    .insert({
      symbol,
      name,
      price,
      day_high,
      day_low,
      volume,
    })
    .returning(STOCK_COLUMNS);

  return stock;
};


export const deleteStockBySymbol = async (symbol) => {
  const deleted = await db("stocks").where({ symbol }).del();
  return deleted > 0;
};


export const updateStockPrice = async (symbol, price) => {
  const [stock] = await db("stocks")
    .where({ symbol })
    .update({
      price,
      updated_at: db.fn.now(),
    })
    .returning(STOCK_COLUMNS);

  return stock || null;
};


export const updateStock = async (symbol, stockData) => {
  const sanitized = sanitizeStockUpdate(stockData);

  if (Object.keys(sanitized).length === 0) {
    return null;
  }

  const [stock] = await db("stocks")
    .where({ symbol })
    .update({
      ...sanitized,
      updated_at: db.fn.now(),
    })
    .returning(STOCK_COLUMNS);

  return stock || null;
};


export const getStocksByPriceRange = async (minPrice, maxPrice) => {
  return db("stocks")
    .whereBetween("price", [minPrice, maxPrice])
    .orderBy("price", "asc");
};
