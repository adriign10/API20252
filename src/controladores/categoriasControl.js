import { conmysql } from '../db.js'

export const prueba = (req, res) => {
    res.send('Prueba con éxito');
}

// ✅ Obtener todas las categorías
export const getCategorias = async (req, res) => {
    try {
            const [result] = await conmysql.query(' select * from categorias')   //es consulta el query
            res.json({
                cantidad: result.length,
                data: result
            })
            // res.json(result)
        } catch (error) {
            return res.status(500).json({ message: "Error en el servidor" })
        }
    }

// ✅ Obtener categoría por ID
export const getCategoriaById = async (req, res) => {
try {
    const [result] = await conmysql.query(' select * from categorias where cat_id =?', [req.params.id])   //es consulta el query
    if (result.length <= 0) return res.json({
      cantidad: 0,
      message: "Categoria no encontrada"
    })
    res.json({
      cantidad: result.length,
      dataProd: result[0]
    })
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" })
  }
}

// ✅ Crear categoría
export const postCategoria = async (req, res) => {
    try {
        
        const { cat_nombre, cat_descripcion } = req.body
        //console.log(req.body)
        const [result] = await conmysql.query(
            'insert into categorias (cat_nombre, cat_descripcion) values (?,?)',
            [cat_nombre, cat_descripcion]
        )
        res.send({ cat_id: result.insertId })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

// ✅ Actualizar categoría
export const putCategoria = async (req, res) => {
try {
  const { id } = req.params;
  const { cat_nombre, cat_descripcion } = req.body;        /* console.log(req.body)
        console.log(id) */
        const [result] = await conmysql.query(
            'update categorias set cat_nombre=?, cat_descripcion=? where cat_id=?',
            [cat_nombre, cat_descripcion, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            message: "Categoria no encontrado"
        })

        const [fila] = await conmysql.query(' select * from categorias where cat_id =?', [id])
        res.json(fila[0])


    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

// ✅ Eliminar categoría
export const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params
        /* console.log(req.body)
        console.log(id) */
        const [result] = await conmysql.query(
            'delete from categorias where cat_id=?',
            [id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({
            message: "Categorias no encontrado"
        })
        res.json({
            message: "Categoria eliminado correctamente"
        })

    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}
