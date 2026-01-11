export const validateCreateOrder = (req, res, next) => {
    const { user_id, symbol, quantity, price, order_type } = req.body;

    if (!user_id || typeof user_id !== 'number') {
        return res.status(400).json({ error: "Invalid or missing user_id" });
    }
    if (!symbol || typeof symbol !== 'string' || symbol.length > 10) {
        return res.status(400).json({ error: "Invalid or missing symbol" });
    }
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
        return res.status(400).json({ error: "Invalid quantity: must be a positive integer" });
    }
    if (!price || price <= 0 || typeof price !== 'number') {
        return res.status(400).json({ error: "Invalid price: must be a positive number" });
    }
    if (!['BUY', 'SELL'].includes(order_type)) {
        return res.status(400).json({ error: "Invalid order_type: must be BUY or SELL" });
    }

    next();
};
