import { depositToWallet } from '../services/wallet.services.js';

export const depositToWalletController = async (req, res) => {
    const { userId, amount } = req.body;
    try {
        const updatedUser = await depositToWallet(userId, amount);
        if (updatedUser) {
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};