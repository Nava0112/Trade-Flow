import express from 'express';
import {
    createStockController,
    getAllStocksController,
    getStockBySymbolController,
    deleteStockBySymbolController,
    updateStockPriceController,
    getStocksByPriceRangeController,
} from '../controllers/stock.controllers.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/', isAdmin, createStockController);
router.get('/', verifyToken, getAllStocksController);
router.get('/price-range', verifyToken, getStocksByPriceRangeController);
router.get('/:symbol', verifyToken, getStockBySymbolController);
router.put('/:symbol/price', isAdmin, updateStockPriceController);
router.delete('/:symbol', isAdmin, deleteStockBySymbolController);


