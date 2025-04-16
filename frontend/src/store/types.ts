export interface IBaseState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export interface DataItem {
  id: string;
  [key: string]: any;
}

export type TInputType =
  | "text"
  | "select"
  | "number"
  | "datetime"
  | "coordinates"
  | "color"
  | "toggle";

export interface Column {
  id: string;
  label: string;
  width?: number;
  inputType?: TInputType;
  options?: Array<{
    value: string | number;
    label: string;
  }>;
  align?: "left" | "center" | "right";
  format?: (value: any) => string | number;
  isServiceColumn?: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

export type FormData = {
  [K in keyof Omit<DataItem, "id">]: string;
};

export type EntityData = {
  id: string;
  [key: string]: string | number;
};
