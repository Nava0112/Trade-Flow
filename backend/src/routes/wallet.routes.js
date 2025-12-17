import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  depositToWalletController
} from '../controllers/wallet.controllers.js';
import { isSelfRoute, isTransactionOwner } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit/:id', isSelfRoute, depositToWalletController);
router.get('/balance/:id', isSelfRoute, getUserWalletBalanceController);
router.post('/deposit/:id/confirm', isTransactionOwner, confirmDepositController);