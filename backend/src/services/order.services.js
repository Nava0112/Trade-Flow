import db from "../db/knex.js";
import { getUserById, updateUserBalance  } from "../models/user.models.js";
import { getStockBySymbol } from "../models/stock.models.js";
import { updatePortfolioForBuyService, updatePortfolioForSellService } from "./portfolio.services.js";

export const createBuyOrderService = async (orderData) => {
    const { user_id, symbol, quantity, price } = validateOrderData(orderData);
    if (!user_id || !symbol || quantity <= 0 || price <= 0) throw new Error("Invalid order data");
    const totalCost = quantity * price;

    return await db.transaction(async (trx) => {
        const user = await trx("users").where({ id: user_id }).forUpdate().first();
        if (!user) throw new Error("User not found");

        const stock = await getStockBySymbol(symbol);
        if (!stock) throw new Error("Stock not found");

        if (user.balance < totalCost) throw new Error("Insufficient balance");

        const order = await createOrder({ user_id, symbol, quantity, price, type: "BUY", status: "PENDING" }, trx);
        await createTransaction(user_id, "BUY", totalCost, "PENDING", order.id, trx);
        await updatePortfolioForBuyService(user_id, symbol, quantity, price, trx);
        await updateUserBalance(user_id, user.balance - totalCost, trx);

        return order;
    });
};



export const createSellOrderService = async (orderData) => {
    const { user_id, symbol, quantity, price } = validateOrderData(orderData);
    if (!user_id || !symbol || quantity <= 0 || price <= 0) throw new Error("Invalid order data");

    return await db.transaction(async (trx) => {
        const portfolio = await getPortfolioByUserAndSymbol(user_id, symbol, trx);
        if (!portfolio) throw new Error("Stock not owned");

        const availableQty = portfolio.quantity - (portfolio.locked_quantity || 0);
        if (availableQty < quantity) throw new Error("Insufficient stock quantity");
        await updatePortfolioForSellService(user_id, symbol, quantity, trx);
        const order = await createOrder(
            { user_id, symbol, quantity, price, type: "SELL", status: "PENDING" },
            trx
        );
        const transaction = await createTransaction(
            user_id,
            "SELL", quantity * price,
            "PENDING",
            order.id,
            trx
        );

        return order;
    });
};



export const validateOrderData = (orderData) => {
    const { user_id, symbol, quantity, price } = orderData;

    if (!user_id || !symbol || !quantity || !price) {
        throw new Error("Missing required order fields");
    }

    if (quantity <= 0 || price <= 0) {
        throw new Error("Quantity and price must be positive");
    }

    return { user_id, symbol, quantity, price };
};