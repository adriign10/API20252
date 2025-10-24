import { Router } from 'express';
import { register, login } from '../controladores/usuariosctrl.js';
import { verificarToken } from '../middleware/usuarios.js';

const router = Router();

// Registro e inicio de sesión (públicos)
router.post('/register', register);
router.post('/login', login);

// Ruta protegida (requiere token válido)
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    message: 'Acceso concedido',
    usuario: req.usuario
  });
});

export default router;
