import express from 'express';
import {
    getOrderBookController,
    addBuyOrderController,
    addSellOrderController,
    triggerMatchingController
} from '../controllers/market.controllers.js';
import { verifyInternalService } from '../middleware/auth.middleware.js';

export const router = express.Router();

router.get('/order-book', getOrderBookController);
router.post('/order-book/buy', verifyInternalService, addBuyOrderController);
router.post('/order-book/sell', verifyInternalService, addSellOrderController);
router.post('/matching-engine/trigger', verifyInternalService, triggerMatchingController);
