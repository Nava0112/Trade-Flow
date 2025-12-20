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

