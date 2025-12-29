import express from 'express';
import {
    createUserController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserController,
    updateUserPasswordController
} from '../controllers/user.controllers.js';
import { verifyToken, isAdmin, isSelfOrAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();
router.post('/', createUserController);
router.get('/',verifyToken, isAdmin, getAllUsersController);
router.get('/email/:email', verifyToken, getUserByEmailController);
router.delete('/:id', verifyToken, isSelfOrAdmin, deleteUserController);
router.put('/:id/password', verifyToken, isSelfOrAdmin, updateUserPasswordController);
    