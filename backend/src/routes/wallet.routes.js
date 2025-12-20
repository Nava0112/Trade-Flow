import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  createDepositController
} from '../controllers/wallet.controllers.js';
import { isSelfOrAdmin, isTransactionOwnerOrAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit/:id', isSelfOrAdmin, createDepositController);
router.get('/balance/:id', isSelfOrAdmin, getUserWalletBalanceController);
router.post('/deposit/confirm/:transactionId', isTransactionOwnerOrAdmin, confirmDepositController);
