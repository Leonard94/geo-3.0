import { pool } from "../config/db";
import { IMessage } from "../types";
import { RowDataPacket } from "mysql2";

const HOURS_INTERVAL = 170;

interface MessageRow extends IMessage, RowDataPacket {}

class Message {
  static async getRecentMessages(): Promise<IMessage[]> {
    try {
      const [rows] = await pool.query<MessageRow[]>(`
        SELECT message_sending_time_bot, id, message 
        FROM data_for_analysis 
        WHERE send = '2' 
        AND message_sending_time_bot >= NOW() - INTERVAL ${HOURS_INTERVAL} HOUR 
        ORDER BY message_sending_time_bot DESC
      `);
      return rows;
    } catch (error) {
      console.error("Ошибка при получении списка сообщений:", error);
      throw error;
    }
  }
}

export default Message;
