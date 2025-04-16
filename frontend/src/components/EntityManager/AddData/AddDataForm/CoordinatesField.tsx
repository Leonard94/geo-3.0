import React from "react";
import { Input } from "../../../ui/Input/Input";
import styles from "./styles.module.scss";
import { AddOneMore } from "../../../../assets/icons/AddOneMore";
import { RemoveIcon } from "../../../../assets/icons/RemoveIcon";

interface Coordinate {
  latitude: string;
  longitude: string;
}

interface IProps {
  coordinates: Coordinate[];
  onChange: (coordinates: Coordinate[]) => void;
  errors?: { error: string } | string;
}

export const CoordinatesField: React.FC<IProps> = ({
  coordinates,
  onChange,
  errors,
}) => {
  const handleCoordinateChange = (
    index: number,
    field: keyof Coordinate,
    value: string
  ) => {
    const newCoordinates = [...coordinates];
    newCoordinates[index] = {
      ...newCoordinates[index],
      [field]: value,
    };
    onChange(newCoordinates);
  };

  const handleAddCoordinate = () => {
    onChange([...coordinates, { latitude: "", longitude: "" }]);
  };

  const handleRemoveCoordinate = (index: number) => {
    const newCoordinates = coordinates.filter((_, i) => i !== index);
    onChange(newCoordinates);
  };

  const errorMessage = typeof errors === "string" ? errors : errors?.error;

  return (
    <div className={styles.coordinatesContainer}>
      {coordinates.map((coordinate, index) => (
        <div key={index} className={styles.coordinateRow}>
          <div className={styles.coordinateFields}>
            <Input
              fullWidth
              type="text"
              name={`latitude-${index}`}
              value={coordinate.latitude}
              onChange={(e) =>
                handleCoordinateChange(index, "latitude", e.target.value)
              }
              label="Широта (lat)"
              placeholder="Широта"
              error={errorMessage}
              style={{ marginBottom: "20px" }}
            />
            <Input
              fullWidth
              type="text"
              name={`longitude-${index}`}
              value={coordinate.longitude}
              onChange={(e) =>
                handleCoordinateChange(index, "longitude", e.target.value)
              }
              label="Долгота (lon)"
              placeholder="Долгота"
              error={errorMessage}
              style={{ marginBottom: "20px" }}
            />
            {coordinates.length > 1 && (
              <div
                onClick={() => handleRemoveCoordinate(index)}
                className={styles.removeButton}
              >
                <RemoveIcon /> Удалить
              </div>
            )}
          </div>
        </div>
      ))}

      <div onClick={handleAddCoordinate} className={styles.addButton}>
        <AddOneMore /> Добавить еще координаты
      </div>
    </div>
  );
};
