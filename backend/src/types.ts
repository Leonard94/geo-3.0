export interface IChannel {
  id?: number;
  name: string;
  url?: string;
  isActive?: number;
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

export interface IClient {
  id?: number;
  ip_v4: string;
  title?: string;
  gnss_latitude?: number;
  gnss_longitude?: number;
  gnss_course?: number;
  time?: Date;
}

export interface IAntenna {
  id?: number;
  client_id: number;
  port_id: number;
  port_name?: string;
  enabled?: number;
  title?: string;
  ant_type?: number;
  ant_range?: number;
  freq_min?: number;
  freq_max?: number;
  angle_start?: number;
  angle_span?: number;
  time?: Date;
}
