import db from '../db/knex.js';

export const getPortfolios = async () => {
    return await db('portfolios').select('*');
};

export const getPortfolioById = async (id) => {
    return await db('portfolios').where({ id }).first();
};

export const getPortfoliosByUserId = async (user_id) => {
    return await db('portfolios').where({ user_id });
};

export const getPortfolioBySymbol = async (symbol) => {
    return await db('portfolios').where({ symbol });
};

export const getPortfolioByUserIdAndSymbol = async (user_id, symbol) => {
    return await db('portfolios').where({ user_id, symbol }).first();
}

export const createPortfolioEntry = async (entry) => {
    const newEntry = {
        user_id: entry.user_id,
        symbol: entry.symbol,
        quantity: entry.quantity,
        average_buy_price: entry.average_buy_price,
        created_at: db.fn.now(),
        updated_at: db.fn.now()
    };
    const [createdEntry] = await db('portfolios').insert(newEntry).returning('*');
    return createdEntry;
}

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

    const newQty = existing.quantity + buy_qty;
    const newAvg =
        (existing.average_buy_price * existing.quantity +
            buy_price * buy_qty) / newQty;

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

export const applySellToPortfolio = async (user_id, symbol, sell_qty, trx) => {
    const queryBuilder = trx || db;
    const existing = await queryBuilder('portfolios').where({ user_id, symbol }).first();

    if (!existing) {
        throw new Error('No portfolio entry to sell from');
    }

    if (sell_qty > existing.quantity) {
        throw new Error('Insufficient quantity to sell');
    }

    const remainingQty = existing.quantity - sell_qty;

    if (remainingQty === 0) {
        await queryBuilder('portfolios').where({ user_id, symbol }).del();
        return null;
    }

    const [updated] = await queryBuilder('portfolios')
        .where({ user_id, symbol })
        .update({
            quantity: remainingQty,
            updated_at: (trx || db).fn.now()
        })
        .returning('*');

    return updated;
};


export const deletePortfolio = async (user_id, symbol) => {
    return await db('portfolios').where({ user_id, symbol }).del();
}
