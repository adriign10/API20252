import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

// importar las rutas
import clientesRouters from './routes/clientes.routes.js'
import prodRouters from './routes/prod.routes.js'
import autentiRouters from './routes/autenti.routes.js'
import usuRouters from './routes/usu.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import categoriasRoutes from './routes/categorias.routes.js';

// ✅ Corrección de __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // permite formularios

const corsOptions = {
  origin: '*', // o si prefieres más seguro: 'http://localhost:8100'
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // 👈 agrega esto
  credentials: true
};
app.use(cors(corsOptions));

// Manejo del preflight OPTIONS
//app.options('*', cors(corsOptions));


// ✅ Esta línea no la necesitas si usas Cloudinary
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api', clientesRouters)
app.use('/api', prodRouters)
app.use('/api/autenti', autentiRouters)
app.use('/api', usuRouters)
app.use('/api', pedidosRoutes)
app.use('/api', categoriasRoutes);


app.get('/api/test', (req, res) => {
  res.json({ message: 'Servidor en Render funcionando 🚀' });
});
app.use((req, res, next) => {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

app.use((req, resp) => {
  resp.status(404).json({ message: 'Endpoint not found' })
})

export default app
