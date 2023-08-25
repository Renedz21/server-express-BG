import express from 'express'
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/userController.js'
import { isAdmin } from '../config/jwtMiddleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', getUserById)
router.post('/', isAdmin, createUser)
router.patch('/:userId', isAdmin, updateUser)
router.delete('/:userId', isAdmin, deleteUser)

export default router