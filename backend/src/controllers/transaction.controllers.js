import {
  getAllTransactions,
  getTransactionsByUserId,
  deleteTransaction
} from '../models/transaction.models.js';

export const getAllTransactionsController = async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTransactionByIdController = async (req, res) => {
  try {
    const transaction = await getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTransactionController = async (req, res) => {
  try {
    const deletedCount = await deleteTransaction(req.params.id);
    if (!deletedCount) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getUserTransactionsController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await getTransactionsByUserId(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};