import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createUser, deleteUser, findUserByEmail, getAllUsers, updateUser } from '../models/userModel.js';

dotenv.config();
//listar user
export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

//eliminar user
export async function removeUser(req, res) {
  try {
    const { id } = req.params;
    await deleteUser(id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
}

//editar user
export async function editUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, rol } = req.body;
    await updateUser(id, name, email, rol);
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
}

// 👉 POST /api/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si ya existe un usuario con ese email
    const user = await findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Encriptar contraseña y crear nuevo usuario con rol 'cliente'
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, hashedPassword);

    res.status(201).json({ message: 'Usuario registrado con éxito', userId });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
  }
};

// 👉 POST /api/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseñas
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token con info relevante
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver token y rol
    res.json({
      message: 'Login exitoso',
      token,
      rol: user.rol
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};
