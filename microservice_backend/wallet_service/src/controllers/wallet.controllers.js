import { confirmDeposit, createDeposit } from '../services/wallet.services.js';
import { getUserWalletBalance, getUserById } from '../client/user.client.js';
import logger from '../../../shared/logger/index.js';

export const createDepositController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "Wallet Service",
            path: req.originalUrl
        });
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
        res.status(200).json({ balance });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting user wallet balance",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        throw err;
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
        res.status(200).json({ updatedWallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error updating wallet balance",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
            throw err;
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
        res.status(200).json({ updatedWallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error updating wallet balance",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        throw err;
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
        res.status(200).json({ deletedWallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error deleting wallet",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        throw err;
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
        res.status(200).json({ wallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting wallet by id",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        throw err;
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
        res.status(200).json({ wallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting wallet by user id",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        throw err;
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
        res.status(200).json({ wallets });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error getting wallets",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        throw err;
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
        res.status(200).json({ wallet });
    } catch (err) {
        logger.error({
            requestId: req.requestId,
            msg: "Error creating wallet",
            target: "Wallet Service",
            path: req.originalUrl,
            error: err.message
        });
        throw err;
    }
};
