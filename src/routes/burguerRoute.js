import express from 'express';
import { getBurguers, createBurguers, getBurguerById, updateBurguer, deleteBurguer, getStatistics } from '../controllers/burguerController.js';
import { isAdmin } from '../config/jwtMiddleware.js';

const router = express.Router();

router.get('/', getBurguers);
router.get('/statics', isAdmin, getStatistics);
router.get('/:id', getBurguerById);
router.post('/', isAdmin, createBurguers);
router.put('/:id', isAdmin, updateBurguer);
router.delete('/:id', isAdmin, deleteBurguer);

export default router;