import User from '../models/userSchema.js'
import Product from '../models/burguerSchema.js'
import Cart from '../models/cartSchema.js'
import { createError } from '../utils/createError.js'

export const destroyCart = async (req, res, next) => {
    try {
        const { userId } = req.params

        const cart = await Cart.findOneAndDelete({ userId: userId })

        res.status(200).json(cart)

    } catch (error) {
        next(createError(error.message, 404))
    }
}

export const getCarts = async (req, res, next) => {
    try {
        const carts = await Cart.find()
            .populate('userId', 'name lastName email')
            .populate('products.productId', 'name price image');

        res.status(200).json(carts)
    } catch (error) {
        next(createError(error.message, 404))
    }
}

export const getCart = async (req, res, next) => {
    try {

        const { userId } = req.params

        const cart = await Cart.findOne({ userId: userId })
            .populate('userId', 'name lastName email')
            .populate('products.productId', 'name price image');

        if (!cart) return res.status(404).json({ message: 'El carrito no existe' })


        res.status(200).json(cart)

    } catch (error) {
        next(createError(error.message, 404))
    }
}

export const addToCart = async (req, res, next) => {

    try {
        const { userId, productId, quantity } = req.body

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'El usuario no fue encontrado.' })

        // Verificar si el producto existe
        const product = await Product.findById(productId);

        if (!product) return res.status(404).json({ message: 'El producto no fue encontrado.' })

        let cart = await Cart.findOne({ userId: userId })

        // Si no existe un carrito, crear uno nuevo
        if (cart === null || cart === undefined || cart === '') {
            cart = new Cart({
                userId: userId,
                products: []
            })
        }
        // Verificar si el producto ya está en el carrito
        const existingProduct = cart.products.find((item) => item.productId.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo
            cart.products.push({ productId: productId, quantity: quantity });
        }

        // Guardar el carrito actualizado
        const updatedCart = await cart.save();

        res.status(200).json(updatedCart);

    } catch (error) {
        next(createError(error.message, 400));
    }

}

export const createCart = async (req, res, next) => {
    try {
        const { userId } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            throw createError('User not found', 404);
        }

        // Verificar si el usuario ya tiene un carrito
        const existingCart = await Cart.findOne({ user: userId });
        if (existingCart) return res.status(400).json({ message: 'El carro existe actualmente para este usuario.' });

        // Crear un nuevo carrito
        const newCart = new Cart({
            userId: userId,
            products: []
        });

        // Guardar el carrito en la base de datos
        const savedCart = await newCart.save();

        res.status(201).json(savedCart);
    } catch (error) {
        next(createError(error.message, 400));
    }
}