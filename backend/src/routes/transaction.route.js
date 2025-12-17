import express from 'express';
import { isAdminRoute, isSelfRoute } from '../middleware/auth.middleware.js';
import {
  getAllTransactionsController,
  getTransactionByIdController,
  deleteTransactionController,
    getUserTransactionsController
} from '../controllers/transaction.controllers.js';

export const router = express.Router();

router.get('/', isAdminRoute, getAllTransactionsController);
router.get('/:id', isSelfRoute, getTransactionByIdController);
router.delete('/:id', isAdminRoute, deleteTransactionController);
router.get('/user/:userId', isSelfRoute, getUserTransactionsController);