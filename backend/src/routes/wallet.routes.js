import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  depositToWalletController
} from '../controllers/wallet.controllers.js';
import { isAdminRoute, isSelfRoute } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit', isSelfRoute, depositToWalletController);
router.get('/balance', isSelfRoute, getUserWalletBalanceController);
router.post('/deposit/:transactionId/confirm', isSelfRoute, confirmDepositController);

