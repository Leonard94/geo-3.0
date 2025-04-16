import { Request, Response } from "express";
import Client from "../models/clients";
import Antenna from "../models/antennas";

export const getRabsData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clients = await Client.getAll();

    const radarData = [];

    for (const client of clients) {
      const antennas = await Antenna.getByClientId(client.id!);

      const rayDefinitions = antennas.map((antenna) => {
        let azimuthValue = 0;
        if (antenna.title) {
          const azimuthMatch = antenna.title.match(/азимут\s+(\d+)/i);
          if (azimuthMatch && azimuthMatch[1]) {
            azimuthValue = parseInt(azimuthMatch[1]);
          }
        }

        return {
          name: antenna.title || "",
          id: antenna.id,
          distance: antenna.ant_range || 0,
          azimuth: azimuthValue,
          openingAngle: antenna.angle_span || 0,
          visible: antenna.enabled === 1,
          color: "rgb(255, 0, 0)",
        };
      });

      radarData.push({
        id: client.id,
        name: client.title || "",
        active: true,
        type: "подавитель",
        latitude: client.gnss_latitude || 0,
        longitude: client.gnss_longitude || 0,
        color: "rgb(255, 0, 0)",
        altitude: 0,
        rayDefinitions,
      });
    }

    res.status(200).json({
      success: true,
      data: radarData,
    });
  } catch (error) {
    console.error("Ошибка в контроллере getRadarData:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};
