import db from "../db/knex.js";
import { lockUserBalance } from "./wallet.services.js";
import { lockStockQuantity } from "./portfolio.services.js";
import { addBuyOrderToBook, addSellOrderToBook } from "../market/orderBook.js";
import { triggerMatchingEngine } from "../market/market.trigger.js";

export const createBuyOrderService = async ({ user_id, symbol, quantity, price }) => {
    return await db.transaction(async (trx) => {
        const totalCost = quantity * price;

        const [order] = await trx("orders")
            .insert({
                user_id,
                symbol,
                quantity,
                price,
                order_type: "BUY",
                status: "PENDING",
                filled_quantity: 0
            })
            .returning("*");

        await lockUserBalance(user_id, totalCost, trx);

        addBuyOrderToBook(order);
        triggerMatchingEngine(symbol);

        return order;
    });
};

export const createSellOrderService = async ({ user_id, symbol, quantity, price }) => {
    return await db.transaction(async (trx) => {
        const [order] = await trx("orders")
            .insert({
                user_id,
                symbol,
                quantity,
                price,
                order_type: "SELL",
                status: "PENDING",
                filled_quantity: 0
            })
            .returning("*");

        await lockStockQuantity(user_id, symbol, quantity, trx);

        addSellOrderToBook(order);
        triggerMatchingEngine(symbol);

        return order;
    });
};



export const validateOrderData = (orderData) => {
    const { user_id, symbol, quantity, price } = orderData;

    if (!user_id || !symbol || !quantity || !price) {
        throw new Error("Missing required order fields");
    }

    if (quantity <= 0 || price <= 0) {
        throw new Error("Quantity and price must be positive");
    }

    return { user_id, symbol, quantity, price };
};