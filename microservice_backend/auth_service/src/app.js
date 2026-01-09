import express from "express";
import dotenv from "dotenv";
import { requestContext } from "../../shared/logger/requestContext.js"
import { errorHandler } from "../../shared/middleware/error.middleware.js";
import { router as authRouter } from "./routes/auth.routes.js";
import { requestLogger } from "../../shared/middleware/logger.middleware.js";
import cookieparser from "cookie-parser";
dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error("CRITICAL: JWT secrets are not defined in environment variables.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 2002;
app.use(cookieparser());
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);
app.use("/auth", authRouter);
app.use(errorHandler);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "auth_service" });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 