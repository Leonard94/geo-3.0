import { Column } from "./store/types";

export enum EntityType {
  OBJECTS = "objects",
  INCIDENTS = "incidents",
  EMPLOYEES = "employees",
  OBJECT_TYPES = "objectTypes",
  INCIDENT_TYPES = "incidentTypes",
  RAB = "rab",
}

export const ENTITY_TYPE_RU: { [key in EntityType]: string } = {
  [EntityType.OBJECTS]: "Объекты",
  [EntityType.INCIDENTS]: "Инциденты",
  [EntityType.EMPLOYEES]: "Сотрудники",
  [EntityType.OBJECT_TYPES]: "Типы объектов",
  [EntityType.INCIDENT_TYPES]: "Типы инцидентов",
  [EntityType.RAB]: "РЭБ",
};

export const LINKED_OBJECT_ID = "linkedObject";

//! Если нужен новый столбик добавить сюда
export const TABLE_COLUMNS: Record<EntityType, Column[]> = {
  [EntityType.OBJECTS]: [
    {
      id: "name",
      label: "Название",
      inputType: "text",
    },
    {
      id: "description",
      label: "Описание",
      inputType: "text",
    },
    {
      id: "latitude",
      label: "Широта (lat)",
      inputType: "text",
    },
    {
      id: "longitude",
      label: "Долгота (lon)",
      inputType: "text",
    },
    {
      id: "type",
      label: "Тип",
      inputType: "select",
      options: [],
    },
    {
      id: "active",
      label: "Актуально",
      inputType: "toggle",
      format: (value: string) => {
        if (typeof value === "string") {
          return value === "true" ? "Да" : "Нет";
        }
        return value ? "Да" : "Нет";
      },
    },
    {
      id: "isExternalObject",
      label: "Чужой объект",
      inputType: "toggle",
      format: (value: string) => {
        if (typeof value === "string") {
          return value === "true" ? "Да" : "Нет";
        }
        return value ? "Да" : "Нет";
      },
    },
  ],
  [EntityType.INCIDENTS]: [
    {
      id: "title",
      label: "Заголовок",
      inputType: "text",
    },
    {
      id: "severity",
      label: "Уровень угрозы",
      inputType: "select",
      options: [
        { value: "Низкий", label: "Низкий" },
        { value: "Средний", label: "Средний" },
        { value: "Высокий", label: "Высокий" },
      ],
    },
    {
      id: "timestamp",
      label: "Время инцидента",
      inputType: "datetime",
    },
    {
      id: "distance",
      label: "Дистанция (м)",
      inputType: "text",
    },
    {
      id: "speed",
      label: "Скорость (км/ч)",
      inputType: "text",
    },
    {
      id: "type",
      label: "Тип",
      inputType: "select",
      options: [],
    },
    {
      id: "coordinates",
      label: "Координаты",
      inputType: "coordinates",
      format: (value: string) => {
        if (!value) {
          return "—";
        }

        try {
          const coordinates = JSON.parse(value);
          if (!Array.isArray(coordinates) || coordinates.length === 0) {
            return "—";
          }

          return (
            coordinates
              .map((coord: { latitude: string; longitude: string }) =>
                coord.latitude && coord.longitude
                  ? `${coord.latitude}, ${coord.longitude}`
                  : null
              )
              .filter(Boolean)
              .join("\n") || "—"
          );
        } catch (e) {
          return "—";
        }
      },
    },
  ],
  [EntityType.EMPLOYEES]: [
    {
      id: "fullName",
      label: "ФИО",
      inputType: "text",
    },
    {
      id: "position",
      label: "Должность",
      inputType: "text",
    },
    {
      id: "phone",
      label: "Телефон",
      inputType: "text",
    },
    {
      id: LINKED_OBJECT_ID,
      label: "Объект",
      inputType: "select",
      options: [],
    },
  ],
  [EntityType.OBJECT_TYPES]: [
    {
      id: "identifier",
      label: "Идентификатор",
      inputType: "text",
    },
    {
      id: "name",
      label: "Название",
      inputType: "text",
    },
    {
      id: "color",
      label: "Цвет",
      inputType: "color",
    },
  ],

  [EntityType.INCIDENT_TYPES]: [
    {
      id: "identifier",
      label: "Идентификатор",
      inputType: "text",
    },
    {
      id: "name",
      label: "Название",
      inputType: "text",
    },
    {
      id: "color",
      label: "Цвет",
      inputType: "color",
    },
  ],

  [EntityType.RAB]: [
    {
      id: "name",
      label: "Название",
      inputType: "text",
    },
    {
      id: "type",
      label: "Тип",
      inputType: "select",
      options: [
        { value: "подавитель", label: "Подавитель" },
        { value: "обнаружитель", label: "Обнаружитель" },
      ],
    },
    {
      id: "active",
      label: "Активно",
      inputType: "toggle",
      format: (value: string) => {
        if (typeof value === "string") {
          return value === "true" ? "Да" : "Нет";
        }
        return value ? "Да" : "Нет";
      },
    },
    {
      id: "latitude",
      label: "Широта (lat)",
      inputType: "text",
    },
    {
      id: "longitude",
      label: "Долгота (lon)",
      inputType: "text",
    },
    {
      id: "altitude",
      label: "Высота над уровнем моря (м)",
      inputType: "text",
    },
    {
      id: "color",
      label: "Цвет",
      inputType: "color",
    },
  ],
};

//! Если нужны особые правила валидации - вставить сюда
export const FIELD_VALIDATIONS: Record<
  string,
  (value: string) => string | null
> = {
  altitude: (value: string) => {
    if (!value.trim()) {
      return null;
    }
    return null;
  },

  latitude: (value: string) => {
    const num = Number(value);
    if (isNaN(num) || num < -90 || num > 90) {
      return "Широта должна быть числом от -90 до 90";
    }
    return null;
  },

  longitude: (value: string) => {
    const num = Number(value);
    if (isNaN(num) || num < -180 || num > 180) {
      return "Долгота должна быть числом от -180 до 180";
    }
    return null;
  },

  coordinates: (value: string) => {
    if (!value || value.trim() === "") {
      return null;
    }

    try {
      const coords = JSON.parse(value);

      if (!Array.isArray(coords) || coords.length === 0) {
        return null;
      }

      for (const coord of coords) {
        if (!coord.latitude && !coord.longitude) {
          continue;
        }

        const lat = Number(coord.latitude);
        const lng = Number(coord.longitude);

        if (
          (coord.latitude || coord.longitude) &&
          (!coord.latitude || !coord.longitude)
        ) {
          return coord.latitude
            ? "Необходимо указать долготу"
            : "Необходимо указать широту";
        }

        if (isNaN(lat) || lat < -90 || lat > 90) {
          return "Широта должна быть числом от -90 до 90";
        }
        if (isNaN(lng) || lng < -180 || lng > 180) {
          return "Долгота должна быть числом от -180 до 180";
        }
      }
      return null;
    } catch (e) {
      return value ? "Неверный формат координат" : null;
    }
  },
  default: (value: string) => {
    if (!value.trim()) {
      return "Поле обязательно для заполнения";
    }
    return null;
  },
};
