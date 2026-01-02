import db from "../db/knex.js";

export const getWalletByUserId = async (user_id) => {
    return await db('wallets').where({ user_id });
}

export const createWallet = async (user_id, balance) => {
    const [newWallet] = await db('wallets').insert({ user_id, balance }).returning('*');
    return newWallet;
}

export const updateWalletBalance = async (user_id, balance) => {
    const [updatedWallet] = await db('wallets').where({ user_id }).update({ balance }).returning('*');
    return updatedWallet;
}

export const updateWallet = async (user_id, balance) => {
    const [updatedWallet] = await db('wallets').where({ user_id }).update({ balance }).returning('*');
    return updatedWallet;
}

export const deleteWallet = async (user_id) => {
    return await db('wallets').where({ user_id }).del();
}

export const getWallets = async () => {
    return await db('wallets').select('*');
}

export const getUserWalletBalance = async (user_id) => {
    return await db('wallets').where({ user_id }).select('balance');
}

export const getWalletById = async (id) => {
    return await db('wallets').where({ id });
}