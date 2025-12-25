import { matchOrdersForSymbol } from "./matching.engine.js";

const matchingInProgress = new Set();
export const triggerMatchingEngine = (symbol) => {
    if (matchingInProgress.has(symbol)) {
        console.log(`Matching engine already in progress for symbol: ${symbol}`);
        return;
    }

    setImmediate(async () => {
        try {
            matchingInProgress.add(symbol);
            console.log(`Triggering matching engine for symbol: ${symbol}`);
            await matchOrdersForSymbol(symbol);
        } catch (err) {
            console.error("Matching engine failed:", err.message);
        } finally {
            matchingInProgress.delete(symbol);
        }
    });
};
