import express from 'express';
import {
    createUserController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserController,
    updateUserPasswordController
} from '../controllers/user.controllers.js';
import { isAdminRoute, isSelfRoute } from '../middleware/auth.middleware.js';

export const router = express.Router();
router.post('/', createUserController);
router.get('/', isAdminRoute, getAllUsersController);
router.get('/email/:email', getUserByEmailController);
router.delete('/:id', isSelfRoute, deleteUserController);
router.put('/:id/password', isSelfRoute, updateUserPasswordController);
    