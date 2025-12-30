import express from "express";
import dotenv from "dotenv";
import { router } from "./routes/user.routes.js";
import { requestContext } from "../../shared/logger/requestContext.js"
import { requestLogger } from "./middleware/logger.middleware.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(requestContext);
app.use(requestLogger);
app.use('/users', router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
