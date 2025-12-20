import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  createDepositController
} from '../controllers/wallet.controllers.js';
import { isSelfRoute, isTransactionOwner } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit/:id', isSelfRoute, createDepositController);
router.get('/balance/:id', isSelfRoute, getUserWalletBalanceController);
router.post('/deposit/confirm/:id', isTransactionOwner, confirmDepositController);
