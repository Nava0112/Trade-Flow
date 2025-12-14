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

router.get("/", (req, res) => {
    res.status(200).json({ message: "Auth endpoint" });
});
router.get("/signup", (req, res) => {
    res.status(200).json({ message: "Signup endpoint" });
});
router.get("/login", (req, res) => {
    res.status(200).json({ message: "Login endpoint" });
});
router.get("/logout", (req, res) => {
    res.status(200).json({ message: "Logout endpoint" });
});
