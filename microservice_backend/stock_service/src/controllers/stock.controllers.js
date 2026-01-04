import {
  getStocks,
  getStockBySymbol,
  addStock,
  deleteStockBySymbol,
  updateStockPrice,
  updateStock,
  getStocksByPriceRange,
} from "../models/stock.models.js";
import logger from "../../../shared/logger/index.js";

export const createStockController = async (req, res) => {
  const { symbol, name, price, day_high, day_low, volume } = req.body;

  if (
    !symbol ||
    !name ||
    price == null ||
    day_high == null ||
    day_low == null ||
    volume == null
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (price < 0 || day_high < 0 || day_low < 0 || volume < 0) {
    return res.status(400).json({ error: "Values must be non-negative" });
  }

  if (day_low > price || price > day_high) {
    return res.status(400).json({
      error: "Invalid price range (day_low ≤ price ≤ day_high)",
    });
  }

  try {
    logger.info({
      requestId: req.requestId,
      msg: "Creating stock",
      symbol,
    });

    const existing = await getStockBySymbol(symbol);
    if (existing) {
      return res.status(400).json({ error: "Stock already exists" });
    }

    const stock = await addStock({
      symbol,
      name,
      price,
      day_high,
      day_low,
      volume,
    });

    return res.status(201).json(stock);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Error creating stock",
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllStocksController = async (req, res) => {
  try {
    const stocks = await getStocks();
    return res.status(200).json({
      success: true,
      count: stocks.length,
      data: stocks,
    });
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Error fetching stocks",
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getStockBySymbolController = async (req, res) => {
  const { symbol } = req.params;

  try {
    const stock = await getStockBySymbol(symbol);
    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }
    return res.status(200).json(stock);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Error fetching stock",
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteStockBySymbolController = async (req, res) => {
  const { symbol } = req.params;

  try {
    const deleted = await deleteStockBySymbol(symbol);
    if (!deleted) {
      return res.status(404).json({ error: "Stock not found" });
    }
    return res.status(200).json({ message: "Stock deleted successfully" });
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Error deleting stock",
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateStockPriceController = async (req, res) => {
  const { symbol } = req.params;
  const { price } = req.body;

  if (price == null || price < 0) {
    return res.status(400).json({ error: "Invalid price" });
  }

  try {
    const updated = await updateStockPrice(symbol, price);
    if (!updated) {
      return res.status(404).json({ error: "Stock not found" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Error updating stock price",
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateStockController = async (req, res) => {
  const { symbol } = req.params;
  const { name, price, day_high, day_low, volume } = req.body;

  if (
    name == null ||
    price == null ||
    day_high == null ||
    day_low == null ||
    volume == null
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (day_low > price || price > day_high) {
    return res.status(400).json({
      error: "Invalid price range (day_low ≤ price ≤ day_high)",
    });
  }

  try {
    const updated = await updateStock(symbol, {
      name,
      price,
      day_high,
      day_low,
      volume,
    });

    if (!updated) {
      return res.status(404).json({ error: "Stock not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Error updating stock",
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getStocksByPriceRangeController = async (req, res) => {
  const min = parseFloat(req.query.min);
  const max = parseFloat(req.query.max);

  if (isNaN(min) || isNaN(max) || min < 0 || max < 0 || min > max) {
    return res.status(400).json({ error: "Invalid price range" });
  }

  try {
    const stocks = await getStocksByPriceRange(min, max);
    return res.status(200).json(stocks);
  } catch (error) {
    logger.error({
      requestId: req.requestId,
      msg: "Error fetching stocks by price range",
      error: error.message,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
};
