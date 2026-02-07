const express = require('express');
const productosRouter = require('./src/routes/products.routes');

const app = express();
const PUERTO = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/products', productosRouter);


app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});