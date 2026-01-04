import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { router as orderRoutes } from "./routes/order.routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/orders', orderRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "order_service" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});