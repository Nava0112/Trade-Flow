import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middleware/logger.middleware.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware.js";
import { requestContext } from "../../shared/logger/requestContext.js";
import { router as authRoutes } from "./routes/auth.routes.js";
import { router as stockRoutes } from "./routes/stock.routes.js";
import { router as orderRoutes } from "./routes/order.routes.js";
import { router as userRoutes } from "./routes/user.routes.js";
import { router as walletRoutes } from "./routes/wallet.routes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(rateLimitMiddleware);
app.use(requestContext);
app.use(requestLogger);
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
    res.send("API Gateway");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 