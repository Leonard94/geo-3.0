import { createSlice } from "@reduxjs/toolkit";
import { TRabState } from "./rabTypes";
import {
  addRab,
  clearAllRab,
  deleteRab,
  fetchRab,
  updateRab,
} from "./rabActions";

const initialState: TRabState = {
  items: [],
  loading: false,
  error: null,
};

export const rabSlice = createSlice({
  name: "rab",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRab.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchRab.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchRab.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });

    builder.addCase(addRab.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(updateRab.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    builder.addCase(deleteRab.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    });

    builder.addCase(clearAllRab.fulfilled, (state) => {
      state.items = [];
    });
  },
});

export default rabSlice.reducer;
