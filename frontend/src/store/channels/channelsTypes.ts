export interface IChannel {
  id: string;
  name: string;
  url: string;
}

export interface IChannelsState {
  items: IChannel[];
  loading: boolean;
  error: string | null;
}
