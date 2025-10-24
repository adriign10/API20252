import { Router } from 'express';
import { getProductos, getProductoById, postProducto, putProducto, deleteProducto } from '../controladores/productosCtrl.js';
import { verificarToken } from '../middleware/usuarios.js';
import upload from '../middlewares/upload.js'

const router = Router();

router.get('/productos', verificarToken, getProductos);
router.get('/productos/:id', verificarToken, getProductoById);
//router.post('/productos', verificarToken, postProducto);
router.post('/productos', upload.single('imagen'), verificarToken, postProducto);
router.put('/productos/:id', upload.single('imagen'), verificarToken, putProducto);
router.delete('/productos/:id', verificarToken, deleteProducto);

export default router;