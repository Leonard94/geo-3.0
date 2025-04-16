import { createSlice } from "@reduxjs/toolkit";
import { TCustomIncidentTypesState } from "./customIncidentsTypesTypes";
import {
  addCustomIncidentType,
  clearAllCustomIncidentTypes,
  deleteCustomIncidentType,
  fetchCustomIncidentTypes,
  updateCustomIncidentType,
} from "./customIncidentsTypesActions";

const initialState: TCustomIncidentTypesState = {
  items: [],
  loading: false,
  error: null,
};

export const customIncidentTypesSlice = createSlice({
  name: "customIncidentTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomIncidentTypes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCustomIncidentTypes.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCustomIncidentTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(addCustomIncidentType.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateCustomIncidentType.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    builder.addCase(deleteCustomIncidentType.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(clearAllCustomIncidentTypes.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export default customIncidentTypesSlice.reducer;
