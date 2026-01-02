import { getUserByTransactionId } from "../client/user.client.js";

export const isTransactionOwnerOrAdmin = async (req, res, next) => {
  const transactionId = req.params.id;
  const owner = await getUserByTransactionId(transactionId);

  const ownerId = owner.user_id;
  if (!ownerId) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  if (
    String(ownerId) !== String(req.user.id) &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};