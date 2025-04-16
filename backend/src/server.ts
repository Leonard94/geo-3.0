import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db";
import channelRouter from "./routes/channel";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

const PORT: number = parseInt(process.env.PORT || "4000", 10);

testConnection().catch((err) => {
  console.error("Не удалось подключиться к базе данных:", err);
  process.exit(1);
});

app.use("/api/channels", channelRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("API для работы с каналами");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
