const errorHandlerMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Ha ocurrido un error en el servidor.';

    res.status(status).json({
        success: false,
        status,
        message
    });
};

export default errorHandlerMiddleware;