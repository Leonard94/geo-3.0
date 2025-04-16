import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbUtils } from "../../db/config";
import { EntityType } from "../../DATA";
import { EntityData } from "../types";

export const fetchRab = createAsyncThunk(
  "rab/fetchAll",
  async () => {
    return await dbUtils.getAllItems(EntityType.RAB);
  }
);

export const addRab = createAsyncThunk(
  "rab/add",
  async (type: EntityData) => {
    await dbUtils.addItem(EntityType.RAB, type);
    return type;
  }
);

export const updateRab = createAsyncThunk(
  "rab/update",
  async (type: EntityData) => {
    await dbUtils.updateItem(EntityType.RAB, type);
    return type;
  }
);

export const deleteRab = createAsyncThunk(
  "rab/delete",
  async (id: string) => {
    await dbUtils.deleteItem(EntityType.RAB, id);
    return id;
  }
);

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
