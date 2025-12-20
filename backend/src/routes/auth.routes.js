import express from "express";
import {
    signupController,
    loginController,
    logoutController,
    refreshTokenController
} from "../controllers/auth.controllers.js";

export const router = express.Router(); 

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);
