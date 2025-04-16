import { createAsyncThunk } from "@reduxjs/toolkit";
import { dbUtils } from "../../db/config";
import { EntityType } from "../../DATA";
import { EntityData } from "../types";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async () => {
    return await dbUtils.getAllItems(EntityType.EMPLOYEES);
  }
);

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (employee: EntityData) => {
    await dbUtils.addItem(EntityType.EMPLOYEES, employee);
    return employee;
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async (employee: EntityData) => {
    await dbUtils.updateItem(EntityType.EMPLOYEES, employee);
    return employee;
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id: string) => {
    await dbUtils.deleteItem(EntityType.EMPLOYEES, id);
    return id;
  }
);

export const clearAllEmployees = createAsyncThunk(
  "employee/clearAllEmployees",
  async () => {
    const items = await dbUtils.getAllItems(EntityType.EMPLOYEES);

    for (const item of items) {
      await dbUtils.deleteItem(EntityType.EMPLOYEES, item.id);
    }

    return [];
  }
);
