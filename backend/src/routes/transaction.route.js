import express from 'express';
import { verifyToken, isAdmin, isTransactionOwnerOrAdmin } from '../middleware/auth.middleware.js';
import {
  getAllTransactionsController,
  getTransactionByIdController,
  deleteTransactionController,
    getUserTransactionsController
} from '../controllers/transaction.controllers.js';

export const router = express.Router();

router.get('/', isAdmin, getAllTransactionsController);
router.get('/user/:userId', verifyToken, getUserTransactionsController);
router.get('/:Transactionid', isTransactionOwnerOrAdmin, getTransactionByIdController);
router.delete('/:Transactionid', isAdmin, deleteTransactionController);