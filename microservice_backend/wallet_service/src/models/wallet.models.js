import db from "../db/knex.js";

export const getWalletByUserId = async (user_id) => {
    return await db('wallets').where({ user_id }).first();
}

export const createWallet = async (user_id, balance) => {
    const [newWallet] = await db('wallets').insert({ user_id, balance, locked_balance: 0 }).returning('*');
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

export const lockVerify = async (user_id, amount) => {
    return await db.transaction(async (trx) => {
        const wallet = await trx('wallets').where({ user_id }).forUpdate().first();
        if (!wallet) throw new Error('Wallet not found');

        const balance = Number(wallet.balance);
        const locked = Number(wallet.locked_balance || 0);
        const reqAmount = Number(amount);

        if (balance - locked < reqAmount) {
            throw new Error('Insufficient funds');
        }

        const [updated] = await trx('wallets')
            .where({ user_id })
            .update({
                locked_balance: trx.raw('locked_balance + ?', [reqAmount])
            })
            .returning('*');

        return updated;
    });
}

export const unlockVerify = async (user_id, amount) => {
    return await db('wallets')
        .where({ user_id })
        .update({
            locked_balance: db.raw('GREATEST(0, locked_balance - ?)', [amount])
        })
        .returning('*');
}