import express from "express";
import { forwardRequest } from "../utils/proxy.js";
import { verifyToken } from "../middleware/auth.middleware.js";
export const router = express.Router();

router.post("/signup", forwardRequest("auth", "signup"));
router.post("/login", forwardRequest("auth", "login"));
router.post("/logout", verifyToken, forwardRequest("auth", "logout"));
router.post("/refresh-token", forwardRequest("auth", "refreshToken"));

router.get("/", verifyToken, forwardRequest("auth", ""));
router.get("/signup", verifyToken, forwardRequest("auth", "signup"));
router.get("/login", verifyToken, forwardRequest("auth", "login"));
router.get("/logout", verifyToken, forwardRequest("auth", "logout"));
