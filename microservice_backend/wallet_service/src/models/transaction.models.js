import db from '../db/knex.js';

export const getAllTransactions = async () => {
    return await db('transactions').select('*');
};

export const getTransactionById = async (id) => {
    return await db('transactions').where({ id }).first();
};

export const createTransaction = async (user_id, type, amount, status = 'PENDING', order_id = null) => {
    const [newTransaction] = await db('transactions')
        .insert({ user_id, type, amount, status, order_id })
        .returning('*');
    return newTransaction;
};

export const getTransactionsByUserId = async (user_id) => {
    return await db('transactions').where({ user_id });
};

export const getTransactionsByType = async (type) => {
    return await db('transactions').where({ type });
};

export const getTransactionsByUserIdAndType = async (user_id, type) => {
    return await db('transactions').where({ user_id, type });
};

export const deleteTransaction = async (id) => {
    return await db('transactions').where({ id }).del();
};

export const updateTransactionStatus = async (id, status) => {
    const updateData = { status };
    
    if (status === 'SUCCESS') {
        updateData.executed_at = db.fn.now();
    }
    
    const [updatedTransaction] = await db('transactions')
        .where({ id })
        .update(updateData)
        .returning('*');
    return updatedTransaction;
};

export const getTransactionsInDateRange = async (startDate, endDate) => {
    return await db('transactions')
        .whereBetween('created_at', [startDate, endDate]);
};

export const getPendingTransactions = async () => {
    return await db('transactions').where({ status: 'PENDING' });
};

export const getTransactionsByUserIdAndStatus = async (user_id, status) => {
    return await db('transactions').where({ user_id, status });
};

