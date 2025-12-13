import db from '../db/knex.js';

export const getTransactions = async () => {
    return await db('transactions').select('*');
};

export const getTransactionById = async (id) => {
    return await db('transactions').where({ id }).first();
}

export const createTransaction = async (transaction) => {
    const newTransaction = {
        user_id: transaction.user_id,
        symbol: transaction.symbol,
        quantity: transaction.quantity,
        price: transaction.price,
        transaction_type: transaction.transaction_type,
        date: transaction.date || new Date()
    };
    const [createdTransaction] = await db('transactions').insert(newTransaction).returning('*');
    return createdTransaction;
}

export const getTransactionsByUserId = async (user_id) => {
    return await db('transactions').where({ user_id });
};

export const getTransactionsBySymbol = async (symbol) => {
    return await db('transactions').where({ symbol });
};  

export const getTransactionsByUserIdAndSymbol = async (user_id, symbol) => {
    return await db('transactions').where({ user_id, symbol });
};          

export const deleteTransaction = async (id) => {
    return await db('transactions').where({ id }).del();
}   

export const updateTransactionPrice = async (id, price) => {
    const [updatedTransaction] = await db('transactions').where({ id }).update({ price }).returning('*');
    return updatedTransaction;
}

export const getTransactionsInDateRange = async (startDate, endDate) => {
    return await db('transactions').whereBetween('date', [startDate, endDate]);
}

export const getTransactionsByType = async (transaction_type) => {
    return await db('transactions').where({ transaction_type });
}
