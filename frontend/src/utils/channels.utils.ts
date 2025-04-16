import { IChannel } from "../store/channels/channelsTypes";

export interface IChannelValidationErrors {
  name?: string;
  url?: string;
}

export const validateChannelName = (name: string): string | null => {
  if (!name.trim()) {
    return "Название канала обязательно для заполнения";
  }

  if (name.trim().length < 2) {
    return "Название канала должно содержать минимум 2 символа";
  }

  if (name.trim().length > 100) {
    return "Название канала не должно превышать 100 символов";
  }

  return null;
};

export const validateChannelUrl = (url: string): string | null => {
  if (!url.trim()) {
    return "URL канала обязателен для заполнения";
  }

  if (url.startsWith("t.me/") && url.length < 10) {
    return "Неполный URL канала Telegram";
  }

  return null;
};

export const validateChannel = (
  channelData: Omit<IChannel, "id"> & { id?: string }
): IChannelValidationErrors => {
  const errors: IChannelValidationErrors = {};

  const nameError = validateChannelName(channelData.name);
  if (nameError) {
    errors.name = nameError;
  }

  const urlError = validateChannelUrl(channelData.url);
  if (urlError) {
    errors.url = urlError;
  }

  return errors;
};

export const isValid = (errors: IChannelValidationErrors): boolean => {
  return Object.keys(errors).length === 0;
};
