import { getOrderBookSnapshot } from '../services/orderBook.js';
import { triggerMatchingEngine } from '../services/market.trigger.js';
import { addBuyOrderToBook, addSellOrderToBook } from '../services/orderBook.js';

export const getOrderBookController = async (req, res) => {
    try {
        const snapshot = getOrderBookSnapshot();
        res.status(200).json({ success: true, data: snapshot });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addBuyOrderController = async (req, res) => {
    try {
        const order = req.body;
        addBuyOrderToBook(order);
        res.status(201).json({ success: true, message: 'Order added to buy book' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addSellOrderController = async (req, res) => {
    try {
        const order = req.body;
        addSellOrderToBook(order);
        res.status(201).json({ success: true, message: 'Order added to sell book' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const triggerMatchingController = async (req, res) => {
    try {
        const { symbol } = req.body;
        triggerMatchingEngine(symbol);
        res.status(200).json({ success: true, message: `Matching engine triggered for ${symbol}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
