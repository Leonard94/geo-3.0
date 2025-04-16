import { createSlice } from "@reduxjs/toolkit";
import { TEmployeesState } from "./employeeTypes";
import {
  addEmployee,
  clearAllEmployees,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from "./employeesActions";

const initialState: TEmployeesState = {
  items: [],
  loading: false,
  error: null,
};

export const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchEmployees.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(addEmployee.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(clearAllEmployees.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export const {} = employeesSlice.actions;
export default employeesSlice.reducer;
