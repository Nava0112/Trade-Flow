import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import pg from "pg";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Wallet Service");
})

export const connectDB = () => {
    const pool = new pg.Pool({
        connectionString: process.env.DB_URI,
        ssl: { rejectUnauthorized: false },
    });
    console.log({"Database connected" : pool});
}

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
