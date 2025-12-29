import express from 'express';
import { verifyToken, isAdmin, isTransactionOwnerOrAdmin } from '../middleware/auth.middleware.js';
import {
  getAllTransactionsController,
  getTransactionByIdController,
  deleteTransactionController,
    getUserTransactionsController
} from '../controllers/transaction.controllers.js';

export const router = express.Router();

router.get('/',verifyToken, isAdmin, getAllTransactionsController);
router.get('/user/:userId', verifyToken, getUserTransactionsController);
router.get('/transaction/:Transactionid', verifyToken, isTransactionOwnerOrAdmin, getTransactionByIdController);
router.delete('/transaction/:Transactionid', verifyToken, isAdmin, deleteTransactionController);