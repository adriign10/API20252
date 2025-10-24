import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';
import { conmysql } from '../db.js';

/**
 * REGISTRO DE USUARIO
 */
export const register = async (req, res) => {
  try {
    const { correo, clave, nombre, telefono, usuario } = req.body;

    // Validar campos requeridos
    if (!correo || !clave) {
      return res.status(400).json({ message: 'Correo y clave son requeridos' });
    }

    // Verificar si el correo ya existe
    const [rows] = await conmysql.query(
      'SELECT usr_id FROM usuarios WHERE usr_correo = ?',
      [correo]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(clave, 10);

    // Insertar nuevo usuario
    await conmysql.query(
      `INSERT INTO usuarios 
       (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [usuario || null, hashedPassword, nombre || null, telefono || null, correo]
    );

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

/**
 * INICIO DE SESIÓN (LOGIN)
 */
export const login = async (req, res) => {
  try {
    const { correo, clave } = req.body;

    // Validar campos requeridos
    if (!correo || !clave) {
      return res.status(400).json({ message: 'Correo y clave son requeridos' });
    }

    // Buscar el usuario
    const [rows] = await conmysql.query(
      'SELECT * FROM usuarios WHERE usr_correo = ? AND usr_activo = 1',
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = rows[0];

    // Comparar contraseña
    const validPassword = await bcrypt.compare(clave, user.usr_clave);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.usr_id,
        usuario: user.usr_usuario,
        correo: user.usr_correo,
        nombre: user.usr_nombre
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: 'Inicio de sesión correcto',
      token: `Bearer ${token}`,
      user: {
        id: user.usr_id,
        usuario: user.usr_usuario,
        nombre: user.usr_nombre,
        correo: user.usr_correo,
        telefono: user.usr_telefono,
        activo: user.usr_activo
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

/**
 * MIDDLEWARE PARA VERIFICAR TOKEN
 */
export const verificarToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'Token no proporcionado' });
    }

    // Extraer el token del encabezado
    const token = authHeader.replace('Bearer ', '').trim();

    // Verificar el token JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Guardar los datos del usuario decodificados en la solicitud
    req.usuario = decoded;

    next(); // continuar con la siguiente función
  } catch (error) {
    console.error('Error en verificarToken:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
