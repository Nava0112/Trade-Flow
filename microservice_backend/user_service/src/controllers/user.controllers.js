import {
    getUsers,
    createUser,
    getUserByEmail,
    getUserById,
    deleteUser,
    updateUserPassword
} from '../models/user.models.js';
import logger from "../../../shared/logger/index.js";
import { createWallet } from '../client/wallet.client.js';

export const createUserController = async (req, res) => {
    const { name, email, password } = req.body;
    const newUser = { name, email, password };
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "User Service",
            path: req.originalUrl
        });
        const findUser = await getUserByEmail(newUser.email);
        if (findUser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        const addedUser = await createUser(newUser);
        const wallet = await createWallet(addedUser.id, 0);
        if (!wallet.success) {
            return res.status(wallet.status).json({ error: wallet.error });
        }
        res.status(201).json({
            success: true,
            data: addedUser,
            wallet: wallet.data
        });
    }
    catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Upstream service error in user service",
            error: error.message,
            status: error.response?.status
        });
        res.status(500).json({
            success: false,
            error: "Internal server error in user service in create user controller"
        });
    }
}

export const getUserByIdController = async (req, res) => {
    const id = req.params.id;
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "User Service",
            path: req.originalUrl
        });
        const user = await getUserById(id);
        if (user) {
            res.status(200).json({
                success: true,
                data: user.data
            });
        } else {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
    }
    catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Upstream service error in user service",
            error: error.message,
            status: error.response?.status
        });
        res.status(500).json({
            success: false,
            error: "Internal server error in user service in get user by id controller"
        });
    }
}

export const getAllUsersController = async (req, res) => {
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "User Service",
            path: req.originalUrl
        });
        const users = await getUsers();
        res.status(200).json({
            success: true,
            data: users
        });
    }
    catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Upstream service error in user service",
            error: error.message,
            status: error.response?.status
        });
        res.status(500).json({
            success: false,
            error: "Internal server error in user service in get all users controller"
        });
    }
}

export const getUserByEmailController = async (req, res) => {
    const email = req.params.email;
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "User Service",
            path: req.originalUrl
        });
        const user = await getUserByEmail(email);
        if (user) {
            res.status(200).json({
                success: true,
                data: user
            });
        } else {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
    }
    catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Upstream service error in user service",
            error: error.message,
            status: error.response?.status
        });
        res.status(500).json({
            success: false,
            error: "Internal server error in user service in get user by email controller"
        });
    }
}

export const deleteUserController = async (req, res) => {
    const id = req.params.id;
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "User Service",
            path: req.originalUrl
        });
        const deletedCount = await deleteUser(id);
        if (deletedCount) {
            res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
    }
    catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Upstream service error in user service",
            error: error.message,
            status: error.response?.status
        });
        res.status(500).json({
            success: false,
            error: "Internal server error in user service in delete user controller"
        });
    }
}

export const updateUserPasswordController = async (req, res) => {
    const id = req.params.id;
    const { password } = req.body;
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "User Service",
            path: req.originalUrl
        });
        const updatedUser = await updateUserPassword(id, password);
        if (updatedUser) {
            res.status(200).json({
                success: true,
                data: updatedUser
            });
        } else {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
    }
    catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Upstream service error in user service",
            error: error.message,
            status: error.response?.status
        });
        res.status(500).json({
            success: false,
            error: "Internal server error in user service in update user password controller"
        });
    }
}

export const updateUserController = async (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    try {
        logger.info({
            requestId: req.requestId,
            msg: "Forwarding request",
            target: "User Service",
            path: req.originalUrl
        });
        const updatedUser = await updateUser(id, { name, email, password });
        if (updatedUser) {
            res.status(200).json({
                success: true,
                data: updatedUser
            });
        } else {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
    }
    catch (error) {
        logger.error({
            requestId: req.requestId,
            msg: "Upstream service error in user service",
            error: error.message,
            status: error.response?.status
        });
        res.status(500).json({
            success: false,
            error: "Internal server error in user service in update user controller"
        });
    }
}