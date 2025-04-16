import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbUtils } from "../../db/config";
import { EntityType } from "../../DATA";
import { EntityData } from "../types";

export const fetchIncidents = createAsyncThunk(
  "incidents/fetchAll",
  async () => {
    return await dbUtils.getAllItems(EntityType.INCIDENTS);
  }
);

export const addIncident = createAsyncThunk(
  "incidents/add",
  async (incident: EntityData) => {
    await dbUtils.addItem(EntityType.INCIDENTS, incident);
    return incident;
  }
);

export const updateIncident = createAsyncThunk(
  "incidents/update",
  async (incident: EntityData) => {
    await dbUtils.updateItem(EntityType.INCIDENTS, incident);
    return incident;
  }
);

export const deleteIncident = createAsyncThunk(
  "incidents/delete",
  async (id: string) => {
    await dbUtils.deleteItem(EntityType.INCIDENTS, id);
    return id;
  }
);

export const clearAllIncidents = createAsyncThunk(
  "incidents/clearAllIncidents",
  async () => {
    const items = await dbUtils.getAllItems(EntityType.INCIDENTS);

    for (const item of items) {
      await dbUtils.deleteItem(EntityType.INCIDENTS, item.id);
    }

    return [];
  }
);
