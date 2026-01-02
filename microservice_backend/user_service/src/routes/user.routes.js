import express from 'express';
import {
    createUserController,
    getAllUsersController,
    getUserByEmailController,
    getUserByIdController,
    deleteUserController,
    updateUserPasswordController,
    updateUserController
} from '../controllers/user.controllers.js';

export const router = express.Router();
router.post('/', createUserController);
router.get('/', getAllUsersController);
router.get('/email/:email', getUserByEmailController);
router.get('/:id', getUserByIdController);
router.delete('/:id', deleteUserController);
router.put('/:id/password', updateUserPasswordController);
router.put('/:id', updateUserController);