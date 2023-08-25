import Order from '../models/orderSchema.js';
import User from '../models/userSchema.js';
import Burguer from '../models/burguerSchema.js';
import { createError } from '../utils/createError.js';
import { STATUS } from '../lib/constants.js';

function calculateTotalAmount(burguers) {
    let total = 0;
    for (const product of burguers) {
        total += product.quantity * product.price;
    }
    return total;
}

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('burguers.burguerId', 'name')
            .populate('userId', 'name email');

        if (!orders) return res.status(404).json({ message: 'No se encontraron ordenes' });

        res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        next(createError(error.message || 'No se pudo obtener la lista de ordenes', 500));
    }
}

export const getOrder = async (req, res, next) => {

    try {
        const { orderId } = req.params;

        if (!orderId) return res.status(400).json({ message: 'No se ha enviado el id de la orden' });

        const orders = await Order.findById(orderId)
            .populate('burguers.burguerId', 'name')
            .populate('userId', 'name email');

        res.status(200).json(orders);

    } catch (error) {
        console.log(error);
        next(createError(error.message || 'No se pudo obtener la orden', 500));
    }

}

export const createOrder = async (req, res, next) => {
    try {
        const { userId, burguers } = req.body;
        if (!userId) return res.status(400).json({ message: 'No se ha enviado el id del usuario' });

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'No se encontro el usuario.' });

        // const burguer = await User.findById(userId);

        // if (!burguer) return res.status(404).json({ message: 'No se encontro el usuario.' });

        const totalAmount = calculateTotalAmount(burguers);

        const order = await Order.create({ userId, burguers, totalAmount });

        for (const burger of burguers) {
            // Buscar la hamburguesa por su ID
            const foundBurger = await Burguer.findById(burger.burguerId);
            if (foundBurger) {
                // Incrementar la cantidad vendida en función de la cantidad comprada en la orden
                foundBurger.quantitySold += burger.quantity;
                // Guardar la hamburguesa actualizada en la base de datos
                await foundBurger.save();
            }
        }

        res.status(201).json(order);
    } catch (error) {
        next(createError(error.message || 'No se pudo crear la orden', 500));
    }
}

export const updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId) return next(createError('No se ha enviado el id de la orden', 400));
        if (!status) return next(createError('No se ha enviado el estado de la orden', 400));

        const prevOrder = await Order.findById(orderId);

        if (!prevOrder) return next(createError('No se ha encontrado la orden', 404))

        switch (status) {
            case STATUS.CONFIRMED_STATUS:
                if (prevOrder.status !== STATUS.PENDING_STATUS) {
                    next(createError('No se puede confirmar una orden que no esté pendiente de confirmación', 400));
                } else {
                    prevOrder.status = STATUS.CONFIRMED_STATUS;
                }
                break;
            case STATUS.SHIPPED_STATUS:
                if (prevOrder.status !== STATUS.CONFIRMED_STATUS) {
                    next(createError('No se puede enviar una orden que no esté confirmada de envío', 400));
                } else {
                    prevOrder.status = STATUS.SHIPPED_STATUS;
                }
                break;
            case STATUS.DELIVERED_STATUS:
                if (prevOrder.status !== STATUS.SHIPPED_STATUS) {
                    next(createError('No se puede entregar una orden que no esté enviada', 400));
                } else {
                    prevOrder.status = STATUS.DELIVERED_STATUS;
                }
                break;
            case STATUS.CANCELLED_STATUS:
                if (prevOrder.status === STATUS.PENDING_STATUS || prevOrder.status === STATUS.CONFIRMED_STATUS || prevOrder.status === STATUS.SHIPPED_STATUS || prevOrder.status === STATUS.DELIVERED_STATUS) {
                    prevOrder.status = STATUS.CANCELLED_STATUS;
                } else {
                    next(createError('No se puede cancelar una orden que no esté pendiente', 400));
                }
                break;
            default:
                break;
        }

        const updatedOrder = await prevOrder.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.log(error);
    }
}

export const deleteOrder = async (req, res, next) => {
    try {

        const { orderId } = req.params

        if (!orderId) return next(createError('No se ha enviado el id de la orden', 400));

        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            message: 'Orden eliminada con exito.',
        });

    } catch (error) {
        next(createError('Error al eliminar orden.', 500));
    }
}