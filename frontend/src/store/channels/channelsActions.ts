import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IChannel } from "./channelsTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
const API_ROUT = "channels";

export const fetchChannels = createAsyncThunk(
  "channels/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${API_ROUT}`);
      const normalizedData = response.data.data.map((channel: IChannel) => ({
        ...channel,
        url: channel.url.replace("https://", ""),
      }));
      return Array.isArray(normalizedData)
        ? normalizedData
        : ([] as IChannel[]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Неизвестная ошибка при загрузке каналов");
    }
  }
);

export const addChannel = createAsyncThunk(
  "channels/add",
  async (channel: Omit<IChannel, "id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/${API_ROUT}`, channel);
      return response.data as IChannel;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Неизвестная ошибка при добавлении канала");
    }
  }
);

export const updateChannel = createAsyncThunk(
  "channels/update",
  async (channel: IChannel, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/${API_ROUT}/${channel.id}`,
        channel
      );
      return response.data as IChannel;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Неизвестная ошибка при обновлении канала");
    }
  }
);

export const deleteChannel = createAsyncThunk(
  "channels/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${API_ROUT}/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Неизвестная ошибка при удалении канала");
    }
  }
);
