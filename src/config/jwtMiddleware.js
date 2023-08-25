import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from './config.js';
import { ROLES } from '../lib/constants.js';
import { createError } from '../utils/createError.js';

const jwtMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token) {
            return res.status(401).json({ message: 'Acceso no autorizado. No se proporciono un token de seguridad' });
        }

        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Acceso no autorizado. Token invalido.' });
            } else {
                const tokenExpired = decoded.exp < Date.now() / 1000;

                if (tokenExpired) {
                    return res.status(401).json({ message: 'Acceso no autorizado. Token expirado.' });
                } else {
                    return decoded;
                }
            }
        });
        next();
    } catch (error) {
        next(createError('Acceso no autorizado. Token invalido.', 401));
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ message: 'Acceso no autorizado. No se proporciono un token.' });
        }

        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Acceso no autorizado. Token invalido.' });
            } else {
                const tokenExpired = decoded.exp < Date.now() / 1000;

                if (tokenExpired) {
                    return res.status(401).json({ message: 'Acceso no autorizado. Token expirado.' });
                } else {
                    if (decoded.role === ROLES.ADMIN_ROLE || decoded.role === ROLES.SUPERADMIN_ROLE) {
                        next();
                        return decoded;
                    } else {
                        return res.status(401).json({ message: 'Acceso no autorizado. No es administrador.' });
                    }
                }
            }
        });
    } catch (error) {
        next(createError('Acceso no autorizado. Token invalido.', 401));
    }
}

export { jwtMiddleware, isAdmin };