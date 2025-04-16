import { pool } from "../config/db";
import { IChannel } from "../types";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface ChannelRow extends IChannel, RowDataPacket {}

class Channel {
  static async getAll(): Promise<IChannel[]> {
    try {
      const [rows] = await pool.query<ChannelRow[]>(`
        SELECT * FROM channel_list_for_user
        ORDER BY id
      `);
      return rows;
    } catch (error) {
      console.error("Ошибка при получении списка каналов:", error);
      throw error;
    }
  }

  static async getById(id: number): Promise<IChannel | null> {
    try {
      const [rows] = await pool.query<ChannelRow[]>(
        `
        SELECT * FROM channel_list_for_user
        WHERE id = ?
      `,
        [id]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Ошибка при получении канала с ID ${id}:`, error);
      throw error;
    }
  }

  static async create(channelData: IChannel): Promise<IChannel> {
    try {
      const { name, description } = channelData;

      const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO channel_list_for_user (name, description) 
        VALUES (?, ?)
      `,
        [name, description || null]
      );

      return {
        id: result.insertId,
        name,
        description,
      };
    } catch (error) {
      console.error("Ошибка при создании канала:", error);
      throw error;
    }
  }

  static async update(
    id: number,
    channelData: IChannel
  ): Promise<IChannel | null> {
    try {
      const { name, description } = channelData;

      const [result] = await pool.query<ResultSetHeader>(
        `
        UPDATE channel_list_for_user 
        SET name = ?, description = ?
        WHERE id = ?
      `,
        [name, description || null, id]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return {
        id,
        name,
        description,
      };
    } catch (error) {
      console.error(`Ошибка при обновлении канала с ID ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        `
        DELETE FROM channel_list_for_user 
        WHERE id = ?
      `,
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Ошибка при удалении канала с ID ${id}:`, error);
      throw error;
    }
  }
}

export default Channel;
