import * as dotenv from 'dotenv'
dotenv.config()

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_REFRESK_SECRET_KEY = process.env.JWT_REFRESK_SECRET_KEY;