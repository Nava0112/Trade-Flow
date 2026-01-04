import db from '../db/knex.js';
import { applyBuyToPortfolio, createPortfolioEntry, getPortfolioByUserIdAndSymbol, applySellToPortfolio } from "../models/portfolio.models.js";

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
    const queryBuilder = trx || db;

    if (trx) {
        return await _lockLogic(trx, userId, symbol, qty);
    } else {
        return await db.transaction(async (newTrx) => {
            return await _lockLogic(newTrx, userId, symbol, qty);
        });
    }
};

const _lockLogic = async (trx, userId, symbol, qty) => {
    const portfolio = await trx("portfolios")
        .where({ user_id: userId, symbol })
        .forUpdate()
        .first();

    if (!portfolio) throw new Error("Stock not owned");

    const available = Number(portfolio.quantity) - Number(portfolio.locked_quantity || 0);
    if (available < qty) throw new Error("Insufficient stock");

    const [updated] = await trx("portfolios")
        .where({ id: portfolio.id })
        .update({
            locked_quantity: trx.raw("COALESCE(locked_quantity, 0) + ?", [qty]),
            updated_at: trx.fn.now()
        })
        .returning("*");

    return updated;
}

export const unlockStockQuantity = async (userId, symbol, quantity, trx) => {
    const qty = Number(quantity);
    const queryBuilder = trx || db;

    const [updated] = await queryBuilder("portfolios")
        .where({ user_id: userId, symbol })
        .andWhere("locked_quantity", ">=", qty)
        .update({
            locked_quantity: queryBuilder.raw("GREATEST(0, COALESCE(locked_quantity, 0) - ?)", [qty]),
            updated_at: queryBuilder.fn.now()
        })
        .returning("*");

    if (!updated) {
        throw new Error("Unlock stock failed: portfolio not found or insufficient locked quantity");
    }
    return updated;
};
