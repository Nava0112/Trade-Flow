import { matchOrdersForSymbol } from "./matching.engine.js";

export const triggerMatchingEngine = (symbol) => {
    setImmediate(async () => {
        try {
            console.log(`Triggering matching engine for symbol: ${symbol}`);
            await matchOrdersForSymbol(symbol);
        } catch (err) {
            console.error("Matching engine failed:", err.message);
        }
    });
};
