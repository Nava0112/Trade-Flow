import jwt from "jsonwebtoken";
import redis from "../db/redis.js";

export const isAdminRoute = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });    
        }
        next();
    });
}

export const isSelfRoute = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (decoded.id !== req.params.id) {
            return res.status(403).json({ error: "Forbidden" });    
        }
        next();
    });
}