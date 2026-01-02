import express from 'express';
import {isTransactionOwnerOrAdmin } from '../middleware/transaction.owner.middleware.js';
import {
  getAllTransactionsController,
  getTransactionByIdController,
  deleteTransactionController,
    getUserTransactionsController
} from '../controllers/transaction.controllers.js';

export const router = express.Router();

router.get('/',getAllTransactionsController);
router.get('/user/:userId', getUserTransactionsController);
router.get('/:Transactionid',isTransactionOwnerOrAdmin, getTransactionByIdController);
router.delete('/:Transactionid', deleteTransactionController);