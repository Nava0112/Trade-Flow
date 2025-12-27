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
        let count = 0;

        while (true) {
            const batch = await db("orders")
                .where({ status: "PENDING" })
                .orderBy("created_at", "asc")
                .limit(BATCH_SIZE)
                .offset(offset);

            if (batch.length === 0) break;

            console.log(`Processing ${batch.length} orders`);

            for (const order of batch) {
                const side = order.side || order.order_type;

                const price = Number(order.price);
                const quantity = Number(order.quantity);
                const filled = Number(order.filled_quantity || 0);

                if (!Number.isFinite(price) || price <= 0) continue;
                if (!Number.isFinite(quantity) || quantity <= 0) continue;
                if (side !== "BUY" && side !== "SELL") continue;

                const normalizedOrder = {
                    ...order,
                    side,
                    price,
                    quantity,
                    filled_quantity: filled
                };

                if (side === "BUY") {
                    addBuyOrderToBook(normalizedOrder);
                } else {
                    addSellOrderToBook(normalizedOrder);
                }

                count++;
            }

            offset += BATCH_SIZE;
        }

        console.log(`Order Book Hydrated: Loaded ${count} pending orders.`);
        console.log(JSON.stringify(getOrderBookSnapshot(), null, 2));
    } catch (error) {
        console.error("Failed to hydrate order book:", error);
        throw error; // Let caller handle recovery/retry
    }};
