import db from '../db/knex.js';

export const getPortfolios = async () => {
    return await db('portfolios').select('*');
};

export const getPortfolioByUserId = async (user_id) => {
    return await db('portfolios').where({ user_id }).first();
}

export const createPortfolio = async (portfolio) => {
    const newPortfolio = {
        user_id: portfolio.user_id,
        total_value: portfolio.total_value || 0
    };
    const [createdPortfolio] = await db('portfolios').insert(newPortfolio).returning('*');
    return createdPortfolio;
}

export const updatePortfolioValue = async (user_id, total_value) => {
    const [updatedPortfolio] = await db('portfolios').where({ user_id }).update({ total_value }).returning('*');
    return updatedPortfolio;
}

export const deletePortfolio = async (user_id) => {
    return await db('portfolios').where({ user_id }).del();
}

export const getPortfoliosWithMinValue = async (min_value) => {
    return await db('portfolios').where('total_value', '>=', min_value);
}

export const getPortfoliosWithMaxValue = async (max_value) => {
    return await db('portfolios').where('total_value', '<=', max_value);
}