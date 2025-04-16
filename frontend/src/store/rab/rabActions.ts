import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbUtils } from "../../db/config";
import { EntityType } from "../../DATA";
import { EntityData } from "../types";
import { API_URL } from "../channels/channelsActions";
import { safeColorConversion } from "../../utils/colors.utils";

export const fetchRab = createAsyncThunk("rab/fetchAll", async () => {
  return await dbUtils.getAllItems(EntityType.RAB);
});

export const addRab = createAsyncThunk("rab/add", async (type: EntityData) => {
  await dbUtils.addItem(EntityType.RAB, type);
  return type;
});

export const updateRab = createAsyncThunk(
  "rab/update",
  async (type: EntityData) => {
    await dbUtils.updateItem(EntityType.RAB, type);
    return type;
  }
);

export const deleteRab = createAsyncThunk("rab/delete", async (id: string) => {
  await dbUtils.deleteItem(EntityType.RAB, id);
  return id;
});

export const clearAllRab = createAsyncThunk(
  "employee/clearAllrab",
  async () => {
    const items = await dbUtils.getAllItems(EntityType.RAB);

    for (const item of items) {
      await dbUtils.deleteItem(EntityType.RAB, item.id);
    }

    return [];
  }
);

export const fetchRabFromServer = createAsyncThunk(
  "rab/fetchFromServer",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${API_URL}/rab`);

      if (!response.ok) {
        throw new Error("Не удалось получить данные с сервера");
      }

      const responseData = await response.json();

      if (!responseData.data || !Array.isArray(responseData.data)) {
        throw new Error("Неверный формат данных");
      }

      const stats = {
        added: 0,
        updated: 0,
      };

      const existingItems = await dbUtils.getAllItems(EntityType.RAB);
      const existingItemsMap = new Map(
        existingItems.map((item) => [item.id, item])
      );

      for (const serverItem of responseData.data) {
        const existingItem = existingItemsMap.get(serverItem.id);

        const rabItem = {
          id: serverItem.id,
          name: serverItem.name || "",
          type: serverItem.type || "подавитель",
          active: serverItem.active === true ? "true" : "false",
          latitude: String(serverItem.latitude || "0"),
          longitude: String(serverItem.longitude || "0"),
          altitude: String(serverItem.altitude || "0"),
          rayDefinitions: JSON.stringify(serverItem.rayDefinitions || []),
          color: existingItem
            ? existingItem.color
            : safeColorConversion(serverItem.color),
        };

        if (existingItem) {
          await dbUtils.updateItem(EntityType.RAB, rabItem);
          console.log(`Обновлена запись с ID: ${rabItem.id}`);
          stats.updated += 1;
        } else {
          await dbUtils.addItem(EntityType.RAB, rabItem);
          console.log(`Добавлена новая запись с ID: ${rabItem.id}`);
          stats.added += 1;
        }
      }

      dispatch(fetchRab());

      return stats;
    } catch (error) {
      console.error("Ошибка при запросе данных РЭБ:", error);
      return rejectWithValue((error as Error).message);
    }
  }
);
