import User from '../models/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '../config/config.js'
import { createError } from '../utils/createError.js'


export const login = async (req, res, next) => {

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(404).json({
            message: 'No se encontró el usuario.'
        });

        const isCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isCorrect) return res.status(400).json({ message: 'Credenciales inválidas.' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: '1h' });
        const refreshToken = jwt.sign({ id: user._id, role: user.name }, JWT_SECRET_KEY, { expiresIn: '1h' });

        const { password, ...rest } = user._doc;

        res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000 }).status(200).json({ token, refreshToken, user: rest });
    } catch (error) {
        console.log(error)
        next(createError('Error en el servidor.', 500))
    }

}
export const register = async (req, res, next) => {
    try {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            ...req.body,
            password: hash
        })

        const user = await newUser.save();

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: '2h' })
        const refreshToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: '7d' })
        const { password: _, ...data } = user._doc

        res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000 }).status(200).json({ token, refreshToken, user: data });

    } catch (error) {
        console.log(error)
        next(createError('Error en el servidor.', 500))
    }
}