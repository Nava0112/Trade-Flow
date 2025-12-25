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
        const BATCH_SIZE = 1000;
        let offset = 0;

        while (true) {
        const batch = await db("orders")
            .where({ status: "PENDING" })
            .orderBy("created_at", "asc")
            .limit(BATCH_SIZE)
            .offset(offset);

        if (batch.length === 0) break;

        // process batch here
        console.log(`Processing ${batch.length} orders`);

        offset += BATCH_SIZE;
        }

        let count = 0;

        for (const order of pendingOrders) {
            // Normalize numeric fields
            order.price = Number(order.price);
            order.quantity = Number(order.quantity);
            order.filled_quantity = Number(order.filled_quantity);

            if (!Number.isFinite(order.price) || order.price <= 0) {
                console.warn(`Skipping order #${order.id} due to invalid price: ${order.price}`);
                continue;
            }
            if (!Number.isFinite(order.quantity) || order.quantity <= 0) {
                console.warn(`Skipping order #${order.id} due to invalid quantity: ${order.quantity}`);
                continue;
            }
            if (order.order_type === "BUY") {
                addBuyOrderToBook(order);
            } else if (order.order_type === "SELL") {
                addSellOrderToBook(order);
            }
            else {
                console.error(`Skipping order #${order.id} due to invalid order type: ${order.order_type}`);
                continue;
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
