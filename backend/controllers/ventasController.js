import {
    createSaleTransaction,
    getAllSales,
    getSaleByIdModel,
    getSalesByClient
} from '../models/ventasModel.js';

// POST /api/ventas  (cliente hace checkout)
export const createSale = async (req, res) => {
  const clienteId = req.user.id; // from verifyToken
  const { items, metodo_pago } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'El carrito está vacío' });
  }

  try {
    const ventaId = await createSaleTransaction(clienteId, items, metodo_pago || 'efectivo', clienteId);
    res.status(201).json({ message: 'Venta registrada', ventaId });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error al crear la venta' });
  }
};

// POST /api/ventas/admin  (admin registra venta en nombre de un cliente)
export const createSaleByAdmin = async (req, res) => {
  const creadoPor = req.user.id; // admin
  const { cliente_id, items, metodo_pago } = req.body;

  if (!cliente_id) return res.status(400).json({ message: 'cliente_id es requerido' });
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'La venta necesita al menos un producto' });
  }

  try {
    const ventaId = await createSaleTransaction(cliente_id, items, metodo_pago || 'efectivo', creadoPor);
    res.status(201).json({ message: 'Venta registrada por admin', ventaId });
  } catch (err) {
    res.status(400).json({ message: err.message || 'Error al crear la venta' });
  }
};

// GET /api/ventas  (admin: todas, cliente: las suyas)
export const getSales = async (req, res) => {
  try {
    if (req.user.rol === 'admin') {
      const ventas = await getAllSales();
      return res.json(ventas);
    }
    const ventas = await getSalesByClient(req.user.id);
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
};

// GET /api/ventas/:id  (admin o propietario)
export const getSaleById = async (req, res) => {
  const ventaId = req.params.id;
  try {
    const venta = await getSaleByIdModel(ventaId);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });

    // Si no es admin, validar que sea propiedad del usuario
    if (req.user.rol !== 'admin' && venta.cliente_id !== req.user.id) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }

    res.json(venta);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener venta' });
  }
};
