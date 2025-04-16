export interface IChannel {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
}

export interface IChannelsState {
  items: IChannel[];
  loading: boolean;
  error: string | null;
}
