import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import styles from "./styles.module.scss";
import { Input } from "../../../ui/Input/Input";
import { Column, TInputType } from "../../../../store/types";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CoordinatesField } from "./CoordinatesField";
import { FormControlLabel, Switch } from "@mui/material";
import { hexToRgb, rgbToHex } from "../../../../utils/colors.utils";

export interface CustomCoordinatesChangeEvent {
  target: {
    name: string;
    value: string;
  };
}

interface IProps {
  column: Column;
  value: string;
  onChange: (e: CustomChangeEvent) => void;
  error?: string;
}

export type CustomChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | SelectChangeEvent<string>
  | CustomDateChangeEvent
  | CustomCoordinatesChangeEvent;

export interface CustomDateChangeEvent {
  target: {
    name: string;
    value: string;
  };
  type: "change";
}

export const FormField: React.FC<IProps> = ({
  column,
  value,
  onChange,
  error,
}) => {
  const commonStyles = { marginBottom: "20px" };

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    if (newValue) {
      const dateChangeEvent: CustomDateChangeEvent = {
        target: {
          name: column.id,
          value: newValue.format(),
        },
        type: "change",
      };
      onChange(dateChangeEvent);
    }
  };

  if (!column.inputType) {
    return (
      <div className={styles.fieldContainer}>
        <Input
          fullWidth
          type="text"
          name={column.id}
          value={value}
          placeholder={column.label}
          onChange={onChange}
          label={column.label}
          error={error}
          style={commonStyles}
        />
      </div>
    );
  }

  switch (column.inputType as TInputType) {
    case "datetime":
      return (
        <div className={styles.fieldContainer}>
          <label className={styles.label}>{column.label}</label>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DateTimePicker
              value={value ? dayjs(value) : null}
              onChange={handleDateChange}
              format="DD.MM.YYYY HH:mm"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!error,
                  style: commonStyles,
                },
              }}
            />
          </LocalizationProvider>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      );

    case "toggle":
      return (
        <div className={styles.fieldContainer}>
          <FormControlLabel
            control={
              <Switch
                name={column.id}
                checked={value === "true"}
                onChange={(e) => {
                  onChange({
                    target: {
                      name: column.id,
                      value: String(e.target.checked),
                    },
                  } as any);
                }}
              />
            }
            label={column.label}
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>
      );

    case "color":
      return (
        <div className={styles.fieldContainer}>
          <Input
            fullWidth
            type="color"
            name={column.id}
            value={rgbToHex(value || "rgb(0, 0, 0)")}
            onChange={(e) => {
              const hexColor = e.target.value;
              const rgb = hexToRgb(hexColor);
              onChange({
                target: {
                  name: column.id,
                  value: rgb,
                },
              } as any);
            }}
            label={column.label}
            error={error}
            style={commonStyles}
          />
          {error && <span className={styles.error}>{error}</span>}
        </div>
      );

    case "coordinates":
      return (
        <div className={styles.fieldContainer}>
          <label className={styles.label}>{column.label}</label>
          <CoordinatesField
            coordinates={
              value ? JSON.parse(value) : [{ latitude: "", longitude: "" }]
            }
            onChange={(coords) => {
              onChange({
                target: {
                  name: column.id,
                  value: JSON.stringify(coords),
                },
              } as any);
            }}
            errors={error ? { error } : undefined}
          />
        </div>
      );

    case "select":
      return (
        <div className={styles.fieldContainer}>
          <label className={styles.label}>{column.label}</label>
          <Select
            fullWidth
            name={column.id}
            value={value || ""}
            onChange={onChange}
            error={!!error}
            style={commonStyles}
          >
            {column.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      );
    default:
      return (
        <div className={styles.fieldContainer}>
          <Input
            fullWidth
            type="text"
            name={column.id}
            value={value}
            placeholder={column.label}
            onChange={onChange}
            label={column.label}
            error={error}
            style={commonStyles}
          />
        </div>
      );
  }
};
