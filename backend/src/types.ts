export interface IChannel {
  id?: number;
  name: string;
  url?: string;
  num_of_messages_downloaded?: number;
  language?: string;
  region?: string;
}

export interface IApiResponse {
  success: boolean;
  count?: number;
  data: any;
  error?: string;
}

export interface IMessage {
  id: number;
  message: string;
  message_sending_time_bot: Date;
}
