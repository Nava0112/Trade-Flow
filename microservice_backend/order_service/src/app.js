import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/order.routes.js";
import { errorHandler, requestContext, requestLogger } from "@trade-flow/shared";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestContext);
app.use(requestLogger);

app.use('/orders', router);
app.use(errorHandler);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "order_service" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});