import db from '../db/knex.js';
import { getUserById } from '../models/user.models.js';
import { createTransaction } from '../models/transaction.models.js';

export const depositToWallet = async (userId, amount) => {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    
    return await createTransaction(userId, 'DEPOSIT', amount, 'PENDING', null);
};

export const confirmDeposit = async (transactionId) => {
    return await db.transaction(async (trx) => {
        const transaction = await trx('transactions')
            .where({ id: transactionId })
            .forUpdate()
            .first();

        if (!transaction) throw new Error('Transaction not found');
        if (transaction.type !== 'DEPOSIT') throw new Error('Not a deposit transaction');
        if (transaction.status !== 'PENDING') return transaction;

        const user = await trx('users')
            .where({ id: transaction.user_id })
            .forUpdate()
            .first();

        if (!user) throw new Error('User not found');

        const currentBalance = parseFloat(user.balance);
        if (!Number.isFinite(currentBalance)) {
            throw new Error('Invalid user.balance: must be a finite number');
        }

        const depositAmount = parseFloat(transaction.amount);
        if (!Number.isFinite(depositAmount)) {
            throw new Error('Invalid transaction.amount: must be a finite number');
        }

        if (depositAmount <= 0) {
            throw new Error('Deposit amount must be positive');
        }

        const newBalance = currentBalance + depositAmount;

        await trx('users')
            .where({ id: user.id })
            .update({ balance: newBalance });

        const [updatedTransaction] = await trx('transactions')
            .where({ id: transaction.id })
            .update({
                status: 'SUCCESS',
                executed_at: trx.fn.now()
            })
            .returning('*');

        return updatedTransaction;
    });
};