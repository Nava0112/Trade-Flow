import express from "express";
import dotenv from "dotenv";
import { requestContext } from "../../shared/logger/requestContext.js"
import { router as authRouter } from "./routes/auth.routes.js";
import { requestLogger } from "./middleware/logger.middleware.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);
app.use("/auth", authRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 