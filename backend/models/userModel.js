import { pool } from '../config/db.js';

// Buscar usuario por email (para login)
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT id, name, email, password, rol FROM users WHERE email = ?',
    [email]
  );
  return rows[0]; // Devuelve un solo usuario
};

// Crear un nuevo usuario (con rol por defecto 'cliente')
export const createUser = async (name, email, hashedPassword) => {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password, rol) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, 'cliente']
  );
  return result.insertId; // Devuelve el ID del nuevo usuario
};

//listar usuarios en tabla

export async function getAllUsers() {
  const [rows] = await pool.query('SELECT id, name, email, rol FROM users');
  return rows;
}

//eliminar usuario

export async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
}

//editar usuario
export async function updateUser(id, name, email, rol) {
  await pool.query(
    'UPDATE users SET name = ?, email = ?, rol = ? WHERE id = ?',
    [name, email, rol, id]
  );
};
