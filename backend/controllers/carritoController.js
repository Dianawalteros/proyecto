import * as CarritoModel from '../models/carritoModel.js';

// Obtener carrito del usuario
export const getCarrito = async (req, res) => {
  try {
    const userId = req.user.id; // Asumiendo que viene del middleware de auth
    const items = await CarritoModel.getCarrito(userId);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ 
        message: 'Producto y cantidad son requeridos' 
      });
    }

    await CarritoModel.addToCart(userId, productoId, cantidad);
    res.json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al agregar al carrito' });
  }
};

// Actualizar cantidad de un item
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productoId, cantidad } = req.body;

    if (!productoId || !cantidad) {
      return res.status(400).json({ 
        message: 'Producto y cantidad son requeridos' 
      });
    }

    await CarritoModel.updateCartItem(userId, productoId, cantidad);
    res.json({ message: 'Carrito actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar carrito' });
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productoId } = req.params;

    await CarritoModel.removeFromCart(userId, productoId);
    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// Vaciar carrito
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await CarritoModel.clearCart(userId);
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al vaciar el carrito' });
  }
};