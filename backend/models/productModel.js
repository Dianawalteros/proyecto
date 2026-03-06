import { pool } from "../config/db.js";

export const getAllProducts = async () => {
  const [rows] = await pool.query("SELECT * FROM products");
  return rows;
};

export const getProductById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

export const createProduct = async (data) => {
  const { producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra } = data;
  const [result] = await pool.query(
    "INSERT INTO products (producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra]
  );
  return result.insertId;
};

export const updateProduct = async (id, data) => {
  const { producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra } = data;
  const [result] = await pool.query(
    "UPDATE products SET producto=?, descripcion=?, precio_compra=?, precio_venta=?, stock=?, imagen_url=?, fecha_compra=? WHERE id=?",
    [producto, descripcion, precio_compra, precio_venta, stock, imagen_url, fecha_compra, id]
  );
  return result.affectedRows;
};

export const deleteProduct = async (id) => {
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows;
};



