import express from 'express';
import {isTransactionOwnerOrAdmin } from '../middleware/transaction.owner.middleware.js';
import { verifyToken, isAdmin, isSelfOrAdmin } from '../middleware/auth.middleware.js';
import {
  getAllTransactionsController,
  getTransactionByIdController,
  deleteTransactionController,
    getUserTransactionsController
} from '../controllers/transaction.controllers.js';

export const router = express.Router();

router.get('/', verifyToken, isAdmin, getAllTransactionsController);
router.get('/user/:userId', verifyToken, isSelfOrAdmin, getUserTransactionsController);
router.get('/:transactionId', verifyToken, isTransactionOwnerOrAdmin, getTransactionByIdController);
router.delete('/:transactionId', verifyToken, isAdmin, deleteTransactionController);
