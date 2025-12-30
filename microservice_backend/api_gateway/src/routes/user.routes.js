import express from 'express';
import { forwardRequest } from '../utils/proxy.js';
import { verifyToken, isAdmin, isSelfOrAdmin } from '../middleware/auth.middleware.js';

export const router = express.Router();
router.post('/', forwardRequest("user", "createUser"));
router.get('/',verifyToken, isAdmin, forwardRequest("user", "getAllUsers"));
router.get('/email/:email', verifyToken, forwardRequest("user", "getUserByEmail"));
router.delete('/:id', verifyToken, isSelfOrAdmin, forwardRequest("user", "deleteUser"));
router.put('/:id/password', verifyToken, isSelfOrAdmin, forwardRequest("user", "updateUserPassword"));
    