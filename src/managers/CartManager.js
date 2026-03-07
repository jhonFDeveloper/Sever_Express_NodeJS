const fs = require('fs');
const path = require('path');

class CartManager {

    constructor() {
        this.rutaArchivo = path.join(__dirname, '../../data/carts.json');
    }

    leerCarritos() {
        try {
            const datos = fs.readFileSync(this.rutaArchivo, 'utf-8');
            return JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    guardarCarritos(carritos) {
        fs.writeFileSync(this.rutaArchivo, JSON.stringify(carritos, null, 2));
    }

    crearCarrito() {
        const carritos = this.leerCarritos();

        let nuevoId = 1;
        if (carritos.length > 0) {
            const idsExistentes = carritos.map(c => c.id);
            nuevoId = Math.max(...idsExistentes) + 1;
        }

        const nuevoCarrito = {
            id: nuevoId,
            products: []
        };

        carritos.push(nuevoCarrito);
        this.guardarCarritos(carritos);
        return nuevoCarrito;
    }

    obtenerPorId(id) {
        const carritos = this.leerCarritos();
        return carritos.find(carrito => carrito.id === id);
    }

    agregarProducto(cartId, productId) {
        const carritos = this.leerCarritos();
        const indice = carritos.findIndex(carrito => carrito.id === cartId);

        if (indice === -1) {
            return null;
        }

        const carrito = carritos[indice];
        const productoExistente = carrito.products.find(p => p.product === productId);

        if (productoExistente) {
            productoExistente.quantity += 1;
        } else {
            carrito.products.push({
                product: productId,
                quantity: 1
            });
        }

        this.guardarCarritos(carritos);
        return carrito;
    }
}

module.exports = CartManager;
