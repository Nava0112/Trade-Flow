import {
    updatePortfolioForBuyService,
    updatePortfolioForSellService,
    lockStockQuantity,
    unlockStockQuantity
} from "../services/portfolio.services.js";

import {
    getPortfolios,
    getPortfolioById,
    getPortfoliosByUserId,
    getPortfolioByUserIdAndSymbol,
    getPortfolioBySymbol,
    deletePortfolio
} from "../models/portfolio.models.js";

import logger from "../../../shared/logger/index.js";

export const updatePortfolioForBuyController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Update portfolio for buy request received",
            user_id: req.user.id,
            symbol: req.body.symbol,
            quantity: req.body.quantity,
            pricePerUnit: req.body.pricePerUnit
        });
        const { user_id, symbol, quantity, pricePerUnit } = req.body;
        const portfolio = await updatePortfolioForBuyService(
            user_id,
            symbol,
            quantity,
            pricePerUnit
        );
        res.status(200).json(portfolio);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Update portfolio for buy request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const updatePortfolioForSellController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Update portfolio for sell request received",
            user_id: req.user.id,
            symbol: req.body.symbol,
            quantity: req.body.quantity
        });
        const { user_id, symbol, quantity } = req.body;
        const portfolio = await updatePortfolioForSellService(
            user_id,
            symbol,
            quantity
        );
        res.status(200).json(portfolio);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Update portfolio for sell request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const lockStockQuantityController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Lock stock quantity request received",
            user_id: req.user.id,
            symbol: req.body.symbol,
            quantity: req.body.quantity
        });
        const { user_id, symbol, quantity } = req.body;
        const portfolio = await lockStockQuantity(
            user_id,
            symbol,
            quantity
        );
        res.status(200).json(portfolio);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Lock stock quantity request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const unlockStockQuantityController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Unlock stock quantity request received",
            user_id: req.user.id,
            symbol: req.body.symbol,
            quantity: req.body.quantity
        });
        const { user_id, symbol, quantity } = req.body;
        const portfolio = await unlockStockQuantity(
            user_id,
            symbol,
            quantity
        );
        res.status(200).json(portfolio);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Unlock stock quantity request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const getAllPortfoliosController = async (req, res) => {
    try {   
        logger.info({
            requestId: req.requestId,
            msg: "Get all portfolios request received"
        });
        const portfolios = await getPortfolios();
        res.status(200).json(portfolios);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Get all portfolios request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioByIdController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Get portfolio by id request received",
            id: req.params.id
        });
        const { id } = req.params;
        const portfolio = await getPortfolioById(id);
        res.status(200).json(portfolio);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Get portfolio by id request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioByUserIdController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Get portfolio by user id request received",
            user_id: req.params.user_id
        });
        const { user_id } = req.params;
        const portfolios = await getPortfoliosByUserId(user_id);
        res.status(200).json(portfolios);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Get portfolio by user id request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioByUserIdAndSymbolController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Get portfolio by user id and symbol request received",
            user_id: req.params.user_id,
            symbol: req.params.symbol
        });
        const { user_id, symbol } = req.params;
        const portfolio = await getPortfolioByUserIdAndSymbol(
            user_id,
            symbol
        );
        res.status(200).json(portfolio);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Get portfolio by user id and symbol request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const getPortfolioBySymbolController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Get portfolio by symbol request received",
            symbol: req.params.symbol
        });
        const { symbol } = req.params;
        const portfolios = await getPortfolioBySymbol(symbol);
        res.status(200).json(portfolios);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Get portfolio by symbol request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};

export const deletePortfolioController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Delete portfolio request received",
            user_id: req.params.user_id,
            symbol: req.params.symbol
        });
        const { user_id, symbol } = req.params;
        const result = await deletePortfolio(user_id, symbol);
        res.status(200).json(result);
    } catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Delete portfolio request failed",
            error: error.message
        });
        res.status(500).json({ error: error.message });
    }
};
