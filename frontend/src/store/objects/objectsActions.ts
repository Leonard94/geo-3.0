import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbUtils } from "../../db/config";
import { EntityType } from "../../DATA";
import { EntityData } from "../types";

export const fetchObjects = createAsyncThunk("objects/fetchAll", async () => {
  return await dbUtils.getAllItems(EntityType.OBJECTS);
});

export const addObject = createAsyncThunk(
  "objects/add",
  async (object: EntityData) => {
    await dbUtils.addItem(EntityType.OBJECTS, object);
    return object;
  }
);

export const updateObject = createAsyncThunk(
  "objects/update",
  async (object: EntityData) => {
    await dbUtils.updateItem(EntityType.OBJECTS, object);
    return object;
  }
);

export const deleteObject = createAsyncThunk(
  "objects/delete",
  async (id: string) => {
    await dbUtils.deleteItem(EntityType.OBJECTS, id);
    return id;
  }
);

export const clearAllObjects = createAsyncThunk(
  "objects/clearAllObjects",
  async () => {
    const items = await dbUtils.getAllItems(EntityType.OBJECTS);

    for (const item of items) {
      await dbUtils.deleteItem(EntityType.OBJECTS, item.id);
    }

    return [];
  }
);