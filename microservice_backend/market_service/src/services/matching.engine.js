import db from "../db/knex.js";
import { getBestOrders, removeOrderFromBook } from "./orderBook.js";
import { executeTrade } from "./trade.execution.js";

export const matchOrdersForSymbol = async (symbol) => {
    while (true) {
        const { bestBuy, bestSell } = getBestOrders(symbol);
        if (bestBuy.user_id === bestSell.user_id) {
            console.log(`Skipping matching orders for symbol: ${symbol} as both orders belong to the same user (User ID: ${bestBuy.user_id})`);
            removeOrderFromBook(bestBuy); // Prevent infinite loop
            continue;
        }
        if (!bestBuy || !bestSell) {
            console.log(`No more matching orders for symbol: ${symbol}`);
            break;
        }
        console.log(`Matching orders for ${symbol}: Buy #${bestBuy.id} at ${bestBuy.price} with Sell #${bestSell.id} at ${bestSell.price}`);
        if (bestBuy.price < bestSell.price) {
            console.log(`No price match for symbol: ${symbol} (Best Buy: ${bestBuy.price}, Best Sell: ${bestSell.price})`);
            break;
        }
        await db.transaction(async (trx) => {
            await executeTrade(bestBuy, bestSell, trx);
        });
    }
};
