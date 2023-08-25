import Burguer from "../models/burguerSchema.js";
import Order from "../models/orderSchema.js";
import { createError } from '../utils/createError.js'

export const getBurguers = async (req, res, next) => {
    try {
        const burguers = await Burguer.aggregate([
            {
                $match: { available: true },
            },
        ])
        res.status(200).json(burguers);
    } catch (error) {
        console.log(error);
        next(createError(error.message || 'No se pudo obtener la lista de hamburguesas', 500));
    }
}

export const getStatistics = async (req, res, next) => {
    try {
        const statistics = {
            totalSales: 0,             // Estadística 1: Ventas Totales
            salesByProduct: [],       // Estadística 2: Ventas por Producto
            salesByCategory: [],      // Estadística 3: Ventas por Categoría
            averageRevenuePerOrder: 0 // Estadística 4: Promedio de Ingresos por Orden
        };

        // Calcular Ventas Totales
        const totalSales = await Order.aggregate([
            {
                $group: {
                    // _id: '$_id',
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);
        if (totalSales.length > 0) {
            statistics.totalSales = totalSales[0].total;
        }

        // Calcular Ventas por Producto
        const salesByProduct = await Order.aggregate([
            {
                $unwind: '$burguers'
            },
            {
                $lookup: {
                    from: 'burguers',  // Nombre de la colección de hamburguesas
                    localField: 'burguers.burguerId',
                    foreignField: '_id',
                    as: 'burgerInfo'
                }
            },
            {
                $unwind: '$burgerInfo'
            },
            {
                $group: {
                    _id: '$burguers.burguerId', // Usamos _id para agrupar por nombre de hamburguesa
                    productName: { $first: '$burgerInfo.name' },
                    totalSold: { $sum: '$burguers.quantity' }
                }
            }
        ]);
        statistics.salesByProduct = salesByProduct;

        //TODO: Calcular Ventas por Categoría (Supongamos que tienes un campo 'category' en tus hamburguesas)
        // const salesByCategory = await Burguer.aggregate([
        //     {
        //         $group: {
        //             _id: '$category',
        //             totalSold: { $sum: '$cantidadVendida' }
        //         }
        //     }
        // ]);
        // statistics.salesByCategory = salesByCategory;

        // Calcular Promedio de Ingresos por Orden
        const averageRevenuePerOrder = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    average: { $avg: '$totalAmount' }
                }
            }
        ]);
        if (averageRevenuePerOrder.length > 0) {
            statistics.averageRevenuePerOrder = averageRevenuePerOrder[0].average;
        }

        res.status(200).json(statistics);
    } catch (error) {
        next(createError(error.message || 'No se pudieron obtener las estadísticas', 500));
    }
}

export const getBurguerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const burguer = await Burguer.findById({
            _id: id,
        });
        res.status(200).json(burguer);
    } catch (error) {
        next(createError(error.message || 'No se pudo obtener la hamburguesa', 500));
    }
}

export const createBurguers = async (req, res, next) => {
    try {
        const newProduct = new Burguer(req.body);

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (error) {
        next(createError(error.message || 'No se pudo crear la hamburguesa', 500));
    }
}

export const updateBurguer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const burguer = await Burguer.findByIdAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );
        res.status(200).json(burguer);
    } catch (error) {
        next(createError(error.message || 'No se pudo actualizar la hamburguesa', 500));
    }
}

export const deleteBurguer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const burguer = await Burguer.findByIdAndUpdate(
            { _id: id },
            { available: false },
            { new: true }
        );
        res.status(200).json(burguer);
    } catch (error) {
        next(createError(error.message || 'No se pudo eliminar la hamburguesa', 500));
    }
}