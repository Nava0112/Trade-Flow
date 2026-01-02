import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as walletRoutes } from "./routes/wallet.routes.js";
import { router as transactionRoutes } from "./routes/transaction.routes.js";
import { requestContext } from "../../shared/logger/requestContext.js"
import { requestLogger } from "./middleware/logger.middleware.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestContext);
app.use(requestLogger);
app.use('/wallet', walletRoutes);
app.use('/transaction', transactionRoutes);

app.get("/", (req, res) => {
    res.send("Wallet Service");
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
