import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbUtils } from "../../db/config";
import { EntityType } from "../../DATA";
import { EntityData } from "../types";

export const fetchCustomIncidentTypes = createAsyncThunk(
  "customIncidentTypes/fetchAll",
  async () => {
    return await dbUtils.getAllItems(EntityType.INCIDENT_TYPES);
  }
);

export const addCustomIncidentType = createAsyncThunk(
  "customIncidentTypes/add",
  async (type: EntityData) => {
    await dbUtils.addItem(EntityType.INCIDENT_TYPES, type);
    return type;
  }
);

export const updateCustomIncidentType = createAsyncThunk(
  "customIncidentTypes/update",
  async (type: EntityData) => {
    await dbUtils.updateItem(EntityType.INCIDENT_TYPES, type);
    return type;
  }
);

export const deleteCustomIncidentType = createAsyncThunk(
  "customIncidentTypes/delete",
  async (id: string) => {
    await dbUtils.deleteItem(EntityType.INCIDENT_TYPES, id);
    return id;
  }
);

export const clearAllCustomIncidentTypes = createAsyncThunk(
  "employee/clearAllCustomIncidentTypes",
  async () => {
    const items = await dbUtils.getAllItems(EntityType.INCIDENT_TYPES);

    for (const item of items) {
      await dbUtils.deleteItem(EntityType.INCIDENT_TYPES, item.id);
    }

    return [];
  }
);
