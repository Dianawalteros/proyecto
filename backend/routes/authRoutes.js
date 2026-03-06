import express from 'express';
import { editUser, getUsers, login, register, removeUser } from '../controllers/authController.js';

const router = express.Router();

// POST /api/register → Registrar usuario
router.post('/register', register);

// POST /api/login → Iniciar sesión
router.post('/login', login);

//GET /api/get -> listar user
router.get('/users', getUsers);

//DELETE /api/delete -> eliminar user
router.delete('/users/:id', removeUser);

//PUT /api/put -> editar user
router.put('/users/:id', editUser);

export default router;

