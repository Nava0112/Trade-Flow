import {
    updatePortfolioForBuyService,
    updatePortfolioForSellService,
    lockStockQuantity,
    unlockStockQuantity
} from "../services/portfolio.services.js";
import {
    getPortfoliosByUserId,
    getPortfolioByUserIdAndSymbol,
    createPortfolioEntry,
    applyBuyToPortfolio,
    applySellToPortfolio,
    getPortfolioById,
    deletePortfolio,
    getPortfolios,
    getPortfolioBySymbol
} from "../models/portfolio.models.js";

export const updatePortfolioForBuyController = async (req, res) => {
    try {
        const { user_id, symbol, quantity, pricePerUnit } = req.body;
        const portfolio = await updatePortfolioForBuyService(user_id, symbol, quantity, pricePerUnit);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePortfolioForSellController = async (req, res) => {
    try {
        const { user_id, symbol, quantity } = req.body;
        const portfolio = await updatePortfolioForSellService(user_id, symbol, quantity);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllPortfoliosController = async (req, res) => {
    try {
        const portfolios = await getPortfolios();
        res.status(200).json(portfolios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const portfolio = await getPortfolioById(id);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioByUserIdController = async (req, res) => {
    try {
        const { user_id } = req.params;
        const portfolios = await getPortfoliosByUserId(user_id);
        res.status(200).json(portfolios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioByUserIdAndSymbolController = async (req, res) => {
    try {
        const { user_id, symbol } = req.params;
        const portfolio = await getPortfolioByUserIdAndSymbol(user_id, symbol);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioBySymbolController = async (req, res) => {
    try {
        const { symbol } = req.params;
        const portfolios = await getPortfolioBySymbol(symbol);
        res.status(200).json(portfolios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deletePortfolioController = async (req, res) => {
    try {
        const { user_id, symbol } = req.params;
        const portfolio = await deletePortfolio(user_id, symbol);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const lockStockQuantityController = async (req, res) => {
    try {
        const { user_id, symbol, quantity } = req.params;
        const portfolio = await lockStockQuantity(user_id, symbol, quantity);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const unlockStockQuantityController = async (req, res) => {
    try {
        const { user_id, symbol, quantity } = req.params;
        const portfolio = await unlockStockQuantity(user_id, symbol, quantity);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const applyBuyToPortfolioController = async (req, res) => {
    try {
        const { user_id, symbol, quantity, price } = req.params;
        const portfolio = await applyBuyToPortfolio(user_id, symbol, quantity, price);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const applySellToPortfolioController = async (req, res) => {
    try {
        const { user_id, symbol, quantity } = req.params;
        const portfolio = await applySellToPortfolio(user_id, symbol, quantity);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createPortfolioEntryController = async (req, res) => {
    try {
        const { user_id, symbol, quantity, price } = req.params;
        const portfolio = await createPortfolioEntry(user_id, symbol, quantity, price);
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
