import { antennasPool } from "../config/db2";
import { IAntenna } from "../types";
import { ResultSetHeader, RowDataPacket } from "mysql2";

interface AntennaRow extends IAntenna, RowDataPacket {}

class Antenna {
  static async getAll(): Promise<IAntenna[]> {
    try {
      const [rows] = await antennasPool.query<AntennaRow[]>(`
        SELECT * FROM antennas
        ORDER BY id
      `);
      return rows;
    } catch (error) {
      console.error("Ошибка при получении списка антенн:", error);
      throw error;
    }
  }

  static async getByClientId(clientId: number): Promise<IAntenna[]> {
    try {
      const [rows] = await antennasPool.query<AntennaRow[]>(
        `
        SELECT * FROM antennas
        WHERE client_id = ?
        ORDER BY id
      `,
        [clientId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Ошибка при получении антенн клиента с ID ${clientId}:`,
        error
      );
      throw error;
    }
  }

  static async getById(id: number): Promise<IAntenna | null> {
    try {
      const [rows] = await antennasPool.query<AntennaRow[]>(
        `
        SELECT * FROM antennas
        WHERE id = ?
      `,
        [id]
      );

      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error(`Ошибка при получении антенны с ID ${id}:`, error);
      throw error;
    }
  }

  static async create(antennaData: IAntenna): Promise<IAntenna> {
    try {
      const {
        client_id,
        port_id,
        port_name,
        enabled,
        title,
        ant_type,
        ant_range,
        freq_min,
        freq_max,
        angle_start,
        angle_span,
      } = antennaData;

      const now = new Date();

      const [result] = await antennasPool.query<ResultSetHeader>(
        `
        INSERT INTO antennas (
          client_id, port_id, port_name, enabled, title, ant_type, 
          ant_range, freq_min, freq_max, angle_start, angle_span, time
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          client_id,
          port_id,
          port_name || null,
          enabled || null,
          title || null,
          ant_type || null,
          ant_range || null,
          freq_min || null,
          freq_max || null,
          angle_start || null,
          angle_span || null,
          now,
        ]
      );

      return {
        id: result.insertId,
        client_id,
        port_id,
        port_name,
        enabled,
        title,
        ant_type,
        ant_range,
        freq_min,
        freq_max,
        angle_start,
        angle_span,
        time: now,
      };
    } catch (error) {
      console.error("Ошибка при создании антенны:", error);
      throw error;
    }
  }

  static async update(
    id: number,
    antennaData: IAntenna
  ): Promise<IAntenna | null> {
    try {
      const {
        client_id,
        port_id,
        port_name,
        enabled,
        title,
        ant_type,
        ant_range,
        freq_min,
        freq_max,
        angle_start,
        angle_span,
      } = antennaData;

      const now = new Date();

      const [result] = await antennasPool.query<ResultSetHeader>(
        `
        UPDATE antennas 
        SET client_id = ?, port_id = ?, port_name = ?, enabled = ?, 
            title = ?, ant_type = ?, ant_range = ?, freq_min = ?, 
            freq_max = ?, angle_start = ?, angle_span = ?, time = ?
        WHERE id = ?
        `,
        [
          client_id,
          port_id,
          port_name || null,
          enabled || null,
          title || null,
          ant_type || null,
          ant_range || null,
          freq_min || null,
          freq_max || null,
          angle_start || null,
          angle_span || null,
          now,
          id,
        ]
      );

      if (result.affectedRows === 0) {
        return null;
      }

      return {
        id,
        client_id,
        port_id,
        port_name,
        enabled,
        title,
        ant_type,
        ant_range,
        freq_min,
        freq_max,
        angle_start,
        angle_span,
        time: now,
      };
    } catch (error) {
      console.error(`Ошибка при обновлении антенны с ID ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await antennasPool.query<ResultSetHeader>(
        `
        DELETE FROM antennas 
        WHERE id = ?
      `,
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Ошибка при удалении антенны с ID ${id}:`, error);
      throw error;
    }
  }
}

export default Antenna;
