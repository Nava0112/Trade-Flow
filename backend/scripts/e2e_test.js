
import db from '../src/db/knex.js';
import { createDeposit } from '../src/services/wallet.services.js';
import { confirmDeposit } from '../src/services/wallet.services.js';
import { createBuyOrderService, createSellOrderService } from '../src/services/order.services.js';
import { hydrateOrderBook } from '../src/market/hydration.js';

// Utils
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
    console.log("Starting E2E Trade Verification...");

    try {
        // 0. Clean Support
        console.log("Cleaning DB...");
        // Delete in reverse dependency order
        await db('trades').del();
        await db('transactions').del();
        await db('portfolios').del();
        await db('orders').del(); // Orders must be deleted after trades/transactions referencing them
        await db('users').del();
        await db('stocks').del();

        // 1. Setup Data
        console.log("Seeding Data...");

        // Create Stock
        await db('stocks').insert({
            symbol: 'AAPL',
            name: 'Apple Inc.',
            price: 150.00,
            day_high: 155.00,
            day_low: 145.00,
            volume: 0
        });

        // Create Users
        const [userA] = await db('users').insert({
            name: 'Alice_Buyer',
            email: 'alice@test.com',
            password: 'hashedpassword',
            balance: 0,
            locked_balance: 0
        }).returning('*');

        const [userB] = await db('users').insert({
            name: 'Bob_Seller',
            email: 'bob@test.com',
            password: 'hashedpassword',
            balance: 0,
            locked_balance: 0
        }).returning('*');

        console.log(`Users Created: Alice (${userA.id}), Bob (${userB.id})`);

        // 2. Hydrate (Start Engine)
        await hydrateOrderBook();

        // 3. Deposit Money for Alice
        console.log("processing Deposit for Alice...");
        const depTx = await createDeposit(userA.id, 1000.00);
        await confirmDeposit(depTx.id);

        const userA_Refresh = await db('users').where('id', userA.id).first();
        console.log(`Alice Balance: $${userA_Refresh.balance} (Expected: 1000.00)`);
        if (parseFloat(userA_Refresh.balance) !== 1000.00) throw new Error("Deposit Failed");

        // 4. Give Bob Stock (Manual Portfolio Entry)
        console.log("Granting Bob 10 AAPL...");
        await db('portfolios').insert({
            user_id: userB.id,
            symbol: 'AAPL',
            quantity: 10,
            average_buy_price: 100.00
        });

        // 5. Place Orders
        console.log("Bob places SELL Order: 5 AAPL @ $150...");
        // Bob wants to sell 5 at 150
        await createSellOrderService({
            user_id: userB.id,
            symbol: 'AAPL',
            quantity: 5,
            price: 150
        });

        await sleep(1000); // Wait for async match? No, match is triggered immediately but is async.

        console.log("Alice places BUY Order: 5 AAPL @ $150...");
        // Alice wants to buy 5 at 150. Matches immediately.
        await createBuyOrderService({
            user_id: userA.id,
            symbol: 'AAPL',
            quantity: 5,
            price: 150
        });

        console.log("Waiting for Matching Engine...");
        await sleep(2000);

        // 6. Verify Results
        console.log("Verifying State...");

        // Check Balances
        const alice = await db('users').where('id', userA.id).first();
        const bob = await db('users').where('id', userB.id).first();
        // Alice spent 5 * 150 = 750. Balance should be 250.
        // Bob gained 750. Balance should be 750.
        console.log(`Alice Balance: ${alice.balance} (Expected: 250.00)`);
        console.log(`Bob Balance: ${bob.balance} (Expected: 750.00)`);

        // Check Portfolios
        const alicePort = await db('portfolios').where({ user_id: userA.id, symbol: 'AAPL' }).first();
        const bobPort = await db('portfolios').where({ user_id: userB.id, symbol: 'AAPL' }).first();

        console.log(`Alice Portfolio: ${alicePort ? alicePort.quantity : 'NONE'} (Expected: 5)`);
        console.log(`Bob Portfolio: ${bobPort ? bobPort.quantity : 'NONE'} (Expected: 5)`);

        // Check Stock Price Update
        const aapl = await db('stocks').where('symbol', 'AAPL').first();
        console.log(`AAPL Price: ${aapl.price} (Expected: 150.00)`);
        console.log(`AAPL Volume: ${aapl.volume} (Expected: 5)`);

        if (
            parseFloat(alice.balance) === 250.00 &&
            parseFloat(bob.balance) === 750.00 &&
            alicePort.quantity === 5 &&
            bobPort.quantity === 5 &&
            parseInt(aapl.volume) === 5
        ) {
            console.log("TEST PASSED: Full Trading Flow Verified!");
        } else {
            console.error("TEST FAILED: State mismatch.");
            process.exit(1);
        }

    } catch (err) {
        console.error("Test Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
        process.exit(1);
    } finally {
        await db.destroy();
    }
}

runTest();
