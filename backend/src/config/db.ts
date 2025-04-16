import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "channels_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("Успешное подключение к базе данных MySQL");
    connection.release();
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error);
    throw error;
  }
};

export { pool, testConnection };
