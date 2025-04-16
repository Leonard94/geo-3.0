import { Request, Response } from "express";
import Channel from "../models/channels";
import { IChannel } from "../types";

export const getAllChannels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const channels = await Channel.getAll();
    res.status(200).json({
      success: true,
      count: channels.length,
      data: channels,
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

    const channelData: IChannel = {
      name: req.body.name,
      description: req.body.description,
    };

    const channel = await Channel.create(channelData);

    res.status(201).json({
      success: true,
      data: channel,
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

    const channelData: IChannel = {
      name: req.body.name,
      description: req.body.description,
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
      data: channel,
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
