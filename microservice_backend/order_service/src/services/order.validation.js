// services/order.validation.js
import { getUserWalletBalance } from "../client/wallet.client.js";
import { getPortfolioByUserAndSymbol } from "../client/portfolio.client.js";

export const validateBuyOrder = async (userId, quantity, price) => {
    try {
        // Calculate total cost
        const totalCost = quantity * price;
        
        // Check user balance
        const balance = await getUserWalletBalance(userId);
        if (balance < totalCost) {
            return {
                valid: false,
                message: `Insufficient balance. Required: ${totalCost}, Available: ${balance}`
            };
        }
        
        return { valid: true };
    } catch (error) {
        console.error("Buy order validation error:", error.message);
        return {
            valid: false,
            message: "Failed to validate buy order"
        };
    }
};

export const validateSellOrder = async (userId, symbol, quantity) => {
    try {
        // Check if user owns the stock
        const portfolio = await getPortfolioByUserAndSymbol(userId, symbol);
        
        if (!portfolio) {
            return {
                valid: false,
                message: `You don't own any ${symbol} shares`
            };
        }
        
        // Check if user has enough shares to sell
        if (portfolio.quantity < quantity) {
            return {
                valid: false,
                message: `Insufficient shares. You own ${portfolio.quantity} shares, trying to sell ${quantity}`
            };
        }
        
        return { valid: true };
    } catch (error) {
        console.error("Sell order validation error:", error.message);
        return {
            valid: false,
            message: "Failed to validate sell order"
        };
    }
};