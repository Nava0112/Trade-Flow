import { createUserController } from "./user.controllers.js";
import { getUserByEmail } from "../models/user.models.js";

export const signupController = async (req, res) => {
    const { email, password, name, balance } = req.body;
    try {
        const newUser = await createUserController({ email, password, name, balance });  
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await getUserByEmail(email);
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const logoutController = async (req, res) => {
    
    res.status(200).json({ message: "Logout successful" });
}