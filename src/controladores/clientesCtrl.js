import { conmysql } from '../db.js';

/**
 * Ruta de prueba
 */
export const prueba = (req, res) => {
    res.json({ message: 'Prueba con éxito', usuario: req.usuario });
};

/**
 * Obtener todos los clientes
 */
export const getClientes = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM clientes');
        res.json({
            cant: result.length,
            data: result
        });
    } catch (error) {
        console.error('Error getClientes:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

/**
 * Obtener cliente por ID
 */
export const getClientesxId = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('SELECT * FROM clientes WHERE cli_id = ?', [id]);

        if (result.length === 0) {
            return res.status(404).json({
                cant: 0,
                message: "Cliente no encontrado"
            });
        }

        res.json({
            cant: result.length,
            data: result[0]
        });
    } catch (error) {
        console.error('Error getClientesxId:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

/**
 * Insertar un cliente
 */
export const posCliente = async (req, res) => {
    try {
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad } = req.body;

        const [result] = await conmysql.query(
            `INSERT INTO clientes (cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad]
        );

        res.status(201).json({ 
            message: "Cliente creado correctamente",
            cli_id: result.insertId 
        });
    } catch (error) {
        console.error('Error posCliente:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

/**
 * Modificar un cliente
 */
export const putCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad } = req.body;

        const [result] = await conmysql.query(
            `UPDATE clientes 
             SET cli_identificacion = ?, cli_nombre = ?, cli_telefono = ?, cli_correo = ?, cli_direccion = ?, cli_pais = ?, cli_ciudad = ? 
             WHERE cli_id = ?`,
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        const [fila] = await conmysql.query('SELECT * FROM clientes WHERE cli_id = ?', [id]);
        res.json({ message: "Cliente actualizado correctamente", data: fila[0] });

    } catch (error) {
        console.error('Error putCliente:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

/**
 * Eliminar un cliente
 */
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await conmysql.query('DELETE FROM clientes WHERE cli_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }

        res.json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error('Error deleteCliente:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};
