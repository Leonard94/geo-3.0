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
    return "Имя канала обязательно для заполнения";
  }

  let channelName = url;
  if (url.startsWith("t.me/")) {
    channelName = url.substring(5);
  }

  if (channelName.length < 5) {
    return "Имя канала должно содержать минимум 5 символов";
  }

  const telegramChannelRegex = /^[a-zA-Z0-9_\-\+\.]+$/;

  if (!telegramChannelRegex.test(channelName)) {
    return "Некорректный формат имени канала. Используйте только буквы, цифры и символ подчеркивания";
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
