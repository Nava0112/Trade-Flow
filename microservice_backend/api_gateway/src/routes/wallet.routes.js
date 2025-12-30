import express from 'express';
import { forwardRequest } from '../utils/proxy.js';
import { verifyToken, isSelfOrAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/deposit/:id',verifyToken, isSelfOrAdmin, forwardRequest("wallet", "createDeposit"));
router.get('/balance/:id', verifyToken, isSelfOrAdmin, forwardRequest("wallet", "getUserWalletBalance"));
router.post('/deposit/confirm/:transactionId', verifyToken, forwardRequest("wallet", "confirmDeposit"));