import { getAllOrders } from "../client/order.client.js";
import {
    addBuyOrderToBook,
    addSellOrderToBook,
    getOrderBookSnapshot
} from "./orderBook.js";

export const hydrateOrderBook = async () => {
    console.log("Hydrating Order Book...");

    try {
        const allOrders = await getAllOrders();
        if(allOrders.length === 0) return;
        const pendingOrders = allOrders.filter(order => order.status === "PENDING" || order.status === "PARTIAL");
        pendingOrders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        const count = pendingOrders.length;
        console.log(`Processing ${count} pending orders`);

        for (const order of pendingOrders) {
            const side = order.order_type;
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
        }

        console.log(`Order Book Hydrated: Loaded ${count} pending orders.`);
        console.log(JSON.stringify(getOrderBookSnapshot(), null, 2));
    } catch (error) {
        console.error("Failed to hydrate order book:", error);
        throw error;
    }
};
