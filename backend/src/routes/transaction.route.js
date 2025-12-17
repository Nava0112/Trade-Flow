import express from 'express';
import { isAdminRoute, isTransactionOwner, isSelfRoute } from '../middleware/auth.middleware.js';
import {
  getAllTransactionsController,
  getTransactionByIdController,
  deleteTransactionController,
    getUserTransactionsController
} from '../controllers/transaction.controllers.js';

export const router = express.Router();

router.get('/', isAdminRoute, getAllTransactionsController);
router.get('/user/:userId', isSelfRoute, getUserTransactionsController);
router.get('/:id', isTransactionOwner, getTransactionByIdController);
router.delete('/:id', isAdminRoute, deleteTransactionController);