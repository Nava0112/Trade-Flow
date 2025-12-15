import { getUserById, updateUserBalance } from '../models/user.model.js';

export const depositToWallet = async (userId, amount) => {
    // Simulate database update
    const user = await getUserById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if(amount <= 0) {
        throw new Error('Deposit amount must be positive');
    }
    const transaction = await createTransactionRecord(userId, 'DEPOSIT', amount, 'PENDING', null);
    
    return {
        message : 'Deposit initiated',
        transactionId: transaction.id
    };
};

export async function confirmDeposit(transactionId) {
  return knex.transaction(async (trx) => {
    const transaction = await trx('transactions')
      .where({ id: transactionId })
      .forUpdate()
      .first();

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.type !== 'DEPOSIT') {
      throw new Error('Not a deposit transaction');
    }

    if (transaction.status !== 'PENDING') {
      return; // idempotent
    }

    const user = await trx('users')
      .where({ id: transaction.user_id })
      .forUpdate()
      .first();

    if (!user) {
      throw new Error('User not found');
    }

    await trx('users')
      .where({ id: user.id })
      .update({
        balance: Number(user.balance) + Number(transaction.amount)
      });

    await trx('transactions')
      .where({ id: transaction.id })
      .update({
        status: 'SUCCESS',
        executed_at: trx.fn.now()
      });
  });
}
