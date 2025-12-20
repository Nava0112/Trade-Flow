import { getUserById } from '../models/user.models.js';
import { confirmDeposit, createDeposit } from '../services/wallet.services.js';
import { getUserWalletBalance } from '../models/user.models.js';

export const createDepositController = async (req, res) => {
    try {
        const { user_id, amount }   = req.body;
        if (!user_id || !amount) {
            return res.status(400).json({ error: 'user_id and amount are required' });
        }
        const user = await getUserById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const transaction = await createDeposit(user_id, amount);

        return res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

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


export const getUserWalletBalanceController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const balance = await getUserWalletBalance(id);
        res.status(200).json({ balance });
    } catch (err) {
        next(err);
    }
};