import db from "../db/knex.js";

export const applyBuyToPortfolio = async (user_id, symbol, buy_qty, buy_price, trx) => {
    const queryBuilder = trx || db;

    // Lock row if in transaction to prevent race conditions
    const existing = trx
        ? await queryBuilder('portfolios').where({ user_id, symbol }).forUpdate().first()
        : await queryBuilder('portfolios').where({ user_id, symbol }).first();

    if (!existing) {
        const [created] = await queryBuilder('portfolios')
            .insert({
                user_id,
                symbol,
                quantity: buy_qty,
                average_buy_price: buy_price,
                created_at: (trx || db).fn.now(),
                updated_at: (trx || db).fn.now()
            })
            .returning('*');

        return created;
    }

    const newQty = Number(existing.quantity) + Number(buy_qty);
    const newAvg =
        (Number(existing.average_buy_price) * Number(existing.quantity) +
            Number(buy_price) * Number(buy_qty)) / newQty;

    const [updated] = await queryBuilder('portfolios')
        .where({ user_id, symbol })
        .update({
            quantity: newQty,
            average_buy_price: newAvg,
            updated_at: (trx || db).fn.now()
        })
        .returning('*');

    return updated;
};
