import db from "../db/knex.js";
import { addBuyOrderToBook, addSellOrderToBook } from "./orderBook.js";

/**
 * Hydrates the in-memory order book with PENDING orders from the database.
 * MUST be called on server startup before accepting new connections.
 */
export const hydrateOrderBook = async () => {
    console.log("Hydrating Order Book...");
    try {
        const pendingOrders = await db("orders")
            .where("status", "PENDING")
            .orderBy("created_at", "asc"); // FIFO

        let count = 0;
        for (const order of pendingOrders) {
            // Ensure numeric types are correct (DB might return strings for decimals)
            order.price = parseFloat(order.price);
            order.quantity = parseInt(order.quantity);
            order.filled_quantity = parseInt(order.filled_quantity);

            if (order.order_type === "BUY") {
                addBuyOrderToBook(order);
            } else if (order.order_type === "SELL") {
                addSellOrderToBook(order);
            }
            count++;
        }
        console.log(`Order Book Hydrated: Loaded ${count} pending orders.`);
    } catch (error) {
        console.error("Failed to hydrate order book:", error.message);
        process.exit(1); // Critical failure, cannot start matching engine
    }
};
