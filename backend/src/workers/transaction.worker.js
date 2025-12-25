import db from '../db/knex.js';
import { confirmDeposit } from '../services/wallet.services.js';

const INTERVAL_MS = process.env.NODE_ENV === 'development' ? 0 : 10000; // 10 seconds in production, 1 second in test

export function startDepositWorker() {
  console.log('Deposit worker started');

  const interval = setInterval(async () => {
    try {
      // Find deposits that are PENDING 
      // (and optionally older than X seconds to avoid race conditions with creation)
      const pendingDeposits = await db('transactions')
        .where({
          type: 'DEPOSIT',
          status: 'PENDING'
        })
        .limit(10); // Process in batches

      for (const tx of pendingDeposits) {
        try {
          await confirmDeposit(tx.id);
          console.log(`Deposit confirmed: ${tx.id} - ${tx.amount}`);
        } catch (err) {
          // If it fails, log it. In a real app we might want a retry count or "FAILED" status.
          console.error(`Failed to confirm deposit ${tx.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error('Deposit worker error:', err.message);
    }
  }, INTERVAL_MS);

  return interval;
}