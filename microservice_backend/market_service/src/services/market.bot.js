import db from "../db/knex.js";
import { getStocks } from "../client/stock.client.js";
import {
    createBuyOrderService,
    createSellOrderService
} from "../client/order.client.js";
import {
    updateUserBalance,
    getUserWalletBalance,
} from "../client/wallet.client.js";
import {
    hashPassword,
    createBotUser
} from "../client/user.client.js";

let BOT_USER_ID = null;

const MIN_BUY_DEPTH = 4;
const MIN_SELL_DEPTH = 4;

const MAX_BUY_DEPTH = 8;
const MAX_SELL_DEPTH = 8;

const MIN_QTY = 1;
const MAX_QTY = 10;

const MIN_PRICE_GAP = 0.001;
const MAX_PRICE_GAP = 0.01;

const MIN_BOT_BALANCE = 200_000;
const TOPUP_TARGET = 800_000;

export const startMarketBot = async () => {
    BOT_USER_ID = await ensureBotUser();

    await ensureBotBalance();

    const stocks = await getStocks();

    for (const stock of stocks) {
        try {
            await populateOrderBook(
                stock.symbol,
                Number(stock.price)
            );
        } catch (err) {
            console.error(
                `Market bot failed for ${stock.symbol}:`,
                err.message
            );
        }
    }
};

const ensureBotUser = async () => {
    const existing = await db("users")
        .where({ role: "BOT" })
        .first();

    if (existing) {
        return existing.id;
    }

    const passwordHash = await hashPassword("market_bot");

    const [user] = await createBotUser({
        name: "Market Bot",
        email: "market_bot@localhost",
        password: passwordHash,
        role: "BOT",
        balance: TOPUP_TARGET
    });

    return user.id;
};

const ensureBotBalance = async () => {
    const balance = Number(
        await getUserWalletBalance(BOT_USER_ID)
    );

    if (!Number.isFinite(balance)) {
        throw new Error("Invalid bot balance");
    }

    if (balance < MIN_BOT_BALANCE) {
        const delta = Number(
            (TOPUP_TARGET - balance).toFixed(2)
        );

        await updateUserBalance(
            BOT_USER_ID,
            delta
        );
    }
};

const populateOrderBook = async (symbol, price) => {
    const buyCount = await countPending(symbol, "BUY");
    const sellCount = await countPending(symbol, "SELL");

    if (buyCount < MIN_BUY_DEPTH) {
        await generateBuyOrders(symbol, price, buyCount);
    }

    if (sellCount < MIN_SELL_DEPTH) {
        await generateSellOrders(symbol, price, sellCount);
    }
};

const countPending = async (symbol, side) => {
    const res = await db("orders")
        .where({
            symbol,
            order_type: side,
            status: "PENDING"
        })
        .count();

    return Number(res[0].count);
};

const generateBuyOrders = async (symbol, price, existing) => {
    const target = randomInt(MIN_BUY_DEPTH, MAX_BUY_DEPTH);
    const required = Math.max(0, target - existing);

    for (let i = 0; i < required; i++) {
        const gap = randomFloat(MIN_PRICE_GAP, MAX_PRICE_GAP);
        const orderPrice = round(
            Number(price) * (1 - gap)
        );
        const quantity = randomInt(MIN_QTY, MAX_QTY);

        await createBuyOrderService({
            user_id: BOT_USER_ID,
            symbol,
            quantity,
            price: orderPrice
        });
    }
};

const generateSellOrders = async (symbol, price, existing) => {
    const target = randomInt(MIN_SELL_DEPTH, MAX_SELL_DEPTH);
    const required = Math.max(0, target - existing);

    for (let i = 0; i < required; i++) {
        const gap = randomFloat(MIN_PRICE_GAP, MAX_PRICE_GAP);
        const orderPrice = round(
            Number(price) * (1 + gap)
        );
        const quantity = randomInt(MIN_QTY, MAX_QTY);

        await createSellOrderService({
            user_id: BOT_USER_ID,
            symbol,
            quantity,
            price: orderPrice
        });
    }
};

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min, max) =>
    Math.random() * (max - min) + min;

const round = (v) =>
    Number(Number(v).toFixed(2));
