import { matchOrdersForSymbol } from "./matching.engine.js";

export const triggerMatchingEngine = (symbol) => {
    setImmediate(async () => {
        try {
            await matchOrdersForSymbol(symbol);
        } catch (err) {
            console.error("Matching engine failed:", err.message);
        }
    });
};
