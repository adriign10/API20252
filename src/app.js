import express from 'express';
import clientesRoutes from './routes/clientes.routes.js';
import productosRoutes from './routes/productos.routers.js';
import usuariosRoutes from './routes/usuarios.router.js';
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
const corsOptions={
  origin:'*',
  methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials:true
}
app.use(cors(corsOptions));

app.use('/api', usuariosRoutes);
app.use('/api', clientesRoutes);
app.use('/api', productosRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

export default app;
