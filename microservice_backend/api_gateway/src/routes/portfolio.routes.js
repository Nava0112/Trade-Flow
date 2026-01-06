import express from 'express';
import { forwardRequest } from '../utils/proxy.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();
    
router.get('/', verifyToken, forwardRequest("portfolio", "getAllPortfolios"));
router.get('/:id', verifyToken, forwardRequest("portfolio", "getPortfolioById"));
router.get('/user/:user_id', verifyToken, forwardRequest("portfolio", "getPortfolioByUserId"));
router.get(
  '/user/:user_id/symbol/:symbol',
  verifyToken,
  forwardRequest("portfolio", "getPortfolioByUserIdAndSymbol")
);
router.get('/symbol/:symbol', verifyToken, forwardRequest("portfolio", "getPortfolioBySymbol"));
router.post('/buy', verifyToken, forwardRequest("portfolio", "buyStock"));
router.post('/sell', verifyToken, forwardRequest("portfolio", "sellStock"));
router.post('/lock', verifyToken, forwardRequest("portfolio", "lockStock"));
router.post('/unlock', verifyToken, forwardRequest("portfolio", "unlockStock"));
router.delete(
  '/user/:user_id/symbol/:symbol',
  verifyToken,
  forwardRequest("portfolio", "deletePortfolio")
);
