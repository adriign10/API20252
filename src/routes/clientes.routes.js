import { Router } from 'express';
import { prueba, getClientes, getClientesxId, posCliente, putCliente, deleteCliente } from '../controladores/clientesCtrl.js';
import { verificarToken } from '../middleware/usuarios.js'; // <- nombre correcto

const router = Router();

router.get('/prueba', verificarToken, prueba);
router.get('/clientes2', getClientes);
router.get('/clientes', verificarToken, getClientes);
router.get('/clientes/:id', verificarToken, getClientesxId);
router.post('/clientes', verificarToken, posCliente);
router.put('/clientes/:id', verificarToken, putCliente);
router.delete('/clientes/:id', verificarToken, deleteCliente);

export default router;
