import { removeOrderFromBook } from "./orderBook.js";
import { applyBuyToPortfolio } from "./portfolio.helpers.js";

export const executeTrade = async (buyOrder, sellOrder, trx) => {
    const remainingBuy = Number(buyOrder.quantity) - Number(buyOrder.filled_quantity);
    const remainingSell = Number(sellOrder.quantity) - Number(sellOrder.filled_quantity);

    const tradeQty = Number(Math.min(remainingBuy, remainingSell));
    const tradePrice = Number(sellOrder.price);

    await trx("trades").insert({
        symbol: buyOrder.symbol,
        buy_order_id: buyOrder.id,
        sell_order_id: sellOrder.id,
        price: tradePrice,
        quantity: tradeQty
    });

    await trx("orders").where({ id: buyOrder.id }).increment("filled_quantity", tradeQty);
    await trx("orders")
        .where({ id: buyOrder.id })
        .update({
            status: remainingBuy === tradeQty ? "FILLED" : "PARTIAL",
            filled_at: remainingBuy === tradeQty ? trx.fn.now() : null
        });

    await trx("orders").where({ id: sellOrder.id }).increment("filled_quantity", tradeQty);
    await trx("orders")
        .where({ id: sellOrder.id })
        .update({
            status: remainingSell === tradeQty ? "FILLED" : "PARTIAL",
            filled_at: remainingSell === tradeQty ? trx.fn.now() : null
        });

    buyOrder.filled_quantity = Number(buyOrder.filled_quantity) + tradeQty;
    sellOrder.filled_quantity = Number(sellOrder.filled_quantity) + tradeQty;

    await trx("wallets")
        .where({ user_id: buyOrder.user_id })
        .decrement("locked_balance", tradeQty * tradePrice)
        .increment("balance", -tradeQty * tradePrice);

    await trx("wallets")
        .where({ user_id: sellOrder.user_id })
        .increment("balance", tradeQty * tradePrice);

    await applyBuyToPortfolio(buyOrder.user_id, buyOrder.symbol, tradeQty, tradePrice, trx);

    await trx("portfolios")
        .where({ user_id: sellOrder.user_id, symbol: sellOrder.symbol })
        .decrement("locked_quantity", tradeQty)
        .decrement("quantity", tradeQty);

    const stock = await trx("stocks").where({ symbol: buyOrder.symbol }).first();
    if (stock) {
        const newDayHigh = Math.max(stock.day_high, tradePrice);
        const newDayLow = stock.day_low > 0 ? Math.min(stock.day_low, tradePrice) : tradePrice;

        await trx("stocks")
            .where({ symbol: buyOrder.symbol })
            .update({
                price: tradePrice,
                volume: trx.raw('volume + ?', [tradeQty]),
                day_high: newDayHigh,
                day_low: newDayLow,
                updated_at: trx.fn.now()
            });
    }

    if (remainingBuy === tradeQty) removeOrderFromBook(buyOrder);
    if (remainingSell === tradeQty) removeOrderFromBook(sellOrder);

    console.log(`Trade Executed: ${tradeQty} ${buyOrder.symbol} @ ${tradePrice}`);
};
