import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/db1";
import { testAntennasConnection } from "./config/db2";
import channelRouter from "./routes/channel";
import messageRouter from "./routes/message";
import rabRouter from "./routes/rab";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());

const PORT: number = parseInt(process.env.PORT || "4000", 10);

testConnection().catch((err) => {
  console.error("Не удалось подключиться к БД1:", err);
  process.exit(1);
});

testAntennasConnection().catch((err) => {
  console.error("Не удалось подключиться к БД2:", err);
  process.exit(1);
});

app.use("/api/channels", channelRouter);
app.use("/api/messages", messageRouter);
app.use("/api/rab", rabRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("API для Geo");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
