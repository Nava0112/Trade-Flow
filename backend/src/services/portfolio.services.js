import db from "../db/knex.js";
import { applyBuyToPortfolio, createPortfolioEntry, getPortfolioByUserIdAndSymbol, applySellToPortfolio } from "../models/portfolio.models.js";

export const updatePortfolioForBuyService = async (userId, symbol, quantity, pricePerUnit) => {
    let portfolio = getPortfolioByUserIdAndSymbol(userId, symbol);
    if (!portfolio) {
        portfolio = await createPortfolioEntry({
            user_id: userId,
            symbol,
            quantity,
            average_buy_price: pricePerUnit,
        });
    } else {
        portfolio = await applyBuyToPortfolio(userId, symbol, quantity, pricePerUnit);
    }
    return portfolio;
};

export const updatePortfolioForSellService = async (userId, symbol, quantity) => {
    const portfolio = await getPortfolioByUserIdAndSymbol(userId, symbol);
    if (!portfolio) {
        throw new Error('No portfolio entry found for this user and symbol');
    }
    return await applySellToPortfolio(userId, symbol, quantity);
};


export const lockStockQuantity = async (userId, symbol, quantity, trx) => {
    const portfolio = await trx("portfolios")
        .where({ user_id: userId, symbol })
        .forUpdate()
        .first();

    if (!portfolio) throw new Error("Stock not owned");

    const available = portfolio.quantity - portfolio.locked_quantity;
    if (available < quantity) throw new Error("Insufficient stock");

    await trx("portfolios")
        .where({ id: portfolio.id })
        .update({
            locked_quantity: portfolio.locked_quantity + quantity,
            updated_at: trx.fn.now()
        });
};

export const unlockStockQuantity = async (userId, symbol, quantity, trx) => {
    // Single atomic update: decrement locked_quantity and set updated_at
    const affected = await trx("portfolios")
        .where({ user_id: userId, symbol })
        .update({
            locked_quantity: trx.raw("locked_quantity - ?", [quantity]),
            updated_at: trx.fn.now()
        });
    if (!affected) {
        throw new Error("Unlock stock failed: portfolio not found or quantity invalid");
    }
};
