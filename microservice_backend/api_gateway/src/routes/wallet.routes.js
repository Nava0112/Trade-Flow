import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  createDepositController
} from '../controllers/wallet.controllers.js';
import { isSelfOrAdmin, isTransactionOwnerOrAdmin, verifyToken } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit/:id',verifyToken, isSelfOrAdmin, createDepositController);
router.get('/balance/:id', verifyToken, isSelfOrAdmin, getUserWalletBalanceController);
router.post('/deposit/confirm/:transactionId', verifyToken, isTransactionOwnerOrAdmin, confirmDepositController);