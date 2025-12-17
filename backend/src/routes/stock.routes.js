import express from 'express';
import {
    createStockController,
    getAllStocksController,
    getStockBySymbolController,
    deleteStockBySymbolController,
    updateStockPriceController,
    getStocksByPriceRangeController,
} from '../controllers/stock.controllers.js';
import { isAdminRoute, onlyVerifyToken } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/', isAdminRoute, createStockController);
router.get('/', onlyVerifyToken, getAllStocksController);
router.get('/price-range', onlyVerifyToken, getStocksByPriceRangeController);
router.get('/:symbol', onlyVerifyToken, getStockBySymbolController);
router.put('/:symbol/price', isAdminRoute, updateStockPriceController);
router.delete('/:symbol', isAdminRoute, deleteStockBySymbolController);


