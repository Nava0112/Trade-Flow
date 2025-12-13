import db from '../db/knex.js';

export const getStocks = async () => {
    return await db('stocks').select('*');
};

export const getStockBySymbol = async (symbol) => {
    return await db('stocks').where({ symbol }).first();
}

export const addStock = async (stock) => {
    const [newStock] = await db('stocks').insert(stock).returning('*');
    return newStock;
}

export const deleteStockBySymbol = async (symbol) => {
    return await db('stocks').where({ symbol }).del();
}

export const updateStockPrice = async (symbol, price) => {
    const [updatedStock] = await db('stocks').where({ symbol }).update({ price }).returning('*');
    return updatedStock;
}

export const getStocksByPriceRange = async (minPrice, maxPrice) => {
    return await db('stocks').whereBetween('price', [minPrice, maxPrice]);
}

export const getPendingStocks = async () => {
    return await db('stocks').where({ symbol: null });
}