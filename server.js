const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');

const productosRouter = require('./src/routes/products.routes');
const carritosRouter  = require('./src/routes/carts.routes');
const viewsRouter     = require('./src/routes/views.routes');
const ProductManager  = require('./src/managers/ProductManager');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PUERTO = 8080;

const productManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src/views'));
app.set('io', io);
app.use('/',              viewsRouter);
app.use('/api/products',  productosRouter);
app.use('/api/carts',     carritosRouter);


io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('nuevoProducto', (datosProducto) => {
        try {
            const nuevoProducto = productManager.crearProducto(datosProducto);
            io.emit('actualizarProductos', productManager.obtenerTodos());
            console.log('Producto creado vía socket:', nuevoProducto.title);
        } catch (error) {
            socket.emit('error', 'Error al crear el producto');
        }
    });

    socket.on('eliminarProducto', (id) => {
        const eliminado = productManager.eliminarProducto(id);
        if (eliminado) {
            io.emit('actualizarProductos', productManager.obtenerTodos());
            console.log('Producto eliminado vía socket, id:', id);
        } else {
            socket.emit('error', 'Producto no encontrado');
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

httpServer.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
