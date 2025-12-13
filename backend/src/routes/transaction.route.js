import {createTransactionController, getAllTransactionsController, getTransactionByIdController, getTransactionsByUserIdController, getTransactionsBySymbolController, getTransactionsByUserIdAndSymbolController, deleteTransactionController, getTransactionsInDateRangeController, getTransactionsByTypeController, getTransactionsByOrderIdController, getUserPortfolioSummaryController } from "../controllers/transaction.controllers.js";
import express from "express";
export const router = express.Router();

router.get("/", getAllTransactionsController);
router.get("/:id", getTransactionByIdController);
router.get("/user/:userId", getTransactionsByUserIdController);
router.get("/symbol/:symbol", getTransactionsBySymbolController);
router.get("/user/:userId/symbol/:symbol", getTransactionsByUserIdAndSymbolController);
router.post("/", createTransactionController);
router.delete("/:id", deleteTransactionController);
router.get("/date-range/:startDate/:endDate", getTransactionsInDateRangeController);
router.get("/type/:type", getTransactionsByTypeController);
router.get("/order/:orderId", getTransactionsByOrderIdController);
router.get("/portfolio-summary/:userId", getUserPortfolioSummaryController);
