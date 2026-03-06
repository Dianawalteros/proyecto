import { Router } from 'express';
import {
    createSale,
    createSaleByAdmin,
    getSaleById,
    getSales
} from '../controllers/ventasController.js';
import { isAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

// Cliente crea su venta (checkout) -> requiere token (cliente)
router.post('/', verifyToken, createSale);

// Admin crea una venta en nombre de un cliente
router.post('/admin', verifyToken, isAdmin, createSaleByAdmin);

// Obtener ventas: admin -> todas; cliente -> solo sus ventas
router.get('/', verifyToken, getSales);

// Obtener detalle de una venta (admin o propietario)
router.get('/:id', verifyToken, getSaleById);

export default router;
