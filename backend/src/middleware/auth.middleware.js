import jwt from "jsonwebtoken";
import { getUserByTransactionId } from "../models/user.models.js";

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
        const normalizedDecodedId = String(decoded?.id);
        const normalizedParamId = String(req.params.userId || req.params.id);
        if (normalizedDecodedId !== normalizedParamId && decoded.role !== "admin") {
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
        let user;
        try {
            user = await getUserByTransactionId(req.params.id);
        } catch (err) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        if (!user) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        
        const normalizedDecodedId = String(decoded?.id);
        const normalizedUserId = String(user?.id);
        
        if (normalizedDecodedId !== normalizedUserId && decoded.role !== "admin") {
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