import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router as stockRoutes } from "./routes/stock.routes.js";
import { Welcome } from "./services/userMsg.js";
import { router as userRoutes } from "./routes/user.routes.js";
import { router as transactionRoutes } from "./routes/transaction.route.js";
import { router as orderRoutes } from "./routes/order.routes.js";
import { router as authRoutes } from "./routes/auth.routes.js";
import { router as walletRoutes } from "./routes/wallet.routes.js";
import { startDepositWorker } from "./workers/transaction.worker.js";
import { hydrateOrderBook } from "./market/hydration.js";
import { startMarketBot } from "./market/market.bot.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;


app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(Welcome("Ghost Hunter"));
});

app.use("/api/stocks", stockRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

const startServer = async () => {
  try{
    await hydrateOrderBook();
    await startDepositWorker();
  }
  catch(err){
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    startMarketBot();
  });
};

startServer();

export default app;
