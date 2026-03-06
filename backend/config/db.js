import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Probar la conexión
try {
  const connection = await pool.getConnection();
  console.log('✅ Conexión a la base de datos exitosa');
  connection.release(); // Muy importante: liberar conexión al pool
} catch (error) {
  console.error('❌ Error al conectar con la base de datos:', error.message);
}


