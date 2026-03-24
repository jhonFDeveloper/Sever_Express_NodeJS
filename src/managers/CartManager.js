const Cart = require('../models/Cart');

class CartManager {

    async crearCarrito() {
        const carrito = new Cart({ products: [] });
        return await carrito.save();
    }

    async obtenerPorId(id) {
        return await Cart.findById(id).populate('products.product').lean();
    }

    async agregarProducto(cartId, productId) {
        const carrito = await Cart.findById(cartId);
        if (!carrito) return null;

        const productoExistente = carrito.products.find(
            p => p.product.toString() === productId
        );

        if (productoExistente) {
            productoExistente.quantity += 1;
        } else {
            carrito.products.push({ product: productId, quantity: 1 });
        }

        await carrito.save();
        return await Cart.findById(cartId).populate('products.product').lean();
    }

    async eliminarProducto(cartId, productId) {
        const carrito = await Cart.findById(cartId);
        if (!carrito) return null;

        carrito.products = carrito.products.filter(
            p => p.product.toString() !== productId
        );

        await carrito.save();
        return carrito;
    }

    async actualizarProductos(cartId, productos) {
        const carrito = await Cart.findById(cartId);
        if (!carrito) return null;

        carrito.products = productos;
        await carrito.save();
        return await Cart.findById(cartId).populate('products.product').lean();
    }

    async actualizarCantidad(cartId, productId, quantity) {
        const carrito = await Cart.findById(cartId);
        if (!carrito) return null;

        const producto = carrito.products.find(
            p => p.product.toString() === productId
        );

        if (!producto) return null;

        producto.quantity = quantity;
        await carrito.save();
        return await Cart.findById(cartId).populate('products.product').lean();
    }

    async vaciarCarrito(cartId) {
        const carrito = await Cart.findById(cartId);
        if (!carrito) return null;

        carrito.products = [];
        await carrito.save();
        return carrito;
    }
}

module.exports = CartManager;
