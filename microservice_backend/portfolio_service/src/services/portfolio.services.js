import db from '../db/knex.js';
import {
    applyBuyToPortfolio,
    createPortfolioEntry,
    getPortfolioByUserIdAndSymbol,
    applySellToPortfolio,
    lockStock,
    unlockStock
} from "../models/portfolio.models.js";

export const updatePortfolioForBuyService = async (userId, symbol, quantity, pricePerUnit) => {
    const qty = Number(quantity);
    const price = Number(pricePerUnit);
    let portfolio = await getPortfolioByUserIdAndSymbol(userId, symbol);
    if (!portfolio) {
        portfolio = await createPortfolioEntry({
            user_id: userId,
            symbol,
            quantity: qty,
            average_buy_price: price,
            locked_quantity: 0
        });
    } else {
        portfolio = await applyBuyToPortfolio(userId, symbol, qty, price);
    }
    return portfolio;
};

export const updatePortfolioForSellService = async (userId, symbol, quantity) => {
    const qty = Number(quantity);
    const portfolio = await getPortfolioByUserIdAndSymbol(userId, symbol);
    if (!portfolio) {
        throw new Error('No portfolio entry found for this user and symbol');
    }
    return await applySellToPortfolio(userId, symbol, qty);
};

export const lockStockQuantity = async (userId, symbol, quantity, trx) => {
    const qty = Number(quantity);
    // Delegate to model which handles concurrency and logic
    if (trx) {
        return await lockStock(userId, symbol, qty, trx);
    } else {
        return await db.transaction(async (newTrx) => {
            return await lockStock(userId, symbol, qty, newTrx);
        });
    }
};

export const unlockStockQuantity = async (userId, symbol, quantity, trx) => {
    const qty = Number(quantity);
    if (trx) {
        return await unlockStock(userId, symbol, qty, trx);
    } else {
        return await db.transaction(async (newTrx) => {
            return await unlockStock(userId, symbol, qty, newTrx);
        });
    }
};
