import express from 'express';
import {
    createStockController,
    getAllStocksController,
    getStockBySymbolController,
    deleteStockBySymbolController,
    updateStockPriceController,
    updateStockController,
    getStocksByPriceRangeController,
} from '../controllers/stock.controllers.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/',verifyToken,  isAdmin, createStockController);
router.get('/', verifyToken, getAllStocksController);
router.get('/price/:min/:max', verifyToken, getStocksByPriceRangeController);
router.get('/symbol/:symbol', verifyToken, getStockBySymbolController);
router.put('/:symbol/price', verifyToken, isAdmin, updateStockPriceController);
router.put('/:symbol', verifyToken, isAdmin, updateStockController);
router.delete('/:symbol', verifyToken, isAdmin, deleteStockBySymbolController);
