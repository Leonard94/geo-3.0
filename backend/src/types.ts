export interface IChannel {
  id?: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IApiResponse {
  success: boolean;
  count?: number;
  data: any;
  error?: string;
}
