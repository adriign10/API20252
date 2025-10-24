import { conmysql } from '../db.js';


export const getProductos = async (req, resp) => {
  try {
    const [result] = await conmysql.query('SELECT * FROM productos');
    resp.json({
      cant: result.length,
      data: result
    });
  } catch (error) {
    console.error(error);
    return resp.status(500).json({ message: "error en el servidor" });
  }
};

export const getProductoById = async (req, resp) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
    if (result.length === 0) {
      return resp.status(404).json({ message: "Producto no encontrado" });
    }
    resp.json(result[0]);
  } catch (error) {
    console.error(error);
    return resp.status(500).json({ message: "error en el servidor" });
  }
};

export const postProducto = async (req, resp) => {
  try {
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
    const prod_imagen=req.file? `/uploads/${req.file.filename}`:null;
    const [result] = await conmysql.query(
      `INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
    );
    resp.status(201).json({
      message: 'Producto creado',
      insertId: result.insertId
    });
  } catch (error) {
    console.error(error);
    return resp.status(500).json({ message: "error en el servidor" });
  }
};

export const putProducto = async (req, resp) => {
  try {
    const { id } = req.params;
    const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
    const nuevaImagen = req.file ? `/uploads/${req.file.filename}` : req.body.prod_imagen;
    const [productoActual] = await conmysql.query(
      'SELECT prod_imagen FROM productos WHERE prod_id = ?',
      [id]
    );

    if (productoActual.length === 0) {
      return resp.status(404).json({ message: 'Producto no encontrado' });
    }

    const imagenAnterior = productoActual[0].prod_imagen;
    const [result] = await conmysql.query(
      `UPDATE productos
       SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ?
       WHERE prod_id = ?`,
      [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, nuevaImagen, id]
    );

    if (result.affectedRows <= 0) {
      return resp.status(404).json({ message: 'Producto no encontrado' });
    }

    // Eliminar la imagen anterior si se subió una nueva
    if (req.file && imagenAnterior && imagenAnterior !== nuevaImagen) {
      import('fs').then(fs => {
        const rutaImagenAnterior = path.join(process.cwd(), imagenAnterior);
        fs.unlink(rutaImagenAnterior, err => {
          if (err) console.error('Error al eliminar imagen anterior:', err);
        });
      });
    }

    resp.json({ message: 'Producto actualizado correctamente' });

  } catch (error) {
    console.error(error);
    return resp.status(500).json({ message: 'error en el servidor' });
  }
};


export const deleteProducto = async (req, resp) => {
  try {
    const { id } = req.params;
    const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id = ?', [id]);
    if (result.affectedRows <= 0) {
      return resp.status(404).json({ message: "Producto no encontrado" });
    }
    resp.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return resp.status(500).json({ message: "error en el servidor" });
  }
};
