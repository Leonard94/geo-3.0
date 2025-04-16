import { Request, Response } from "express";
import Message from "../models/messages";

export const getRecentMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const messages = await Message.getRecentMessages();
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Ошибка в контроллере getRecentMessages:", error);
    res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
};
