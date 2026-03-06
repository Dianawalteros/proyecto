import { pool } from '../config/db.js';

export const getCarrito = async (userId) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.cantidad, p.* 
     FROM carrito c 
     JOIN productos p ON c.producto_id = p.id 
     WHERE c.user_id = ?`, 
    [userId]
  );
  return rows;
};

export const addToCart = async (userId, productoId, cantidad) => {
  // Verificar si el producto ya está en el carrito
  const [existing] = await pool.query(
    'SELECT * FROM carrito WHERE user_id = ? AND producto_id = ?',
    [userId, productoId]
  );

  if (existing.length > 0) {
    // Actualizar cantidad
    await pool.query(
      'UPDATE carrito SET cantidad = cantidad + ? WHERE user_id = ? AND producto_id = ?',
      [cantidad, userId, productoId]
    );
  } else {
    // Insertar nuevo item
    await pool.query(
      'INSERT INTO carrito (user_id, producto_id, cantidad) VALUES (?, ?, ?)',
      [userId, productoId, cantidad]
    );
  }
};

export const updateCartItem = async (userId, productoId, cantidad) => {
  await pool.query(
    'UPDATE carrito SET cantidad = ? WHERE user_id = ? AND producto_id = ?',
    [cantidad, userId, productoId]
  );
};

export const removeFromCart = async (userId, productoId) => {
  await pool.query(
    'DELETE FROM carrito WHERE user_id = ? AND producto_id = ?',
    [userId, productoId]
  );
};

export const clearCart = async (userId) => {
  await pool.query('DELETE FROM carrito WHERE user_id = ?', [userId]);
};