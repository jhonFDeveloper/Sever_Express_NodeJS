const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
require('dotenv').config();

const conectarDB     = require('./src/config/db');
const productosRouter = require('./src/routes/products.routes');
const carritosRouter  = require('./src/routes/carts.routes');
const viewsRouter     = require('./src/routes/views.routes');
const ProductManager  = require('./src/managers/ProductManager');

const app        = express();
const httpServer = createServer(app);
const io         = new Server(httpServer);
const PUERTO     = process.env.PORT || 8080;

const productManager = new ProductManager();


conectarDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine({
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));
app.set('io', io);
app.use('/',             viewsRouter);
app.use('/api/products', productosRouter);
app.use('/api/carts',    carritosRouter);

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('nuevoProducto', async (datosProducto) => {
        try {
            await productManager.crearProducto(datosProducto);
            const resultado = await productManager.obtenerTodos();
            io.emit('actualizarProductos', resultado.payload);
        } catch (error) {
            socket.emit('error', 'Error al crear el producto: ' + error.message);
        }
    });

    socket.on('eliminarProducto', async (id) => {
        try {
            await productManager.eliminarProducto(id);
            const resultado = await productManager.obtenerTodos();
            io.emit('actualizarProductos', resultado.payload);
        } catch (error) {
            socket.emit('error', 'Error al eliminar el producto');
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

httpServer.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
