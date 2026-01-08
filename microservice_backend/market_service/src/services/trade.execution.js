import { updateOrder } from "../client/order.client.js";
import { updateWallet, unlockBalance, getUserWalletBalance } from "../client/wallet.client.js";
import { updatePortfolioForBuy, updatePortfolioForSell } from "../client/portfolio.client.js";
import { getStockBySymbol, updateStock } from "../client/stock.client.js";
import { removeOrderFromBook } from "./orderBook.js";

export const executeTrade = async (buyOrder, sellOrder, trx) => {
    const remainingBuy = Number(buyOrder.quantity) - Number(buyOrder.filled_quantity);
    const remainingSell = Number(sellOrder.quantity) - Number(sellOrder.filled_quantity);

    const tradeQty = Number(Math.min(remainingBuy, remainingSell));
    const tradePrice = Number(sellOrder.price);

    // 1. Insert Trade (Local DB)
    await trx("trades").insert({
        symbol: buyOrder.symbol,
        buy_order_id: buyOrder.id,
        sell_order_id: sellOrder.id,
        price: tradePrice,
        quantity: tradeQty
    });

    // 2. Update Orders (Order Service)
    const newFilledBuy = Number(buyOrder.filled_quantity) + tradeQty;
    const isBuyFilled = remainingBuy === tradeQty;

    await updateOrder(buyOrder.id, {
        ...buyOrder,
        filled_quantity: newFilledBuy,
        status: isBuyFilled ? "FILLED" : "PARTIAL",
        filled_at: isBuyFilled ? new Date().toISOString() : null
    });

    const newFilledSell = Number(sellOrder.filled_quantity) + tradeQty;
    const isSellFilled = remainingSell === tradeQty;

    await updateOrder(sellOrder.id, {
        ...sellOrder,
        filled_quantity: newFilledSell,
        status: isSellFilled ? "FILLED" : "PARTIAL",
        filled_at: isSellFilled ? new Date().toISOString() : null
    });

    // 3. Update Wallets (Wallet Service)
    const cost = tradeQty * tradePrice;

    // Buyer: Unlock 'cost' and Reduce Balance by 'cost'
    await unlockBalance(buyOrder.user_id, cost); // Decrement locked

    // Reduce total balance
    const buyerBalance = await getUserWalletBalance(buyOrder.user_id);
    const newBuyerBalance = Number(buyerBalance) - cost;
    await updateWallet(buyOrder.user_id, newBuyerBalance);

    // Seller: Increase Balance by 'cost'
    const sellerBalance = await getUserWalletBalance(sellOrder.user_id);
    const newSellerBalance = Number(sellerBalance) + cost;
    await updateWallet(sellOrder.user_id, newSellerBalance);

    // 4. Update Portfolios (Portfolio Service)
    await updatePortfolioForBuy(buyOrder.user_id, buyOrder.symbol, tradeQty, tradePrice);
    await updatePortfolioForSell(sellOrder.user_id, buyOrder.symbol, tradeQty, tradePrice);

    // 5. Update Stock (Stock Service)
    try {
        const stock = await getStockBySymbol(buyOrder.symbol);
        if (stock) {
            const newDayHigh = Math.max(Number(stock.day_high), tradePrice);
            const newDayLow = Number(stock.day_low) > 0 ? Math.min(Number(stock.day_low), tradePrice) : tradePrice;

            await updateStock(buyOrder.symbol, {
                // ...stock, // Be careful replacing all fields, API might expect specific payload
                price: tradePrice,
                volume: Number(stock.volume) + tradeQty,
                day_high: newDayHigh,
                day_low: newDayLow,
                updated_at: new Date().toISOString()
            });
        }
    } catch (err) {
        console.error("Failed to update stock stats:", err.message);
        // Continue execution even if stock stats update fails
    }

    buyOrder.filled_quantity = newFilledBuy;
    sellOrder.filled_quantity = newFilledSell;

    if (isBuyFilled) removeOrderFromBook(buyOrder);
    if (isSellFilled) removeOrderFromBook(sellOrder);

    console.log(`Trade Executed: ${tradeQty} ${buyOrder.symbol} @ ${tradePrice}`);
};
