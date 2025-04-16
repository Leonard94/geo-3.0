import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbUtils } from "../../db/config";
import { EntityType } from "../../DATA";
import { EntityData } from "../types";

export const fetchCustomObjectTypes = createAsyncThunk(
  "customObjectTypes/fetchAll",
  async () => {
    return await dbUtils.getAllItems(EntityType.OBJECT_TYPES);
  }
);

export const addCustomObjectType = createAsyncThunk(
  "customObjectTypes/add",
  async (type: EntityData) => {
    await dbUtils.addItem(EntityType.OBJECT_TYPES, type);
    return type;
  }
);

export const updateCustomObjectType = createAsyncThunk(
  "customObjectTypes/update",
  async (type: EntityData) => {
    await dbUtils.updateItem(EntityType.OBJECT_TYPES, type);
    return type;
  }
);

export const deleteCustomObjectType = createAsyncThunk(
  "customObjectTypes/delete",
  async (id: string) => {
    await dbUtils.deleteItem(EntityType.OBJECT_TYPES, id);
    return id;
  }
);

export const clearAllCustomObjectTypes = createAsyncThunk(
  "employee/clearAllCustomObjectTypes",
  async () => {
    const items = await dbUtils.getAllItems(EntityType.OBJECT_TYPES);

    for (const item of items) {
      await dbUtils.deleteItem(EntityType.OBJECT_TYPES, item.id);
    }

    return [];
  }
);