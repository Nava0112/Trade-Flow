import db from "../db/knex.js";
import { getBestOrders, removeOrderFromBook } from "./orderBook.js";
import { executeTrade } from "./trade.execution.js";

export const matchOrdersForSymbol = async (symbol) => {
    while (true) {
        const { bestBuy, bestSell } = getBestOrders(symbol);
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
