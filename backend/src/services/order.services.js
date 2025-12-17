import db from "../db/knex.js";
import { getUserById } from "../models/user.models.js";
import { getStockBySymbol } from "../models/stock.models.js";

export const createBuyOrderService = async (orderData) => {
    const { user_id, symbol, quantity, price } = validateOrderData(orderData);

    if (!user_id || !symbol || quantity <= 0 || price <= 0) {
        throw new Error("Invalid order data");
    }

    const totalCost = quantity * price;

    return await db.transaction(async (trx) => {
        const user = await trx("users")
            .where({ id: user_id })
            .forUpdate()
            .first();

        if (!user) throw new Error("User not found");

        const stock = await getStockBySymbol(symbol);
        if (!stock) throw new Error("Stock not found");

        if (user.balance < totalCost) {
            throw new Error("Insufficient balance");
        }

        await trx("users")
            .where({ id: user_id })
            .update({
                balance: user.balance - totalCost,
                locked_balance: (user.locked_balance || 0) + totalCost
            });

        const [order] = await trx("orders")
            .insert({
                user_id,
                symbol,
                quantity,
                price,
                type: "BUY",
                status: "PENDING",
                created_at: trx.fn.now()
            })
            .returning("*");

        return order;
    });
};


export const createSellOrderService = async (orderData) => {
    const { user_id, symbol, quantity, price } = validateOrderData(orderData);

    if (!user_id || !symbol || quantity <= 0 || price <= 0) {
        throw new Error("Invalid order data");
    }

    return await db.transaction(async (trx) => {
        const portfolio = await trx("portfolios")
            .where({ user_id, symbol })
            .forUpdate()
            .first();

        if (!portfolio) {
            throw new Error("Stock not owned");
        }

        const availableQty =
            portfolio.quantity - (portfolio.locked_quantity || 0);

        if (availableQty < quantity) {
            throw new Error("Insufficient stock quantity");
        }

        await trx("portfolios")
            .where({ user_id, symbol })
            .update({
                locked_quantity:
                    (portfolio.locked_quantity || 0) + quantity
            });

        const [order] = await trx("orders")
            .insert({
                user_id,
                symbol,
                quantity,
                price,
                type: "SELL",
                status: "PENDING",
                created_at: trx.fn.now()
            })
            .returning("*");

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