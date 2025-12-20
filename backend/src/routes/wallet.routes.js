import express from 'express';
import {
  confirmDepositController,
  getUserWalletBalanceController,
  createDepositController
} from '../controllers/wallet.controllers.js';
import { isSelfOrAdmin, isTransactionOwnerOrAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

<<<<<<< HEAD
router.post('/deposit/:id', isSelfRoute, createDepositController);
router.get('/balance/:id', isSelfRoute, getUserWalletBalanceController);
router.post('/deposit/confirm/:id', isTransactionOwner, confirmDepositController);
=======
router.post('/deposit/:id', isSelfOrAdmin, createDepositController);
router.get('/balance/:id', isSelfOrAdmin, getUserWalletBalanceController);
router.post('/deposit/confirm/:transactionId', isTransactionOwnerOrAdmin, confirmDepositController);
>>>>>>> 22b0992 (Auth middleware and routes changed from jwt on every middleware to specified middlewares)
