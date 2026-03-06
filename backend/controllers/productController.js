import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../models/productModel.js";

export const listarProductos = async (req, res) => {
  try {
    const productos = await getAllProducts();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const producto = await getProductById(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    console.log("Body recibido:", req.body);
    const nuevoId = await createProduct(req.body);
    res.json({ message: "Producto creado", id: nuevoId });
  } catch (error) {
    console.error("Error en crearProducto:", error);  // 👈 imprime error real en consola
    res.status(500).json({ error: error.message });
  }
};

export const editarProducto = async (req, res) => {
  try {
    const actualizado = await updateProduct(req.params.id, req.body);
    if (actualizado === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const eliminado = await deleteProduct(req.params.id);
    if (eliminado === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

