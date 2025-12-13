import db from '../db/knex.js';

export const getWatchlists = async () => {
    return await db('watchlists').select('*');
};

export const getWatchlistByUserId = async (user_id) => {
    return await db('watchlists').where({ user_id }).first();
}

export const addToWatchlist = async (user_id, symbol) => {
    const newEntry = {
        user_id,
        symbol
    };
    const [addedEntry] = await db('watchlists').insert(newEntry).returning('*');
    return addedEntry;
}

export const removeFromWatchlist = async (user_id, symbol) => {
    return await db('watchlists').where({ user_id, symbol }).del();
}

