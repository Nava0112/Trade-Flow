import {
  getStocks,
  getStockBySymbol,
  addStock,
  deleteStockBySymbol,
  updateStockPrice,
  getStocksByPriceRange,
} from '../models/stock.models.js';

export const createStockController = async (req, res) => {
    const { symbol } = req.body;
    try { 
        const findStock = await getStockBySymbol(symbol);
        if (findStock) {
            return res.status(400).json({ error: "Stock with this symbol already exists" });
        }
        const addedStock = await addStock({ symbol });
        res.status(201).json(addedStock);
    } catch (error) {
        console.error("Error adding stock:", error);
        res.status(500).json({ error: "Internal server error in stock service" });
    }
};

export const getAllStocksController = async (req, res) => {
    try {
        const stocks = await getStocks();
        res.json({
            success : true,
            data : stocks,
            count : stocks.length,
        });
    } catch (error) {
        console.error("Error fetching stocks:", error);
        res.status(500).json({ error: "Internal server error in stock service" });
    }

    
};export const getStockBySymbolController = async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const stock = await getStockBySymbol(symbol);
        if (stock) {
            res.status(200).json(stock);
        } else {
            res.status(404).json({ error: "Stock not found" });
        }
    } catch (error) {
        console.error("Error fetching stock by symbol:", error);
        res.status(500).json({ error: "Internal server error in stock service" });
    }
};

export const deleteStockBySymbolController = async (req, res) => {
    const symbol = req.params.symbol;
    try {
        const deletedCount = await deleteStockBySymbol(symbol);
        if (deletedCount) {
            res.status(200).json({ message: "Stock deleted successfully" });
        } else {
            res.status(404).json({ error: "Stock not found" });
        }
    } catch (error) {
        console.error("Error deleting stock:", error);
        res.status(500).json({ error: "Internal server error in stock service" });
    }
};

export const updateStockPriceController = async (req, res) => {
    const symbol = req.params.symbol;
    const { price } = req.body;
    if (price === undefined || price < 0) {
        return res.status(400).json({ error: "Invalid price value" });
    }
    try {
        const updatedStock = await updateStockPrice(symbol, price);
        if (updatedStock) {
            res.status(200).json(updatedStock);
        } else {
            res.status(404).json({ error: "Stock not found" });
        }
    } catch (error) {
        console.error("Error updating stock price:", error);
        res.status(500).json({ error: "Internal server error in stock service" });
    }
};

export const getStocksByPriceRangeController = async (req, res) => {
    const minPrice = parseFloat(req.query.min);
    const maxPrice = parseFloat(req.query.max);
    if (isNaN(minPrice) || isNaN(maxPrice)) {
        return res.status(400).json({ error: "Invalid min or max price" });
    }
    if (minPrice < 0 || maxPrice < 0) {
        return res.status(400).json({ error: "Price values must be non-negative" });
    }
    try {
        const stocks = await getStocksByPriceRange(minPrice, maxPrice);
        res.status(200).json(stocks);
    } catch (error) {
        console.error("Error fetching stocks by price range:", error);
        res.status(500).json({ error: "Internal server error in stock service" });
    }
};
