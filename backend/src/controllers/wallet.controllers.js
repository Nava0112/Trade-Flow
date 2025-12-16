import db from '../db/knex.js';
import { getUserByEmail } from '../models/user.models.js';
import { createTransaction } from '../models/transaction.models.js';

export const depositToWalletController = async (email, amount) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error('User not found');
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    if( amount > 10000 ) throw new Error('Deposit amount exceeds the maximum limit of 10,000');
    return await createTransaction(email, 'DEPOSIT', amount, 'PENDING', null);
};

export const confirmDepositController = async function(transactionId) {
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

    const currentBalance = parseFloat(user.balance) || 0;
    const depositAmount = parseFloat(transaction.amount) || 0;
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
}

export const getUserWalletBalanceController = async (email) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error('User not found');
    return parseFloat(user.balance) || 0;
};