import { createSlice } from "@reduxjs/toolkit";
import { TIncidentsState } from "./incidentsTypes";
import {
  addIncident,
  clearAllIncidents,
  deleteIncident,
  fetchIncidents,
  updateIncident,
} from "./incidentsActions";

const initialState: TIncidentsState = {
  items: [],
  loading: false,
  error: null,
};

export const incidentsSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIncidents.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchIncidents.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchIncidents.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(addIncident.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateIncident.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    builder.addCase(deleteIncident.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(clearAllIncidents.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export const {} = incidentsSlice.actions;
export default incidentsSlice.reducer;
