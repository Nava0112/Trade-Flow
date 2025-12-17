import jwt from "jsonwebtoken";
import { getuserByTransactionId } from "../models/user.models.js";

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
        if (decoded.id !== req.params.id && decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });    
        }
        next();
    });
}


export const isTransactionOwner = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await getuserByTransactionId(req.params.id);
        if(!user) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        if (decoded.id !== user.id && decoded.role !== "admin") {
            return res.status(403).json({ error: "Forbidden" });    
        }
        next();
    });
}

export const onlyVerifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        next();
    });
}