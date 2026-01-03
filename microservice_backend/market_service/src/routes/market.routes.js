import express from 'express';
import {
    getOrderBookController,
    addBuyOrderController,
    addSellOrderController,
    triggerMatchingController
} from '../controllers/market.controllers.js';

export const router = express.Router();

router.get('/order-book', getOrderBookController);
router.post('/order-book/buy', addBuyOrderController);
router.post('/order-book/sell', addSellOrderController);
router.post('/matching-engine/trigger', triggerMatchingController);
