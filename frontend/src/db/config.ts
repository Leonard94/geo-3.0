import { DBSchema, IDBPDatabase, openDB } from "idb";
import { EntityType, TABLE_COLUMNS } from "../DATA";
import { Column, EntityData } from "../store/types";

const DB_VERSION = 4;
const DB_NAME = "map-db";

type TableColumns = Record<EntityType, Column[]>;

const typedTableColumns = TABLE_COLUMNS as TableColumns;

interface EntityWithRelations extends EntityData {
  incidents?: string[];
  employees?: string[];
  objects?: string[];
  [key: string]: any;
}

interface MyDB extends DBSchema {
  [EntityType.OBJECTS]: {
    value: EntityWithRelations;
    key: string;
    indexes: {
      name: string;
      description: string;
      latitude: string;
      longitude: string;
      type: string;
      isExternalObject: string;
    };
  };
  [EntityType.INCIDENTS]: {
    value: EntityWithRelations;
    key: string;
    indexes: {
      title: string;
      severity: string;
      type: string;
    };
  };
  [EntityType.EMPLOYEES]: {
    value: EntityWithRelations;
    key: string;
    indexes: {
      fullName: string;
      position: string;
    };
  };
  [EntityType.OBJECT_TYPES]: {
    value: EntityWithRelations;
    key: string;
    indexes: {
      name: string;
      color: string;
    };
  };
  [EntityType.INCIDENT_TYPES]: {
    value: EntityWithRelations;
    key: string;
    indexes: {
      name: string;
      color: string;
    };
  };
  [EntityType.RAB]: {
    value: EntityWithRelations;
    key: string;
    indexes: {
      name: string;
      type: string;
      altitude: string;
      latitude: string;
      longitude: string;
      active: string,
      color: string;
    };
  };
}

function createStoreStructure(columns: Column[]): Partial<EntityWithRelations> {
  return columns.reduce((acc, column) => {
    if (column.id !== "id") {
      switch (column.inputType) {
        case "number":
          acc[column.id] = 0;
          break;
        case "select":
          acc[column.id] = column.options?.[0]?.value || "";
          break;
        case "color":
          acc[column.id] = "rgba(0, 0, 0)";
          break;
        default:
          acc[column.id] = "";
      }
    }
    return acc;
  }, {} as Partial<EntityWithRelations>);
}

export async function initDB(): Promise<IDBPDatabase<MyDB>> {
  const db = await openDB<MyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      [
        EntityType.OBJECTS,
        EntityType.INCIDENTS,
        EntityType.EMPLOYEES,
        EntityType.OBJECT_TYPES,
        EntityType.INCIDENT_TYPES,
        EntityType.RAB,
      ].forEach((entityType: EntityType) => {
        if (!db.objectStoreNames.contains(entityType)) {
          const store = db.createObjectStore(entityType, { keyPath: "id" });

          typedTableColumns[entityType].forEach((column) => {
            if (column.id !== "id") {
              store.createIndex(
                column.id as keyof MyDB[typeof entityType]["indexes"],
                column.id
              );
            }
          });
        }
      });
    },
  });

  return db;
}

export const dbUtils = {
  async getAllItems(storeName: EntityType): Promise<EntityWithRelations[]> {
    const db = await initDB();
    return db.getAll(storeName);
  },

  async addItem(
    storeName: EntityType,
    item: EntityWithRelations
  ): Promise<string> {
    const db = await initDB();
    await db.add(storeName, item);
    return item.id;
  },

  async updateItem(
    storeName: EntityType,
    item: EntityWithRelations
  ): Promise<void> {
    const db = await initDB();
    await db.put(storeName, item);
  },

  async deleteItem(storeName: EntityType, id: string): Promise<void> {
    const db = await initDB();
    await db.delete(storeName, id);
  },

  getEmptyEntityStructure(
    entityType: EntityType
  ): Partial<EntityWithRelations> {
    return {
      id: "",
      ...createStoreStructure(typedTableColumns[entityType]),
    };
  },

  async addRelation(
    sourceStore: EntityType,
    sourceId: string,
    relationKey: string,
    targetId: string
  ): Promise<void> {
    const db = await initDB();
    const item = await db.get(sourceStore, sourceId);

    if (item) {
      const relations = item[relationKey] || [];
      if (!relations.includes(targetId)) {
        item[relationKey] = [...relations, targetId];
        await db.put(sourceStore, item);
      }
    }
  },

  async removeRelation(
    sourceStore: EntityType,
    sourceId: string,
    relationKey: string,
    targetId: string
  ): Promise<void> {
    const db = await initDB();
    const item = await db.get(sourceStore, sourceId);

    if (item && item[relationKey]) {
      item[relationKey] = item[relationKey].filter(
        (id: string) => id !== targetId
      );
      await db.put(sourceStore, item);
    }
  },
};
