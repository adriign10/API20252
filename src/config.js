import dotenv from 'dotenv';
dotenv.config();

export const BD_HOST = process.env.BD_HOST || 'mysql-adriana242002.alwaysdata.net';
export const BD_DATABASE = process.env.BD_DATABASE || 'adriana242002_hola';
export const BD_USER = process.env.BD_USER || '437200';
export const BD_PASSWORD = process.env.BD_PASSWORD || 'Adry242002';
export const BD_PORT = process.env.BD_PORT || 3306;
export const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET || 'MiClaveSecretaSuperSegura123';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

