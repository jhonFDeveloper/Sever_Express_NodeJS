const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager();

router.post('/', (req, res) => {
    const nuevoCarrito = cartManager.crearCarrito();
    res.status(201).json(nuevoCarrito);
});

router.get('/:cid', (req, res) => {
    const id = parseInt(req.params.cid);
    const carrito = cartManager.obtenerPorId(id);

    if (!carrito) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(carrito.products);
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const carritoActualizado = cartManager.agregarProducto(cartId, productId);

    if (!carritoActualizado) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(carritoActualizado);
});

module.exports = router;
