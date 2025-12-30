import express from 'express';
import { forwardRequest } from '../utils/proxy.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.post('/',verifyToken,  isAdmin, forwardRequest("stock", "createStock"));
router.get('/', verifyToken, forwardRequest("stock", "getAllStocks"));
router.get('/price/:min/:max', verifyToken, forwardRequest("stock", "getStocksByPriceRange"));
router.get('/symbol/:symbol', verifyToken, forwardRequest("stock", "getStockBySymbol"));
router.put('/symbol/:symbol/price', verifyToken, isAdmin, forwardRequest("stock", "updateStockPrice"));
router.put('/symbol/:symbol', verifyToken, isAdmin, forwardRequest("stock", "updateStockBySymbol"));
router.delete('/symbol/:symbol', verifyToken, isAdmin, forwardRequest("stock", "deleteStockBySymbol"));
