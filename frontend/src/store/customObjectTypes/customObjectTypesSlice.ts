import { createSlice } from "@reduxjs/toolkit";
import { TCustomObjectTypesState } from "./customObjectTypesTypes";
import {
  addCustomObjectType,
  clearAllCustomObjectTypes,
  deleteCustomObjectType,
  fetchCustomObjectTypes,
  updateCustomObjectType,
} from "./customObjectTypesActions";

const initialState: TCustomObjectTypesState = {
  items: [],
  loading: false,
  error: null,
};

export const customObjectTypesSlice = createSlice({
  name: "customObjectTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCustomObjectTypes.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCustomObjectTypes.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchCustomObjectTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(addCustomObjectType.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateCustomObjectType.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    builder.addCase(deleteCustomObjectType.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(clearAllCustomObjectTypes.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export default customObjectTypesSlice.reducer;
