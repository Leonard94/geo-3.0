import { createSlice } from "@reduxjs/toolkit";
import { TObjectsInitialState } from "./objectsTypes";
import {
  addObject,
  clearAllObjects,
  deleteObject,
  fetchObjects,
  updateObject,
} from "./objectsActions";

const initialState: TObjectsInitialState = {
  items: [],
  loading: false,
  error: null,
};

export const objectsSlice = createSlice({
  name: "objects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchObjects.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchObjects.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchObjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(addObject.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateObject.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    builder.addCase(deleteObject.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(clearAllObjects.fulfilled, (state) => {
      state.items = []
    });
  },
});

export const {} = objectsSlice.actions;
export default objectsSlice.reducer;
