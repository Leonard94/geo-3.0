import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { EntityType } from "../../DATA";
import styles from "./styles.module.scss";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

interface IProps {
  entityType: EntityType;
  items: any[];
}

const getFormattedDate = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}.${minutes}`;
};

const exportRabData = async (rabItems: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("РЭБ");

  worksheet.columns = [
    { header: "Id", key: "id", width: 40 },
    { header: "Имя", key: "name", width: 30 },
    { header: "Тип", key: "type", width: 20 },
    { header: "Активно", key: "active", width: 15 },
    { header: "lat", key: "latitude", width: 20 },
    { header: "lon", key: "longitude", width: 20 },
    { header: "Цвет", key: "color", width: 20 },
    { header: "Высота", key: "altitude", width: 20 },
    { header: "Лучи", key: "rayDefinitions", width: 60 },
  ];

  rabItems.forEach((item) => {
    const rowData = {
      id: item.id,
      name: item.name,
      type: item.type,
      active: item.active === "true" ? 1 : 0,
      latitude: item.latitude,
      longitude: item.longitude,
      color: item.color,
      altitude: item.altitude || "0",
      rayDefinitions: item.rayDefinitions || "[]",
    };

    worksheet.addRow(rowData);
  });

  worksheet.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `РЭБ_${getFormattedDate()}.xlsx`;

  saveAs(blob, fileName);

  return true;
};

export const ExcelDownloader: React.FC<IProps> = ({ entityType, items }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      if (entityType === EntityType.RAB) {
        await exportRabData(items);
      } else {
        console.log("Пока не реализована выгрузка для типа", entityType);
      }
    } catch (error) {
      console.error("Ошибка при выгрузке данных:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (entityType !== EntityType.RAB) {
    return null;
  }

  return (
    <div
      className={styles.downloader}
      onClick={!isLoading ? handleDownload : undefined}
      style={{ cursor: isLoading ? "default" : "pointer" }}
    >
      {isLoading ? <CircularProgress size={24} /> : <SaveIcon />}
    </div>
  );
};
