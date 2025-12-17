import express from 'express';
import {
    createStockController,
    getAllStocksController,
    getStockBySymbolController,
    deleteStockBySymbolController,
    updateStockPriceController,
    getStocksByPriceRangeController,
} from '../controllers/stock.controllers.js';

export const router = express.Router();

router.post('/', createStockController);
router.get('/', getAllStocksController);
router.get('/price-range', getStocksByPriceRangeController);
router.get('/:symbol', getStockBySymbolController);
router.put('/:symbol/price', updateStockPriceController);
router.delete('/:symbol', deleteStockBySymbolController);


