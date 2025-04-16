import * as XLSX from "exceljs";
import { EntityType } from "../../DATA";
import { EntityData } from "../../store/types";
import { dbUtils } from "../../db/config";
import { safeColorConversion } from "../../utils/colors.utils";
import { nanoid } from "nanoid";

export const processExcelFile = async (file: File, entityType: EntityType) => {
  switch (entityType) {
    case EntityType.OBJECTS:
      return processObjectsData(file);
    case EntityType.EMPLOYEES:
      return processEmployeesData(file);
    case EntityType.INCIDENTS:
      return processIncidentsData(file);
    case EntityType.RAB:
      return processRabData(file);
    default:
      throw new Error("Неизвестный тип сущности");
  }
};

export const processObjectsData = async (file: File) => {
  const workbook = new XLSX.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const worksheet = workbook.getWorksheet(1);

  if (!worksheet) {
    throw new Error("Лист не найден в файле Excel");
  }

  const data: EntityData[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const item: EntityData = {
      id: row.getCell(1).value?.toString() || "",
      name: row.getCell(2).value?.toString() || "",
      description: row.getCell(3).value?.toString() || "",
      type: row.getCell(4).value?.toString() || "",
      latitude: row.getCell(5).value?.toString() || "",
      longitude: row.getCell(6).value?.toString() || "",
      active: row.getCell(7).value === 1 ? "true" : "false",
      isExternalObject: "false",
    };

    data.push(item);
  });

  try {
    await Promise.all(
      data.map((item) => dbUtils.addItem(EntityType.OBJECTS, item))
    );
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    throw new Error(`Ошибка при сохранении данных в базу данных: ${error}`);
  }

  return data;
};

export const processEmployeesData = async (file: File) => {
  const workbook = new XLSX.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const worksheet = workbook.getWorksheet(1);

  if (!worksheet) {
    throw new Error("Лист не найден в файле Excel");
  }

  const data: EntityData[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const item: EntityData = {
      id: row.getCell(1).value?.toString() || "",
      fullName: row.getCell(2).value?.toString() || "",
      position: row.getCell(3).value?.toString() || "",
      phone:
        (row.getCell(4).value as any)?.result ||
        row.getCell(4).value?.toString() ||
        "",
      email: row.getCell(5).value?.toString() || "",
      linkedObject: row.getCell(6).value?.toString() || "",
    };

    data.push(item);
  });

  try {
    await Promise.all(
      data.map((item) => dbUtils.addItem(EntityType.EMPLOYEES, item))
    );
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    throw new Error(`Ошибка при сохранении данных в базу данных: ${error}`);
  }

  return data;
};

export const processIncidentsData = async (file: File) => {
  const workbook = new XLSX.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error("Лист не найден в файле Excel");
  }

  const data: EntityData[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    const coords1 = row.getCell(8).value?.toString() || "";
    const coords2 = row.getCell(9).value?.toString() || "";

    const coordinates = [coords1, coords2]
      .filter((coord) => coord)
      .map((coord) => {
        const [latitude, longitude] = coord.split(",").map((c) => c.trim());
        return {
          latitude,
          longitude,
        };
      });

    const item: EntityData = {
      id: row.getCell(1).value?.toString() || nanoid(),
      title: row.getCell(2).value?.toString() || "",
      severity: row.getCell(3).value?.toString() || "",
      timestamp: row.getCell(4).value?.toString() || "",
      distance: row.getCell(5).value?.toString() || "",
      speed: row.getCell(6).value?.toString() || "",
      type: row.getCell(7).value?.toString() || "",
      coordinates: JSON.stringify(coordinates),
    };

    data.push(item);
  });

  try {
    await Promise.all(
      data.map((item) => dbUtils.addItem(EntityType.INCIDENTS, item))
    );
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    throw new Error(`Ошибка при сохранении данных в базу данных: ${error}`);
  }

  return data;
};

export const processRabData = async (file: File) => {
  const workbook = new XLSX.Workbook();
  await workbook.xlsx.load(await file.arrayBuffer());

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error("Лист не найден в файле Excel");
  }

  const data: EntityData[] = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    let rayDefsValue = "[]";
    try {
      const cellValue = row.getCell(9).value;
      if (cellValue !== null && cellValue !== undefined && cellValue !== "") {
        rayDefsValue = cellValue.toString();
      }
    } catch (e) {
      console.warn("Не удалось прочитать значение лучей:", e);
    }

    const item: EntityData = {
      id: row.getCell(1).value?.toString() || nanoid(),
      name: row.getCell(2).value?.toString() || "",
      type: row.getCell(3).value?.toString() || "подавитель",
      active:
        row.getCell(4).value === 1 ||
        row.getCell(4).value === "1" ||
        row.getCell(4).value === "true" ||
        row.getCell(4).value === true
          ? "true"
          : "false",
      latitude: row.getCell(5).value?.toString() || "",
      longitude: row.getCell(6).value?.toString() || "",
      color: safeColorConversion(row.getCell(7).value?.toString()),
      altitude: row.getCell(8).value?.toString() || "0",

      rayDefinitions: rayDefsValue,
    };

    data.push(item);
  });

  try {
    await Promise.all(
      data.map((item) => dbUtils.addItem(EntityType.RAB, item))
    );
  } catch (error) {
    console.error("Ошибка при сохранении данных РЭБ:", error);
    throw new Error(`Ошибка при сохранении данных в базу данных: ${error}`);
  }

  return data;
};
