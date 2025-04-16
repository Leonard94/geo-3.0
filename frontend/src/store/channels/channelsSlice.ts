import { createSlice } from "@reduxjs/toolkit";
import { IChannelsState } from "./channelsTypes";
import {
  addChannel,
  deleteChannel,
  fetchChannels,
  updateChannel,
} from "./channelsActions";

const initialState: IChannelsState = {
  items: [],
  loading: false,
  error: null,
};

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Получение всех каналов
    builder.addCase(fetchChannels.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchChannels.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchChannels.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Ошибка при загрузке каналов";
    });

    // Добавление канала
    builder.addCase(addChannel.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addChannel.fulfilled, (state, action) => {
      state.items.push(action.payload);
      state.loading = false;
    });
    builder.addCase(addChannel.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) || "Ошибка при добавлении канала";
    });

    // Обновление канала
    builder.addCase(updateChannel.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateChannel.fulfilled, (state, action) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.loading = false;
    });
    builder.addCase(updateChannel.rejected, (state, action) => {
      state.loading = false;
      state.error =
        (action.payload as string) || "Ошибка при обновлении канала";
    });

    // Удаление канала
    builder.addCase(deleteChannel.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteChannel.fulfilled, (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.loading = false;
    });
    builder.addCase(deleteChannel.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Ошибка при удалении канала";
    });
  },
});

export const { clearError } = channelsSlice.actions;
export default channelsSlice.reducer;
