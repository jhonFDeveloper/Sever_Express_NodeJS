const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();


router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const resultado = await productManager.obtenerTodos({ limit, page, sort, query });
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const producto = await productManager.obtenerPorId(req.params.pid);
        if (!producto) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: producto });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || stock === undefined || !category) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        const nuevoProducto = await productManager.crearProducto({
            title, description, code, price, status, stock, category, thumbnails
        });

        const io = req.app.get('io');
        if (io) {
            const todos = await productManager.obtenerTodos();
            io.emit('actualizarProductos', todos.payload);
        }

        res.status(201).json({ status: 'success', payload: nuevoProducto });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


router.put('/:pid', async (req, res) => {
    try {
        const datosActualizados = req.body;

        if (!datosActualizados || Object.keys(datosActualizados).length === 0) {
            return res.status(400).json({ status: 'error', message: 'No se enviaron datos para actualizar' });
        }

        delete datosActualizados._id;

        const productoActualizado = await productManager.actualizarProducto(req.params.pid, datosActualizados);

        if (!productoActualizado) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.json({ status: 'success', payload: productoActualizado });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});


router.delete('/:pid', async (req, res) => {
    try {
        const eliminado = await productManager.eliminarProducto(req.params.pid);

        if (!eliminado) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        const io = req.app.get('io');
        if (io) {
            const todos = await productManager.obtenerTodos();
            io.emit('actualizarProductos', todos.payload);
        }

        res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
