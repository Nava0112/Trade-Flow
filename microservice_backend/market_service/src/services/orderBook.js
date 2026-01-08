// src/market/orderBook.js

const orderBooks = new Map();

const getBook = (symbol) => {
    if (!orderBooks.has(symbol)) {
        orderBooks.set(symbol, { buy: [], sell: [] });
    }
    return orderBooks.get(symbol);
};

export const addBuyOrderToBook = (order) => {
    const book = getBook(order.symbol);
    book.buy.push(order);
    book.buy.sort((a, b) => b.price - a.price || a.id - b.id);
};

export const addSellOrderToBook = (order) => {
    const book = getBook(order.symbol);
    book.sell.push(order);
    book.sell.sort((a, b) => a.price - b.price || a.id - b.id);
};

export const removeOrderFromBook = (order) => {
    const book = getBook(order.symbol);
    const side = order.order_type === "BUY" ? book.buy : book.sell;

    const index = side.findIndex(o => o.id === order.id);
    if (index !== -1) side.splice(index, 1);
};

export const getBestOrders = (symbol) => {
    const book = getBook(symbol);
    return {
        bestBuy: book.buy[0] || null,
        bestSell: book.sell[0] || null
    };
};

export const getOrderBookSnapshot = () => {
    const snapshot = {};

    for (const [symbol, book] of orderBooks.entries()) {
        snapshot[symbol] = {
            buy: [...book.buy],
            sell: [...book.sell]
        };
    }

    return snapshot;
};
