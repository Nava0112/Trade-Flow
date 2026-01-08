import express from 'express';
import {
    getAllPortfoliosController,
    getPortfolioByIdController,
    getPortfolioByUserIdController,
    getPortfolioByUserIdAndSymbolController,
    getPortfolioBySymbolController,
    updatePortfolioForBuyController,
    updatePortfolioForSellController,
    deletePortfolioController,
    lockStockQuantityController,
    unlockStockQuantityController
} from '../controllers/portfolio.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.get('/', verifyToken, getAllPortfoliosController);
router.get('/:id', verifyToken, getPortfolioByIdController);
router.get('/user/:user_id', verifyToken, getPortfolioByUserIdController);
router.get('/user/:user_id/symbol/:symbol', verifyToken, getPortfolioByUserIdAndSymbolController);
router.get('/symbol/:symbol', verifyToken, getPortfolioBySymbolController);
router.post('/buy', verifyToken, updatePortfolioForBuyController);
router.post('/sell', verifyToken, updatePortfolioForSellController);
router.post('/lock', verifyToken, lockStockQuantityController);
router.post('/unlock', verifyToken, unlockStockQuantityController);
router.delete('/user/:user_id/symbol/:symbol', verifyToken, deletePortfolioController);
