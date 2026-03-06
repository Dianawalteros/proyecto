import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import ventasRoutes from './routes/ventasRoutes.js';

dotenv.config();

const app = express();

// 📍 Obtener __dirname usando ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // Middleware para habilitar CORS
app.use(express.json()); // Middleware de Express para leer JSON

// ✅ Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Rutas API
app.use('/api', authRoutes);
app.use("/api/productos", productRoutes);

app.use('/api/ventas', ventasRoutes);

// ✅ Ruta raíz que muestra el HTML de inicio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});



