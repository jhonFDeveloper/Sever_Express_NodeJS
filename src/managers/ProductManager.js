const fs = require('fs');
const path = require('path');

class ProductManager {

    constructor() {
        
        this.rutaArchivo = path.join(__dirname, '../../data/products.json');
    }

 
    leerProductos() {
        try {
            const datos = fs.readFileSync(this.rutaArchivo, 'utf-8');
            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }


    guardarProductos(productos) {
        fs.writeFileSync(this.rutaArchivo, JSON.stringify(productos, null, 2));
    }


    obtenerTodos() {
        return this.leerProductos();
    }

 
    obtenerPorId(id) {
        const productos = this.leerProductos();
        return productos.find(producto => producto.id === id);
    }


    crearProducto(datosProducto) {
        const productos = this.leerProductos();
        

        let nuevoId = 1;
        if (productos.length > 0) {
            const idsExistentes = productos.map(p => p.id);
            nuevoId = Math.max(...idsExistentes) + 1;
        }


        const nuevoProducto = {
            id: nuevoId,
            title: datosProducto.title,
            description: datosProducto.description,
            code: datosProducto.code,
            price: datosProducto.price,
            status: datosProducto.status !== undefined ? datosProducto.status : true,
            stock: datosProducto.stock,
            category: datosProducto.category,
            thumbnails: datosProducto.thumbnails || []
        };

        productos.push(nuevoProducto);
        this.guardarProductos(productos);
        return nuevoProducto;
    }


    actualizarProducto(id, datosActualizados) {
        const productos = this.leerProductos();
        const indice = productos.findIndex(producto => producto.id === id);

        if (indice === -1) {
            return null;
        }

 
        productos[indice] = {
            ...productos[indice],
            ...datosActualizados,
            id: productos[indice].id 
        };

        this.guardarProductos(productos);
        return productos[indice];
    }


    eliminarProducto(id) {
        const productos = this.leerProductos();
        const productosFiltrados = productos.filter(producto => producto.id !== id);

        if (productos.length === productosFiltrados.length) {
            return false; 
        }

        this.guardarProductos(productosFiltrados);
        return true;
    }
}

module.exports = ProductManager;