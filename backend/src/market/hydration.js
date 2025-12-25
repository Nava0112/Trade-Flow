// src/market/hydration.js

import db from "../db/knex.js";
import {
    addBuyOrderToBook,
    addSellOrderToBook,
    getOrderBookSnapshot
} from "./orderBook.js";

export const hydrateOrderBook = async () => {
    console.log("Hydrating Order Book...");

    try {
        const pendingOrders = await db("orders")
            .where("status", "PENDING")
            .orderBy("created_at", "asc"); // FIFO

        let count = 0;

        for (const order of pendingOrders) {
            // Normalize numeric fields
            order.price = Number(order.price);
            order.quantity = Number(order.quantity);
            order.filled_quantity = Number(order.filled_quantity);

            if (order.order_type === "BUY") {
                addBuyOrderToBook(order);
            } else if (order.order_type === "SELL") {
                addSellOrderToBook(order);
            }

            count++;
        }

        console.log(`Order Book Hydrated: Loaded ${count} pending orders.`);
        console.log(JSON.stringify(getOrderBookSnapshot(), null, 2));


    } catch (error) {
        console.error("Failed to hydrate order book:", error.message);
        process.exit(1); // cannot start matching engine
    }
};
