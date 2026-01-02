import {
  getAllTransactions,
  getTransactionsByUserId,
  deleteTransaction
} from '../models/transaction.models.js';
import logger from '../../../shared/logger/index.js';

export const getAllTransactionsController = async (req, res) => {
  try {
    logger.info({
        requestId: req.requestId,
        msg: "Forwarding request",
        target: "Wallet Service",
        path: req.originalUrl
    });
    const transactions = await getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    logger.error({
        requestId: req.requestId,
        msg: "Upstream service error",
        error: error.message,
        status: error.response?.status
      });
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionByIdController = async (req, res) => {
  try {
    logger.info({
        requestId: req.requestId,
        msg: "Forwarding request",
        target: "Wallet Service",
        path: req.originalUrl
    });
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    logger.error({
        requestId: req.requestId,
        msg: "Upstream service error",
        error: error.message,
        status: error.response?.status
      });
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    logger.info({
        requestId: req.requestId,
        msg: "Forwarding request",
        target: "Wallet Service",
        path: req.originalUrl
    });
    const deletedCount = await deleteTransaction(req.params.id);
    if (!deletedCount) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    logger.error({
        requestId: req.requestId,
        msg: "Upstream service error",
        error: error.message,
        status: error.response?.status
      });
    res.status(500).json({ error: error.message });
  }
};


export const getUserTransactionsController = async (req, res) => {
  try { 
    logger.info({
        requestId: req.requestId,
        msg: "Forwarding request",
        target: "Wallet Service",
        path: req.originalUrl
    });
    const userId = req.params.userId;
    const transactions = await getTransactionsByUserId(userId);
    res.status(200).json(transactions);
  } catch (error) {
    logger.error({
        requestId: req.requestId,
        msg: "Upstream service error",
        error: error.message,
        status: error.response?.status
      });
    res.status(500).json({ error: error.message });
  }
};