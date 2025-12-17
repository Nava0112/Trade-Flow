import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  depositToWalletController
} from '../controllers/wallet.controllers.js';
import { isSelfRoute, isTransactionOwner } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit/:userId', isSelfRoute, depositToWalletController);
router.get('/balance/:userId', isSelfRoute, getUserWalletBalanceController);
router.post('/deposit/:transactionId/confirm', isTransactionOwner, confirmDepositController);