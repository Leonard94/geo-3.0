import styles from "./styles.module.scss";
import {
  CustomCoordinatesChangeEvent,
  CustomDateChangeEvent,
  FormField,
} from "./FormField";
import { useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import dayjs from "dayjs";
import { actions } from "../../../EntityManager/EntityManager";
import {
  DataItem,
  FormData,
  FormErrors,
  Column,
} from "../../../../store/types";
import { Modal } from "../../../ui/Modal/Modal";
import { FIELD_VALIDATIONS, LINKED_OBJECT_ID } from "../../../../DATA";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { EntityType } from "../../../../DATA";
import { YMaps, Map, Placemark } from "react-yandex-maps";
import { MAP_SETTINGS } from "../../../../pages/MapPage/CustomMap/mapSettings";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DataItem, "id">) => void;
  initialData?: DataItem | null;
  columns: Column[];
  entityType: EntityType;
}

export const AddDataForm: React.FC<IProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  columns,
  entityType,
}) => {
  const objects = useAppSelector((state) => state.objects.items);
  const objectTypes = useAppSelector((state) => state.objectTypes.items);
  const incidentTypes = useAppSelector((state) => state.incidentTypes.items);
  const [selectedPoints, setSelectedPoints] = useState<[number, number][]>([]);
  const dispatch = useAppDispatch();

  const createEmptyFormData = (cols: Column[]): FormData => {
    return cols.reduce((acc, column) => {
      const isIdForRegularEntity =
        column.id === "id" &&
        entityType !== EntityType.OBJECT_TYPES &&
        entityType !== EntityType.INCIDENT_TYPES;

      if (isIdForRegularEntity) {
        return acc;
      }

      switch (column.inputType) {
        case "datetime":
          acc[column.id] = dayjs().format();
          break;

        case "coordinates":
          acc[column.id] = JSON.stringify([{ latitude: "", longitude: "" }]);
          break;

        case "color":
          acc[column.id] = "rgba(0, 0, 0)";
          break;

        case "toggle":
          if (column.id === "isExternalObject") {
            acc[column.id] = "false";
          } else {
            acc[column.id] = "true";
          }
          break;

        case "number":
          acc[column.id] = "0";
          break;

        case "select":
          acc[column.id] = column.options?.[0]?.value?.toString() || "";
          break;

        default:
          acc[column.id] = "";
      }

      return acc;
    }, {} as FormData);
  };

  const createInitialFormData = (
    data: DataItem | null,
    cols: Column[]
  ): FormData => {
    if (!data) return createEmptyFormData(cols);

    return cols.reduce((acc, column) => {
      if (column.id !== "id") {
        acc[column.id] = data[column.id]?.toString() || "";
      }
      return acc;
    }, {} as FormData);
  };

  const [formData, setFormData] = useState<FormData>(
    createEmptyFormData(columns)
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialData?.coordinates
      ? JSON.parse(initialData.coordinates)[0]
      : initialData?.latitude && initialData?.longitude
      ? [
          parseFloat(initialData.latitude as string),
          parseFloat(initialData.longitude as string),
        ]
      : MAP_SETTINGS.center
  );

  const enhancedColumns = columns.map((column) => {
    if (entityType === EntityType.EMPLOYEES && column.id === LINKED_OBJECT_ID) {
      return {
        ...column,
        options: [
          { value: "", label: "Не выбран" },
          ...objects.map((obj) => ({
            value: obj.id,
            label: String(obj.name),
          })),
        ],
      } as Column;
    }

    if (entityType === EntityType.OBJECTS && column.id === "type") {
      return {
        ...column,
        options: objectTypes.map((type) => ({
          value: type.identifier,
          label: type.name,
        })),
      } as Column;
    }

    if (entityType === EntityType.INCIDENTS && column.id === "type") {
      return {
        ...column,
        options: incidentTypes.map((type) => ({
          value: type.identifier,
          label: type.name,
        })),
      } as Column;
    }

    return column;
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent
      | CustomDateChangeEvent
      | CustomCoordinatesChangeEvent
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    columns.forEach((column) => {
      if (column.id !== "id" && column.id !== LINKED_OBJECT_ID) {
        const validator =
          FIELD_VALIDATIONS[column.id] || FIELD_VALIDATIONS.default;

        const error = validator(formData[column.id]);
        if (error) {
          newErrors[column.id] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const processedData = Object.entries(formData).reduce(
        (acc, [key, value]) => {
          const column = columns.find((col) => col.id === key);
          if (key === LINKED_OBJECT_ID && !value) {
            return acc;
          }
          acc[key] = column?.inputType === "number" ? Number(value) : value;
          return acc;
        },
        {} as Record<string, string | number>
      );

      onSubmit(processedData);
      setFormData(createEmptyFormData(columns));
      onClose();
    }
  };

  const handleMapClick = (e: any) => {
    const coords = e.get("coords");

    if (entityType === EntityType.OBJECTS || entityType === EntityType.RAB) {
      setSelectedPoints([coords]);
      setFormData((prev) => ({
        ...prev,
        latitude: coords[0],
        longitude: coords[1],
      }));
      setMapCenter(coords);
      return;
    }

    if (entityType === EntityType.INCIDENTS && selectedPoints.length < 2) {
      const newPoints = [...selectedPoints, coords];
      setSelectedPoints(newPoints);
      setFormData((prev) => ({
        ...prev,
        coordinates: JSON.stringify(
          newPoints.map((point) => ({
            latitude: point[0],
            longitude: point[1],
          }))
        ),
      }));
      setMapCenter(coords);
    }
    setMapCenter(coords);
  };

  useEffect(() => {
    setSelectedPoints([]);
  }, [formData.type]);

  useEffect(() => {
    setFormData(createInitialFormData(initialData || null, columns));

    let timerId: NodeJS.Timeout;

    if (initialData) {
      if (entityType === EntityType.OBJECTS || entityType === EntityType.RAB) {
        if (initialData.latitude && initialData.longitude) {
          const lat = parseFloat(String(initialData.latitude));
          const lon = parseFloat(String(initialData.longitude));

          if (!isNaN(lat) && !isNaN(lon)) {
            const coords: [number, number] = [lat, lon];

            timerId = setTimeout(() => {
              setSelectedPoints([coords]);
              setMapCenter(coords);
            }, 0);
          }
        }
      } else if (
        entityType === EntityType.INCIDENTS &&
        initialData.coordinates
      ) {
        try {
          const coords = JSON.parse(initialData.coordinates as string);
          if (Array.isArray(coords) && coords.length > 0) {
            const points = coords
              .map((coord: any) => {
                const lat = parseFloat(coord.latitude);
                const lon = parseFloat(coord.longitude);

                if (isNaN(lat) || isNaN(lon)) {
                  return null;
                }
                return [lat, lon];
              })
              .filter(Boolean) as [number, number][];

            timerId = setTimeout(() => {
              setSelectedPoints(points);
              if (points.length > 0) {
                setMapCenter(points[0]);
              }
            }, 0);
          }
        } catch (e) {
          console.error("Ошибка при парсинге координат:", e);
        }
      }
    } else {
      setSelectedPoints([]);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [initialData, columns, entityType]);

  useEffect(() => {
    dispatch(actions[entityType].fetch());

    if (entityType === EntityType.EMPLOYEES) {
      dispatch(actions[EntityType.OBJECTS].fetch());
    }

    if (entityType === EntityType.OBJECTS) {
      dispatch(actions[EntityType.OBJECT_TYPES].fetch());
    }

    if (entityType === EntityType.INCIDENTS) {
      dispatch(actions[EntityType.INCIDENT_TYPES].fetch());
    }
  }, [dispatch, entityType]);

  const shouldShowMap =
    entityType === EntityType.OBJECTS ||
    entityType === EntityType.INCIDENTS ||
    entityType === EntityType.RAB;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formFields}>
            {enhancedColumns.map((column) => {
              if (
                column.id === "id" &&
                entityType !== EntityType.OBJECT_TYPES &&
                entityType !== EntityType.INCIDENT_TYPES
              ) {
                return null;
              }

              return (
                <FormField
                  key={column.id}
                  column={column}
                  value={formData[column.id]}
                  onChange={handleChange}
                  error={errors[column.id]}
                />
              );
            })}

            <div className={styles.btn_row}>
              <button className={styles.btn} type="button" onClick={onClose}>
                Отмена
              </button>
              <button className={styles.btn} type="submit">
                {initialData ? "Сохранить" : "Добавить"}
              </button>
            </div>
          </div>
        </form>
        {shouldShowMap && (
          <div className={styles.mapContainer}>
            <YMaps>
              <Map
                defaultState={{
                  center: MAP_SETTINGS.center,
                  zoom: MAP_SETTINGS.zoom,
                }}
                state={{ center: mapCenter, zoom: 9 }}
                onClick={handleMapClick}
                width="100%"
                height="100%"
              >
                {selectedPoints.map((point, index) => (
                  <Placemark
                    key={index}
                    geometry={point}
                    properties={{
                      hintContent: index === 0 ? "Точка 1" : "Точка 2",
                    }}
                  />
                ))}
              </Map>
            </YMaps>
          </div>
        )}
      </div>
    </Modal>
  );
};
