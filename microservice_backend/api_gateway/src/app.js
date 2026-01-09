import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { requestLogger } from "../../shared/middleware/logger.middleware.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware.js";
import { requestContext } from "../../shared/logger/requestContext.js";
import { errorHandler } from "../../shared/middleware/error.middleware.js";
import { router as authRoutes } from "./routes/auth.routes.js";
import { router as stockRoutes } from "./routes/stock.routes.js";
import { router as orderRoutes } from "./routes/order.routes.js";
import { router as userRoutes } from "./routes/user.routes.js";
import { router as walletRoutes } from "./routes/wallet.routes.js";
import { router as portfolioRoutes } from "./routes/portfolio.routes.js";


dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error("CRITICAL: JWT secrets are not defined in environment variables.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 2001;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(cookieParser());
app.use(rateLimitMiddleware);
app.use(requestContext);
app.use(requestLogger);
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/user", userRoutes);
app.use("/api/portfolio", portfolioRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "api_gateway" });
});

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("API Gateway");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 