// hydration.js - Complete Fixed Version
import { getAllOrders } from "../client/order.client.js";
import {
    addBuyOrderToBook,
    addSellOrderToBook,
    getOrderBookSnapshot
} from "./orderBook.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const hydrateOrderBook = async () => {
    console.log("Hydrating Order Book...");

    const maxRetries = 5;
    const baseDelay = 2000; // 2 seconds
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries} to fetch orders...`);
            
            const allOrders = await getAllOrders();
            
            if (!Array.isArray(allOrders)) {
                throw new Error("Invalid response format from order service");
            }

            if (allOrders.length === 0) {
                console.log("No orders found in order service.");
                return;
            }

            const pendingOrders = allOrders.filter(order => 
                order.status === "PENDING" || order.status === "PARTIAL"
            );

            if (pendingOrders.length === 0) {
                console.log("No pending orders to hydrate.");
                return;
            }

            // Sort by creation time (oldest first)
            pendingOrders.sort((a, b) => 
                new Date(a.created_at || Date.now()) - new Date(b.created_at || Date.now())
            );

            console.log(`Processing ${pendingOrders.length} pending orders`);

            let loadedCount = 0;
            let skippedCount = 0;

            for (const order of pendingOrders) {
                try {
                    const side = order.order_type || order.side;
                    const price = Number(order.price);
                    const quantity = Number(order.quantity);
                    const filled = Number(order.filled_quantity || 0);

                    // Validate order data
                    if (!side || (side !== "BUY" && side !== "SELL")) {
                        console.warn(`Skipping order ${order.id}: Invalid side "${side}"`);
                        skippedCount++;
                        continue;
                    }

                    if (!Number.isFinite(price) || price <= 0) {
                        console.warn(`Skipping order ${order.id}: Invalid price "${price}"`);
                        skippedCount++;
                        continue;
                    }

                    if (!Number.isFinite(quantity) || quantity <= 0) {
                        console.warn(`Skipping order ${order.id}: Invalid quantity "${quantity}"`);
                        skippedCount++;
                        continue;
                    }

                    if (filled > quantity) {
                        console.warn(`Skipping order ${order.id}: Filled quantity (${filled}) exceeds total quantity (${quantity})`);
                        skippedCount++;
                        continue;
                    }

                    // Normalize order object
                    const normalizedOrder = {
                        id: order.id,
                        user_id: order.user_id,
                        symbol: order.symbol,
                        side: side,
                        price: price,
                        quantity: quantity,
                        filled_quantity: filled,
                        order_type: side,
                        status: order.status,
                        created_at: order.created_at,
                        updated_at: order.updated_at
                    };

                    // Add to order book
                    if (side === "BUY") {
                        addBuyOrderToBook(normalizedOrder);
                    } else {
                        addSellOrderToBook(normalizedOrder);
                    }
                    
                    loadedCount++;
                } catch (orderError) {
                    console.warn(`Error processing order ${order.id}:`, orderError.message);
                    skippedCount++;
                }
            }

            console.log(`Hydration complete: Loaded ${loadedCount} orders, skipped ${skippedCount}`);
            
            // Log order book snapshot
            const snapshot = getOrderBookSnapshot();
            const symbols = Object.keys(snapshot);
            
            symbols.forEach(symbol => {
                const buyOrders = snapshot[symbol]?.buy?.length || 0;
                const sellOrders = snapshot[symbol]?.sell?.length || 0;
                console.log(`  ${symbol}: ${buyOrders} buy orders, ${sellOrders} sell orders`);
            });

            return; // Success - exit function
            
        } catch (error) {
            console.error(`Hydration attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                console.error(`All ${maxRetries} attempts failed. Starting with empty order book.`);
                console.error("The market will function but won't match existing orders until order service is available.");
                console.error("To manually retry hydration, restart the market service.");
                return; // Don't throw - allow service to start
            }
            
            // Exponential backoff
            const delayTime = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Retrying in ${delayTime/1000} seconds...`);
            await delay(delayTime);
        }
    }
};