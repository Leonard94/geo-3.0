import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const antennasPool = mysql.createPool({
  host: process.env.DB2_HOST || "localhost",
  user: process.env.DB2_USER || "root",
  password: process.env.DB2_PASSWORD || "",
  database: process.env.DB2_NAME || "antennas_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const testAntennasConnection = async (): Promise<void> => {
  try {
    const connection = await antennasPool.getConnection();
    console.log("Успешное подключение к базе данных антенн MySQL");
    connection.release();
  } catch (error) {
    console.error("Ошибка подключения к базе данных антенн:", error);
    throw error;
  }
};

export { antennasPool, testAntennasConnection };
