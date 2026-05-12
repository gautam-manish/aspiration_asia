import express from 'express';
import auth from '../Middleware/authMiddleware.js';
import { getAllClients, createClient, deleteClient } from '../Controller/clientController.js';

const router = express.Router();

router.get('/', auth, getAllClients);
router.post('/', auth, createClient);
router.delete('/:id', auth, deleteClient);

export default router;