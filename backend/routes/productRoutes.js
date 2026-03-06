import { Router } from "express";
import { crearProducto, editarProducto, eliminarProducto, listarProductos, obtenerProducto } from "../controllers/productController.js";
import { isAdmin, verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// GET públicos
router.get("/", listarProductos);
router.get("/:id", obtenerProducto);

// Operaciones que modifican datos -> solo admin
router.post("/", verifyToken, isAdmin, crearProducto);
router.put("/:id", verifyToken, isAdmin, editarProducto);
router.delete("/:id", verifyToken, isAdmin, eliminarProducto);

export default router;
