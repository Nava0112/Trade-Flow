import express from 'express';
import { verifyToken, isAdmin, isSelfOrAdmin } from '../middleware/auth.middleware.js';
import { forwardRequest } from '../utils/proxy.js';
export const router = express.Router();

router.get('/',verifyToken, isAdmin, forwardRequest("transaction", "getAllTransactions"));
router.get('/user/:userId', verifyToken, forwardRequest("transaction", "getUserTransactions"));
router.get('/transaction/:Transactionid', verifyToken, isSelfOrAdmin, forwardRequest("transaction", "getTransactionById"));
router.delete('/transaction/:Transactionid', verifyToken, isAdmin, forwardRequest("transaction", "deleteTransaction"));