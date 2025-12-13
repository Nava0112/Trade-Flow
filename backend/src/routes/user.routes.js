import express from 'express';
import {
    createUserController,
    getAllUsersController,
    getUserByEmailController,
    deleteUserController,
    updateUserPasswordController
} from '../controllers/user.controllers.js';

export const router = express.Router();
router.post('/', createUserController);
router.get('/', getAllUsersController);
router.get('/email/:email', getUserByEmailController);
router.delete('/:id', deleteUserController);
router.put('/:id/password', updateUserPasswordController);
