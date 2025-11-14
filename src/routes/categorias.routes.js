// routes/categorias.routes.js
import { Router } from 'express';
import {
  getCategorias,
  getCategoriaById,
  postCategoria,
  putCategoria,
  deleteCategoria
} from '../controladores/categoriasControl.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();

// 🔹 Rutas públicas
router.get('/categorias', verifyToken, getCategorias);
router.get('/categorias/:id', verifyToken, getCategoriaById);

// 🔹 Rutas protegidas con JWT
router.post('/categorias', verifyToken, postCategoria);
router.put('/categorias/:id', verifyToken, putCategoria);
router.delete('/categorias/:id', verifyToken, deleteCategoria);

export default router;