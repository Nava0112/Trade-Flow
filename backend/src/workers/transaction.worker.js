import db from '../db/knex.js';
import { updatePortfolioForBuyService, updatePortfolioForSellService } from '../services/portfolio.services.js';
import { confirmDeposit } from '../services/wallet.services.js';

const INTERVAL_MS = 10_000;

export function startDepositWorker() {
  console.log('💼 Deposit worker started');

  const interval = setInterval(async () => {
    try {
      const pendingDeposits = await db('transactions')
        .where({
          type: 'DEPOSIT',
          status: 'PENDING'
        })
        .andWhere('created_at', '<=', db.raw("NOW() - INTERVAL '5 seconds'"));

      for (const tx of pendingDeposits) {
        try {
          const confirmedTx = await confirmDeposit(tx.id);
          const transactionType = confirmedTx.type;
          if (transactionType !== 'BUY') {
            try {
                  await updatePortfolioForBuyService(confirmedTx.user_id, confirmedTx.symbol, confirmedTx.quantity, confirmedTx.price);
            } catch (err) {
              console.error(`❌ Logging error for transaction ${tx.id}:`, err.message);
            }
          }
          else if( transactionType === 'SELL' ) {
            try {
              await updatePortfolioForSellService(confirmedTx.user_id, confirmedTx.symbol, -confirmedTx.quantity, confirmedTx.price);
            } catch (err) {
              console.error(`❌ Logging error for transaction ${tx.id}:`, err.message);
            }
          }
          console.log(`✅ Deposit confirmed: ${tx.id}`);
        } catch (err) {
          console.error(`❌ Failed to confirm deposit ${tx.id}:`, err.message);
        }
      }
    } catch (err) {
      console.error('❌ Deposit worker error:', err.message);
    }
  }, INTERVAL_MS);

  return interval;
}