const Product = require('../models/Product');

class ProductManager {

    async obtenerTodos({ limit = 10, page = 1, sort, query } = {}) {
        const filtro = {};

        if (query) {
            if (query === 'true' || query === 'false') {
                filtro.status = query === 'true';
            } else {
                filtro.category = { $regex: query, $options: 'i' };
            }
        }

        const opciones = {
            limit: parseInt(limit),
            page:  parseInt(page),
            sort:  sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean:  true
        };

        const resultado = await Product.paginate(filtro, opciones);

   
        const params = new URLSearchParams();
        params.set('limit', limit);
        if (sort)  params.set('sort', sort);
        if (query) params.set('query', query);

        const basePath = '/products';

        return {
            status:      'success',
            payload:     resultado.docs,
            totalPages:  resultado.totalPages,
            prevPage:    resultado.prevPage,
            nextPage:    resultado.nextPage,
            page:        resultado.page,
            hasPrevPage: resultado.hasPrevPage,
            hasNextPage: resultado.hasNextPage,
            prevLink:    resultado.hasPrevPage
                ? `${basePath}?page=${resultado.prevPage}&${params.toString()}`
                : null,
            nextLink:    resultado.hasNextPage
                ? `${basePath}?page=${resultado.nextPage}&${params.toString()}`
                : null
        };
    }

    async obtenerPorId(id) {
        return await Product.findById(id).lean();
    }

    async crearProducto(datos) {
        const producto = new Product(datos);
        return await producto.save();
    }

    async actualizarProducto(id, datos) {
        return await Product.findByIdAndUpdate(id, datos, { new: true });
    }

    async eliminarProducto(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductManager;
