import db from "../db/knex.js";
import { getBestOrders, removeOrderFromBook } from "./orderBook.js";
import { executeTrade } from "./trade.execution.js";

export const matchOrdersForSymbol = async (symbol) => {
    while (true) {
        const { bestBuy, bestSell } = getBestOrders(symbol);

        if (!bestBuy || !bestSell) break;
        if (bestBuy.price < bestSell.price) break;

        await db.transaction(async (trx) => {
            await executeTrade(bestBuy, bestSell, trx);
        });
    }
};
