import { confirmDeposit, createDeposit } from '../services/wallet.services.js';
import { getUserById } from '../client/user.client.js';
import logger from '../../../shared/logger/index.js';
import {
  getWalletById,
  getWalletByUserId,
  getWallets,
  createWallet,
  updateWallet,
  deleteWallet,
  updateWalletBalance,
  lockVerify,
  unlockVerify
} from '../models/wallet.models.js';

export const lockBalanceController = async (req, res) => {
    try {
        const { user_id, amount } = req.body;
        const result = await lockVerify(user_id, amount);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const unlockBalanceController = async (req, res) => {
    try {
        const { user_id, amount } = req.body;
        const result = await unlockVerify(user_id, amount);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createDepositController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { user_id, amount } = req.body;
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
        logger.error({
            requestId: req.requestId,
            msg: "Error creating deposit",
            target: "Wallet Service",
            path: req.originalUrl,
            error: error.message
        });
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

export const confirmDepositController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
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
        logger.error({
            requestId: req.requestId,
            msg: "Error confirming deposit",
            target: "Wallet Service",
            path: req.originalUrl,
            error: error.message
        });
        return res.status(400).json({
            success: false,
            error: error.message
        });
    }
};


export const getUserWalletBalanceController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { id } = req.params;
        const balance = await getUserWalletBalance(id);
        res.status(200).json({ success: true, data: { balance } });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting user wallet balance",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateWalletBalanceController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { id } = req.params;
        const { balance } = req.body;
        const updatedWallet = await updateWalletBalance(id, balance);
        res.status(200).json({ success: true, data: updatedWallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error updating wallet balance",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};

export const updateWalletController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { id } = req.params;
        const { balance } = req.body;
        const updatedWallet = await updateWalletBalance(id, balance);
        res.status(200).json({ success: true, data: updatedWallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error updating wallet balance",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};

export const deleteWalletController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { id } = req.params;
        const deletedWallet = await deleteWallet(id);
        res.status(200).json({ success: true, data: deletedWallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error deleting wallet",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getWalletByIdController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { id } = req.params;
        const wallet = await getWalletById(id);
        res.status(200).json({ success: true, data: wallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting wallet by id",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getWalletByUserIdController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { id } = req.params;
        const wallet = await getWalletByUserId(id);
        res.status(200).json({ success: true, data: wallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting wallet by user id",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};

export const getWalletsController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const wallets = await getWallets();
        res.status(200).json({ success: true, data: wallets });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting wallets",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};

export const createWalletController = async (req, res, next) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
        const { id } = req.params;
        const wallet = await createWallet(id);
        res.status(200).json({ success: true, data: wallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error creating wallet",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        res.status(500).json({ success: false, error: err.message });
    }
};
