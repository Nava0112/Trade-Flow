import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  createDepositController,
  getWalletByIdController,
  getWalletByUserIdController,
  getWalletsController,
  createWalletController,
  updateWalletController,
  deleteWalletController,
  updateWalletBalanceController,
  lockBalanceController,
  unlockBalanceController
} from '../controllers/wallet.controllers.js';
import { isTransactionOwnerOrAdmin } from '../middleware/transaction.owner.middleware.js';

export const router = express.Router();

router.post('/deposit/:id', createDepositController);
router.get('/balance/:id', getUserWalletBalanceController);
router.post('/deposit/confirm/:transactionId', isTransactionOwnerOrAdmin, confirmDepositController);
router.get('/wallet/:id', getWalletByIdController);
router.get('/wallet/user/:id', getWalletByUserIdController);
router.get('/wallets', getWalletsController);
router.post('/wallet', createWalletController);
router.put('/wallet/:id', updateWalletController);
router.delete('/wallet/:id', deleteWalletController);
router.put('/wallet/:id', updateWalletBalanceController);
router.post('/lock-balance', lockBalanceController);
router.post('/unlock-balance', unlockBalanceController);