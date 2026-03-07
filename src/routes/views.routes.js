const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager();

router.get('/', (req, res) => {
    const productos = productManager.obtenerTodos();
    res.render('home', { productos });
});

router.get('/realtimeproducts', (req, res) => {
    const productos = productManager.obtenerTodos();
    res.render('realTimeProducts', { productos });
});

module.exports = router;
