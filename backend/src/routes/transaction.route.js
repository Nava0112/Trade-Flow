import express from 'express';
import { isAdminRoute, isTransactionOwner } from '../middleware/auth.middleware.js';
import {
  getAllTransactionsController,
  getTransactionByIdController,
  deleteTransactionController,
    getUserTransactionsController
} from '../controllers/transaction.controllers.js';

export const router = express.Router();

router.get('/', isAdminRoute, getAllTransactionsController);
router.get('/:id', isTransactionOwner, getTransactionByIdController);
router.delete('/:id', isAdminRoute, deleteTransactionController);
router.get('/user/:id', isTransactionOwner, getUserTransactionsController);