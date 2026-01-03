import db from "../db/knex.js";
import { lockUserBalance } from "../client/wallet.client.js";
import { lockStockQuantity } from "../client/portfolio.client.js";
import { addBuyOrderToBook, addSellOrderToBook, triggerMatchingEngine } from "../client/market.client.js";

export const createBuyOrderService = async ({ user_id, symbol, quantity, price }) => {
    const qty = Number(quantity);
    const prc = Number(price);
    const order = await db.transaction(async (trx) => {
        const totalCost = qty * prc;

        const [inserted] = await trx("orders")
            .insert({
                user_id,
                symbol,
                quantity: qty,
                price: prc,
                order_type: "BUY",
                status: "PENDING",
                filled_quantity: 0
            })
            .returning("*");

        await lockUserBalance(user_id, totalCost);
        return inserted;
    });

    // In-memory operations after successful commit
    addBuyOrderToBook(order);
    triggerMatchingEngine(symbol);
    return order;
};

export const createSellOrderService = async ({ user_id, symbol, quantity, price }) => {
    const qty = Number(quantity);
    const prc = Number(price);
    const order = await db.transaction(async (trx) => {
        const [inserted] = await trx("orders")
            .insert({
                user_id,
                symbol,
                quantity: qty,
                price: prc,
                order_type: "SELL",
                status: "PENDING",
                filled_quantity: 0
            })
            .returning("*");

        await lockStockQuantity(user_id, symbol, qty);
        return inserted;
    });

    // In-memory operations after successful commit
    addSellOrderToBook(order);
    triggerMatchingEngine(symbol);
    return order;
};



export const validateOrderData = (orderData) => {
    const { user_id, symbol } = orderData;
    const quantity = Number(orderData.quantity);
    const price = Number(orderData.price);

    if (!user_id || !symbol || !quantity || !price) {
        throw new Error("Missing required order fields");
    }

    if (quantity <= 0 || price <= 0) {
        throw new Error("Quantity and price must be positive");
    }

    return { user_id, symbol, quantity, price };
};