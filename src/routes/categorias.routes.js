import { Router } from 'express'
import {
    pruebaCategorias,
    getCategorias,
    getCategoriaxID,
    postCategoria,
    putCategoria,
    deleteCategoria
} from '../controladores/categoriasControl.js'

import { verifyToken } from '../middleware/verifyToken.js'

const router = Router();

router.get('/categorias', verifyToken, getCategorias)
router.get('/categorias/:id', verifyToken, getCategoriaxID)
router.post('/categorias', verifyToken, postCategoria)
router.put('/categorias/:id', verifyToken, putCategoria)
router.delete('/categorias/:id', verifyToken, deleteCategoria)

export default router
