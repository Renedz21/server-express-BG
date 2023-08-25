import express from 'express'
import { isAdmin } from '../config/jwtMiddleware.js'
import { createOrder, getOrder, getOrders, updateOrder, deleteOrder } from '../controllers/orderController.js'

const router = express.Router()

router.get('/', getOrders)
router.get('/:orderId', getOrder)
router.post('/', createOrder)
router.put('/:orderId', isAdmin, updateOrder)
router.delete('/:orderId', isAdmin, deleteOrder)
export default router