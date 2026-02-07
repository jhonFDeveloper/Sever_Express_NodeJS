
const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();


router.get('/', (req, res) => {
    const productos = productManager.obtenerTodos();
    res.json(productos);
});


router.get('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const producto = productManager.obtenerPorId(id);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
});


router.post('/', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;


    if (!title || !description || !code || !price || stock === undefined || !category) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoProducto = productManager.crearProducto({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    });

    res.status(201).json(nuevoProducto);
});


router.put('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const datosActualizados = req.body;


    if (!datosActualizados || Object.keys(datosActualizados).length === 0) {
        return res.status(400).json({ error: 'No se enviaron datos para actualizar' });
    }


    if (datosActualizados.id) {
        delete datosActualizados.id;
    }

    const productoActualizado = productManager.actualizarProducto(id, datosActualizados);

    if (!productoActualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(productoActualizado);
});

router.delete('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const eliminado = productManager.eliminarProducto(id);

    if (!eliminado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
});

module.exports = router;