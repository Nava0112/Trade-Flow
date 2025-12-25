import { getOrderBookSnapshot } from "../src/market/orderBook.js";

export const logOrderBookSnapshot = () => {
    console.log(JSON.stringify(getOrderBookSnapshot(), null, 2));
}

    logOrderBookSnapshot();