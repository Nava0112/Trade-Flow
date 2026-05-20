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
import { verifyToken, isAdmin, isSelfOrAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit/:id', verifyToken, isSelfOrAdmin, createDepositController);
router.get('/balance/:id', verifyToken, isSelfOrAdmin, getUserWalletBalanceController);
router.post('/deposit/confirm/:transactionId', verifyToken, isTransactionOwnerOrAdmin, confirmDepositController);
router.get('/wallet/:id', verifyToken, isAdmin, getWalletByIdController);
router.get('/wallet/user/:id', verifyToken, isSelfOrAdmin, getWalletByUserIdController);
router.get('/wallets', verifyToken, isAdmin, getWalletsController);
router.post('/wallet', verifyToken, isAdmin, createWalletController);
router.put('/wallet/:id/balance', verifyToken, isAdmin, updateWalletBalanceController);
router.delete('/wallet/:id', verifyToken, isAdmin, deleteWalletController);
router.post('/lock-balance', verifyToken, isAdmin, lockBalanceController);
router.post('/unlock-balance', verifyToken, isAdmin, unlockBalanceController);
