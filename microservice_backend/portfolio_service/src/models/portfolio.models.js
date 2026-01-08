import db from '../db/knex.js';

export const getPortfolios = async () => {
    return db('portfolios').select('*');
};

export const getPortfolioById = async (id) => {
    return db('portfolios').where({ id }).first();
};

export const getPortfoliosByUserId = async (user_id) => {
    return db('portfolios').where({ user_id });
};

export const getPortfolioBySymbol = async (symbol) => {
    return db('portfolios').where({ symbol });
};

export const getPortfolioByUserIdAndSymbol = async (user_id, symbol) => {
    return db('portfolios').where({ user_id, symbol }).first();
};

export const createPortfolioEntry = async ({
    user_id,
    symbol,
    quantity,
    average_buy_price
}) => {
    const [created] = await db('portfolios')
        .insert({
            user_id,
            symbol,
            quantity,
            average_buy_price,
            locked_quantity: 0,
            created_at: db.fn.now(),
            updated_at: db.fn.now()
        })
        .returning('*');

    return created;
};

export const applyBuyToPortfolio = async (
    user_id,
    symbol,
    buy_qty,
    buy_price,
    trx
) => {
    const qb = trx || db;

    const existing = trx
        ? await qb('portfolios').where({ user_id, symbol }).forUpdate().first()
        : await qb('portfolios').where({ user_id, symbol }).first();

    if (!existing) {
        const [created] = await qb('portfolios')
            .insert({
                user_id,
                symbol,
                quantity: buy_qty,
                average_buy_price: buy_price,
                locked_quantity: 0,
                created_at: qb.fn.now(),
                updated_at: qb.fn.now()
            })
            .returning('*');

        return created;
    }

    const newQuantity = existing.quantity + buy_qty;
    const newAveragePrice =
        (existing.average_buy_price * existing.quantity +
            buy_price * buy_qty) / newQuantity;

    const [updated] = await qb('portfolios')
        .where({ user_id, symbol })
        .update({
            quantity: newQuantity,
            average_buy_price: newAveragePrice,
            updated_at: qb.fn.now()
        })
        .returning('*');

    return updated;
};

export const applySellToPortfolio = async (
    user_id,
    symbol,
    sell_qty,
    trx
) => {
    const qb = trx || db;

    const existing = trx
        ? await qb('portfolios').where({ user_id, symbol }).forUpdate().first()
        : await qb('portfolios').where({ user_id, symbol }).first();

    if (!existing) {
        throw new Error('No portfolio entry to sell from');
    }

    const locked = existing.locked_quantity || 0;
    const available = existing.quantity - locked;

    if (sell_qty > available) {
        throw new Error(
            `Insufficient available quantity to sell. Total: ${existing.quantity}, Locked: ${locked}, Requested: ${sell_qty}`
        );
    }

    const remaining = existing.quantity - sell_qty;

    if (remaining === 0 && locked === 0) {
        await qb('portfolios').where({ user_id, symbol }).del();
        return null;
    }

    const [updated] = await qb('portfolios')
        .where({ user_id, symbol })
        .update({
            quantity: remaining,
            updated_at: qb.fn.now()
        })
        .returning('*');

    return updated;
};

export const lockStock = async (
    user_id,
    symbol,
    quantity,
    trx
) => {
    const qb = trx || db;

    const [updated] = await qb('portfolios')
        .where({ user_id, symbol })
        .andWhere(
            qb.raw('quantity - COALESCE(locked_quantity, 0) >= ?', [quantity])
        )
        .increment('locked_quantity', quantity)
        .returning('*');

    if (!updated) {
        const exists = await qb('portfolios').where({ user_id, symbol }).first();
        if (!exists) throw new Error('Stock not owned');
        throw new Error('Insufficient stock to lock');
    }

    await qb('portfolios')
        .where({ id: updated.id })
        .update({ updated_at: qb.fn.now() });

    return updated;
};

export const unlockStock = async (
    user_id,
    symbol,
    quantity,
    trx
) => {
    const qb = trx || db;

    const [updated] = await qb('portfolios')
        .where({ user_id, symbol })
        .andWhere('locked_quantity', '>=', quantity)
        .decrement('locked_quantity', quantity)
        .returning('*');

    if (!updated) {
        const exists = await qb('portfolios').where({ user_id, symbol }).first();
        if (!exists) throw new Error('Stock not owned');
        throw new Error('Cannot unlock: Insufficient locked stock');
    }

    await qb('portfolios')
        .where({ id: updated.id })
        .update({ updated_at: qb.fn.now() });

    return updated;
};

export const deletePortfolio = async (user_id, symbol) => {
    return db('portfolios').where({ user_id, symbol }).del();
};
