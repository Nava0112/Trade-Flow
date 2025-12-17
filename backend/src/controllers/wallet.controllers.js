import db from '../db/knex.js';
import { getUserByEmail } from '../models/user.models.js';
import { createTransaction } from '../models/transaction.models.js';

export const depositToWalletController = async (email, amount) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error('User not found');
    if (amount <= 0) throw new Error('Deposit amount must be positive');
    if( amount > 10000 ) throw new Error('Deposit amount exceeds the maximum limit of 10,000');
    try {
      return await createTransaction(email, 'DEPOSIT', amount, 'PENDING', null);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Failed to create transaction');
    } 
};


import { confirmDeposit } from '../services/wallet.services.js';

export const confirmDepositController = async (req, res) => {
    try {
        const { transactionId } = req.params;

        if (!transactionId) {
            return res.status(400).json({ error: 'transactionId is required' });
        }

        const updatedTransaction = await confirmDeposit(transactionId);

        return res.status(200).json({
            success: true,
            data: updatedTransaction
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


export const getUserWalletBalanceController = async (req, res) => {
    try {
        const email = req.params.email || req.query.email || req.body.email;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        const user = await getUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const parsedBalance = parseFloat(user.balance) || 0;
        res.status(200).json({ balance: parsedBalance });
    } catch (err) {
        next(err);
    }
};