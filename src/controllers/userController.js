import User from '../models/userSchema.js';
import { createError } from '../utils/createError.js';

export const getUsers = async (req, res, next) => {

    try {
        const users = await User.find({}, { password: 0 });

        if (!users) return res.status(404).json({ message: 'No se encontraron usuarios.' });

        res.status(200).json(users);
    } catch (error) {
        next(createError('Error al obtener usuarios.', 500));
    }
}

export const getUserById = async (req, res, next) => {

    try {
        const { userId } = req.params;
        const user = await User.findById(userId, { password: 0 });

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

        res.status(200).json(user);
    } catch (error) {
        next(createError('Error al obtener usuario.', 500));
    }
}

export const createUser = async (req, res, next) => {

    try {
        const { ...data } = req.body;
        const newUser = new User({ ...data });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error)
        next(createError('Error al crear usuario.', 500));
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { ...data } = req.body;

        await User.findByIdAndUpdate(userId, { ...data }, { new: true });
        res.status(200).json({
            message: 'Usuario actualizado con exito.',
        });
    } catch (error) {
        next(createError('Error al actualizar usuario.', 500));
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params

        if (!userId) return res.status(400).json({ message: 'No se proporciono un id de usuario.' })

        await User.findByIdAndDelete(userId);
        res.status(200).json({
            message: 'Usuario eliminado con exito.',
        });
    } catch (error) {
        next(createError('Error al eliminar usuario.', 500));
    }
}