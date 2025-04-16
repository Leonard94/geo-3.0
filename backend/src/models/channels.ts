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
      const {
        name,
        url,
        num_of_messages_downloaded = 1,
        language = "русский",
        region = "Белгородская область",
      } = channelData;

      const [result] = await pool.query<ResultSetHeader>(
        `
        INSERT INTO channel_list_for_user (name, url, num_of_messages_downloaded, language, region) 
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          name,
          url || null,
          num_of_messages_downloaded || null,
          language || null,
          region || null,
        ]
      );

      return {
        id: result.insertId,
        name,
        url,
        num_of_messages_downloaded,
        language,
        region,
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
      const {
        name,
        url,
        num_of_messages_downloaded = 1,
        language = "русский",
        region = "Белгородская область",
      } = channelData;

      const [result] = await pool.query<ResultSetHeader>(
        `
        UPDATE channel_list_for_user 
        SET name = ?, url = ?, num_of_messages_downloaded = ?, language = ?, region = ?
        WHERE id = ?
        `,
        [
          name,
          url || null,
          num_of_messages_downloaded || null,
          language || null,
          region || null,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return {
        id,
        name,
        url,
        num_of_messages_downloaded,
        language,
        region,
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
