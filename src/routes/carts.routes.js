const express = require("express");
const CartManager = require("../managers/CartManager");

const router = express.Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.status(201).json({ status: "success", payload: nuevoCarrito });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const carrito = await cartManager.obtenerPorId(req.params.cid);
    if (!carrito) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: carrito });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const carrito = await cartManager.agregarProducto(
      req.params.cid,
      req.params.pid,
    );
    if (!carrito) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: carrito });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const carrito = await cartManager.eliminarProducto(
      req.params.cid,
      req.params.pid,
    );
    if (!carrito) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito o producto no encontrado" });
    }
    res.json({
      status: "success",
      message: "Producto eliminado del carrito",
      payload: carrito,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || !Array.isArray(products)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Se debe enviar un array de products",
        });
    }
    const carrito = await cartManager.actualizarProductos(
      req.params.cid,
      products,
    );
    if (!carrito) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: carrito });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || isNaN(quantity)) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Se debe enviar una quantity valida",
        });
    }
    const carrito = await cartManager.actualizarCantidad(
      req.params.cid,
      req.params.pid,
      quantity,
    );
    if (!carrito) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito o producto no encontrado" });
    }
    res.json({ status: "success", payload: carrito });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const carrito = await cartManager.vaciarCarrito(req.params.cid);
    if (!carrito) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", message: "Carrito vaciado correctamente" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
