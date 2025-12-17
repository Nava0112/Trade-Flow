import db from "../db/knex.js";

export const updatePortfolioForBuyService = async (userId, symbol, quantity, pricePerUnit) => {
    return await db.transaction(async (trx) => {
        let portfolio = await trx("portfolios")
            .where({ user_id: userId, symbol })
            .forUpdate()
            .first();
        if (portfolio) {
            await trx("portfolios")
                .where({ user_id: userId, symbol })
                .update({
                    quantity: portfolio.quantity + quantity,
                });
        } else {
            portfolio = await trx("portfolios").insert({
                user_id: userId,
                symbol,
                quantity,
                price_per_unit: pricePerUnit,
            });
        }
        return portfolio;
    });
};

export const updatePortfolioForSellService = async (userId, symbol, quantity) => {
    return await db.transaction(async (trx) => {
        const portfolio = await trx("portfolios")
            .where({ user_id: userId, symbol })
            .forUpdate()
            .first();
        if (portfolio) {
            if (portfolio.quantity < Math.abs(quantity)) {
                throw new Error("Insufficient stock quantity in portfolio");
            }
            await trx("portfolios")
                .where({ user_id: userId, symbol })
                .update({
                    quantity: portfolio.quantity - quantity,
                });
        }
        return portfolio;
    });
};

