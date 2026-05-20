import { getTransactionById } from "../models/transaction.models.js";

export const isTransactionOwnerOrAdmin = async (req, res, next) => {
  try {
    const transactionId = req.params.transactionId || req.params.Transactionid;
    const transaction = await getTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    if (
      String(transaction.user_id) !== String(req.user.id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Forbidden: not transaction owner" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
