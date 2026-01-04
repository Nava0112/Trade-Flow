import db from '../db/knex.js';
import { getUserById } from '../client/user.client.js';
import { createTransaction } from '../models/transaction.models.js';
import { getWalletByUserId } from '../models/wallet.models.js';
//balance is seperated from user table and stored in wallet table
//this is done to avoid race conditions
export const createDeposit = async (userId, amount) => {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    const wallet = await getWalletByUserId(userId);
    if (!wallet) throw new Error('Wallet not found');
    const currentBalance = parseFloat(wallet.balance);
    if (!Number.isFinite(currentBalance)) {
        throw new Error('Invalid wallet.balance: must be a finite number');
    }
    // Do NOT update balance here. Balance is updated in confirmDeposit.
    // await updateWalletBalance(userId, newBalance);
    return await createTransaction(userId, 'DEPOSIT', amount, 'PENDING', null);
};

export const lockUserBalance = async (userId, amount, trx) => {
    amount = Number(amount);
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid amount: must be a positive number");
    }
    const wallet = await trx("wallets")
        .where({ user_id: userId })
        .forUpdate()
        .first();

    if (!wallet) throw new Error("Wallet not found");

    const available = Number(wallet.balance) - Number(wallet.locked_balance);
    if (available < amount) throw new Error("Insufficient balance");

    await trx("wallets")
        .where({ user_id: userId })
        .update({
            locked_balance: trx.raw("locked_balance + ?", [amount]),
            updated_at: trx.fn.now()
        });
};

export const unlockUserBalance = async (userId, amount, trx) => {
    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid amount: must be a positive number");
    }

    const wallet = await trx("wallets")
        .where({ user_id: userId })
        .forUpdate()
        .first();

    if (!wallet) throw new Error("Wallet not found");
    if (parseFloat(wallet.locked_balance) < amount) {
        throw new Error("Insufficient locked balance");
    }

    const affected = await trx("wallets")
        .where({ user_id: userId })
        .andWhere("locked_balance", ">=", amount)
        .update({
            locked_balance: trx.raw("locked_balance - ?", [amount]),
            updated_at: trx.fn.now()
        });

    if (!affected) {
        throw new Error("Unlock failed: insufficient locked balance or user missing");
    }
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

        const wallet = await trx('wallets')
            .where({ user_id: transaction.user_id })
            .forUpdate()
            .first();

        if (!wallet) throw new Error('Wallet not found');

        const currentBalance = parseFloat(wallet.balance);
        if (!Number.isFinite(currentBalance)) {
            throw new Error('Invalid wallet.balance: must be a finite number');
        }

        const depositAmount = parseFloat(transaction.amount);
        if (!Number.isFinite(depositAmount)) {
            throw new Error('Invalid transaction.amount: must be a finite number');
        }

        if (depositAmount <= 0) {
            throw new Error('Deposit amount must be positive');
        }

        const newBalance = currentBalance + depositAmount;

        await trx('wallets')
            .where({ user_id: wallet.user_id })
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