import db from '../db/index.js';
import { confirmDeposit } from '../services/wallet.services.js';

const INTERVAL_MS = 10_000; // 10 seconds

export function startDepositWorker() {
  console.log('💼 Deposit worker started');

  setInterval(async () => {
    try {
      // Find pending deposits older than 5 seconds
      const pendingDeposits = await db('transactions')
        .where({
          type: 'DEPOSIT',
          status: 'PENDING'
        })
        .andWhere('created_at', '<=', db.raw("NOW() - INTERVAL '5 seconds'"));

      for (const tx of pendingDeposits) {
        try {
          await confirmDeposit(tx.id);
          console.log(`✅ Deposit confirmed: ${tx.id}`);
        } catch (err) {
          console.error(`❌ Failed to confirm deposit ${tx.id}`, err.message);
        }
      }

    } catch (err) {
      console.error('❌ Deposit worker error:', err.message);
    }
  }, INTERVAL_MS);
}