import express from 'express'
import { getCart, addToCart, createCart, getCarts } from '../controllers/cartController.js'
import { isAdmin } from '../config/jwtMiddleware.js'

const router = express.Router()

router.get('/', getCarts)
router.get('/:userId', getCart)
router.post('/', createCart)
router.post('/add', addToCart)

export default router