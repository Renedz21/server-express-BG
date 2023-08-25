import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

//* Configuraciones y middlewares
import { NODE_ENV, PORT, MONGO_URL } from './config/config.js'
import limmiter from './config/limmiter.js';
import { jwtMiddleware } from './config/jwtMiddleware.js';
import errorHandlerMiddleware from './config/errorMiddleware.js';

//* Rutas
import { burguerRoute, authRoute, orderRoute, userRoute, cartRoute } from './routes/index.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())
app.use(helmet());
app.use(errorHandlerMiddleware)
app.use(limmiter)

// Connection to DB
const connection = () => {
    mongoose.connect(MONGO_URL)
    console.log('Connected to DB');
};

//* Routes without middlewares
app.use('/api/auth', authRoute);

//* Middlewares
app.use(jwtMiddleware)

//* Routes with middleware
app.use('/api/burguer', burguerRoute);
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/cart', cartRoute);

//* Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connection();
});
