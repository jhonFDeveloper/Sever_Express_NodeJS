const express = require("express");
const ProductManager = require("../managers/ProductManager");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const resultado = await productManager.obtenerTodos({
      limit,
      page,
      sort,
      query,
    });

    res.render("index", {
      productos: resultado.payload,
      totalPages: resultado.totalPages,
      page: resultado.page,
      hasPrevPage: resultado.hasPrevPage,
      hasNextPage: resultado.hasNextPage,
      prevLink: resultado.prevLink,
      nextLink: resultado.nextLink,
      query: query || "",
      sort: sort || "",
    });
  } catch (error) {
    res.status(500).render("error", { mensaje: error.message });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const producto = await productManager.obtenerPorId(req.params.pid);
    if (!producto) {
      return res
        .status(404)
        .render("error", { mensaje: "Producto no encontrado" });
    }
    res.render("productDetail", { producto });
  } catch (error) {
    res.status(500).render("error", { mensaje: error.message });
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const carrito = await cartManager.obtenerPorId(req.params.cid);
    if (!carrito) {
      return res
        .status(404)
        .render("error", { mensaje: "Carrito no encontrado" });
    }

    const productosValidos = carrito.products.filter(
      (item) => item.product !== null,
    );

    const total = productosValidos.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    res.render("cart", {
      carrito: { ...carrito, products: productosValidos },
      total,
      cartId: req.params.cid,
    });
  } catch (error) {
    res.status(500).render("error", { mensaje: error.message });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const resultado = await productManager.obtenerTodos();
    res.render("realTimeProducts", { productos: resultado.payload });
  } catch (error) {
    res.status(500).render("error", { mensaje: error.message });
  }
});

module.exports = router;
