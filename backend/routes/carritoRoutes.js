import express from 'express';
import { getCarrito, addToCart, updateCartItem, removeFromCart, clearCart } 
from '../controllers/carritoController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware); // Proteger todas las rutas del carrito

router.get('/', getCarrito);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productoId', removeFromCart);
router.delete('/clear', clearCart);

export default router;