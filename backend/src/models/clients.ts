import { antennasPool } from "../config/db2";
import { IClient } from "../types";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface ClientRow extends IClient, RowDataPacket {}

class Client {
  static async getAll(): Promise<IClient[]> {
    try {
      const [rows] = await antennasPool.query<ClientRow[]>(`
        SELECT * FROM clients
        ORDER BY id
      `);
      return rows;
    } catch (error) {
      console.error("Ошибка при получении списка клиентов:", error);
      throw error;
    }
  }

  static async getById(id: number): Promise<IClient | null> {
    try {
      const [rows] = await antennasPool.query<ClientRow[]>(
        `
        SELECT * FROM clients
        WHERE id = ?
      `,
        [id]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Ошибка при получении клиента с ID ${id}:`, error);
      throw error;
    }
  }

  static async create(clientData: IClient): Promise<IClient> {
    try {
      const { ip_v4, title, gnss_latitude, gnss_longitude, gnss_course } =
        clientData;

      const now = new Date();

      const [result] = await antennasPool.query<ResultSetHeader>(
        `
        INSERT INTO clients (ip_v4, title, gnss_latitude, gnss_longitude, gnss_course, time) 
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          ip_v4,
          title || null,
          gnss_latitude || null,
          gnss_longitude || null,
          gnss_course || null,
          now,
        ]
      );

      return {
        id: result.insertId,
        ip_v4,
        title,
        gnss_latitude,
        gnss_longitude,
        gnss_course,
        time: now,
      };
    } catch (error) {
      console.error("Ошибка при создании клиента:", error);
      throw error;
    }
  }

  static async update(
    id: number,
    clientData: IClient
  ): Promise<IClient | null> {
    try {
      const { ip_v4, title, gnss_latitude, gnss_longitude, gnss_course } =
        clientData;

      const now = new Date();

      const [result] = await antennasPool.query<ResultSetHeader>(
        `
        UPDATE clients 
        SET ip_v4 = ?, title = ?, gnss_latitude = ?, gnss_longitude = ?, gnss_course = ?, time = ?
        WHERE id = ?
        `,
        [
          ip_v4,
          title || null,
          gnss_latitude || null,
          gnss_longitude || null,
          gnss_course || null,
          now,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return {
        id,
        ip_v4,
        title,
        gnss_latitude,
        gnss_longitude,
        gnss_course,
        time: now,
      };
    } catch (error) {
      console.error(`Ошибка при обновлении клиента с ID ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await antennasPool.query<ResultSetHeader>(
        `
        DELETE FROM clients 
        WHERE id = ?
      `,
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Ошибка при удалении клиента с ID ${id}:`, error);
      throw error;
    }
  }
}

export default Client;
