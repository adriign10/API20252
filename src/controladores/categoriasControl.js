import { conmysql } from '../db.js'

// Prueba de conexión
export const pruebaCategorias = (req, res) => {
    res.send('Endpoint de Categorías funcionando');
}

// Obtener todas las categorías
export const getCategorias = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM categorias');
        res.json({
            cantidad: result.length,
            data: result
        });
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener las categorías" });
    }
}

// Obtener categoría por ID
export const getCategoriaxID = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM categorias WHERE cat_id = ?', [req.params.id]);
        if (result.length <= 0) return res.status(404).json({ message: "Categoría no encontrada" });
        res.json(result[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// Crear una nueva categoría
export const postCategoria = async (req, res) => {
    try {
        const { cat_nombre, cat_descripcion } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO categorias (cat_nombre, cat_descripcion) VALUES (?, ?)',
            [cat_nombre, cat_descripcion]
        );
        res.status(201).json({ cat_id: result.insertId, message: "Categoría creada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al crear la categoría" });
    }
}

// Actualizar una categoría
export const putCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { cat_nombre, cat_descripcion } = req.body;
        const [result] = await conmysql.query(
            'UPDATE categorias SET cat_nombre = ?, cat_descripcion = ? WHERE cat_id = ?',
            [cat_nombre, cat_descripcion, id]
        );
        if (result.affectedRows <= 0) return res.status(404).json({ message: "Categoría no encontrada" });
        const [updated] = await conmysql.query('SELECT * FROM categorias WHERE cat_id = ?', [id]);
        res.json(updated[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar la categoría" });
    }
}

// Eliminar una categoría
export const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await conmysql.query('DELETE FROM categorias WHERE cat_id = ?', [id]);
        if (result.affectedRows <= 0) return res.status(404).json({ message: "Categoría no encontrada" });
        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la categoría" });
    }
}
