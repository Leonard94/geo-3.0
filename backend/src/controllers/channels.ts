import { Request, Response } from "express";
import Channel from "../models/channels";
import { IChannel } from "../types";

const formatTelegramUrl = (url: string | undefined): string | undefined => {
  if (!url) {
    return undefined;
  }

  if (url.startsWith("t./me/")) {
    return "https://t.me/" + url.substring(6);
  } else if (url.startsWith("t.me/")) {
    return "https://t.me/" + url.substring(5);
  } else if (!url.startsWith("https://t.me/")) {
    return "https://t.me/" + url;
  }

  return url;
};

export const getAllChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const channels = await Channel.getAll();

    const transformedChannels = channels.map((channel) => ({
      ...channel,
      isActive: channel.isActive === 1,
    }));

    res.status(200).json({
      success: true,
      count: channels.length,
      data: transformedChannels,
    });
  } catch (error) {
    console.error("Ошибка в контроллере getAllChannels:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

export const getChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: "Некорректный ID канала",
      });
      return;
    }

    const channel = await Channel.getById(id);

    if (!channel) {
      res.status(404).json({
        success: false,
        error: "Канал не найден",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (error) {
    console.error("Ошибка в контроллере getChannel:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

export const createChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body.name) {
      res.status(400).json({
        success: false,
        error: "Пожалуйста, укажите название канала",
      });
      return;
    }

    if (req.body.isActive === undefined) {
      res.status(400).json({
        success: false,
        error: "Пожалуйста, укажите статус активности канала",
      });
      return;
    }

    const url = formatTelegramUrl(req.body.url);

    const channelData: IChannel = {
      name: req.body.name,
      url: url,
      isActive: req.body.isActive ? 1 : 0,
    };

    const channel = await Channel.create(channelData);

    res.status(201).json({
      success: true,
      data: {
        ...channel,
        isActive: channel.isActive === 1,
      },
    });
  } catch (error) {
    console.error("Ошибка в контроллере createChannel:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

export const updateChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: "Некорректный ID канала",
      });
      return;
    }

    if (!req.body.name) {
      res.status(400).json({
        success: false,
        error: "Пожалуйста, укажите название канала",
      });
      return;
    }

    if (req.body.isActive === undefined) {
      res.status(400).json({
        success: false,
        error: "Пожалуйста, укажите статус активности канала",
      });
      return;
    }

    const url = formatTelegramUrl(req.body.url);

    const channelData: IChannel = {
      name: req.body.name,
      url: url,
      isActive: req.body.isActive ? 1 : 0,
    };

    const channel = await Channel.update(id, channelData);

    if (!channel) {
      res.status(404).json({
        success: false,
        error: "Канал не найден",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...channel,
        isActive: channel.isActive === 1,
      },
    });
  } catch (error) {
    console.error("Ошибка в контроллере updateChannel:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};

export const deleteChannel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        error: "Некорректный ID канала",
      });
      return;
    }

    const isDeleted = await Channel.delete(id);

    if (!isDeleted) {
      res.status(404).json({
        success: false,
        error: "Канал не найден",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Ошибка в контроллере deleteChannel:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};
