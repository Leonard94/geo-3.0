import { useEffect, useState } from "react";
import { EntityType, LINKED_OBJECT_ID, TABLE_COLUMNS } from "../../DATA";
import { AddData } from "./AddData/AddData";
import { DataTable } from "./DataTable/DataTable";
import styles from "./styles.module.scss";
import { EntityData } from "../../store/types";
import { RootState } from "../../store";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addEmployee,
  clearAllEmployees,
  deleteEmployee,
  fetchEmployees,
  updateEmployee,
} from "../../store/employees/employeesActions";
import {
  addObject,
  clearAllObjects,
  deleteObject,
  fetchObjects,
  updateObject,
} from "../../store/objects/objectsActions";
import {
  addIncident,
  clearAllIncidents,
  deleteIncident,
  fetchIncidents,
  updateIncident,
} from "../../store/incidents/incidentsActions";
import {
  addCustomObjectType,
  clearAllCustomObjectTypes,
  deleteCustomObjectType,
  fetchCustomObjectTypes,
  updateCustomObjectType,
} from "../../store/customObjectTypes/customObjectTypesActions";
import {
  addCustomIncidentType,
  clearAllCustomIncidentTypes,
  deleteCustomIncidentType,
  fetchCustomIncidentTypes,
  updateCustomIncidentType,
} from "../../store/customIncidentsTypes/customIncidentsTypesActions";
import {
  addRab,
  clearAllRab,
  deleteRab,
  fetchRab,
  updateRab,
} from "../../store/rab/rabActions";

export const selectItems = {
  [EntityType.OBJECTS]: (state: RootState) => state.objects,
  [EntityType.INCIDENTS]: (state: RootState) => state.incidents,
  [EntityType.EMPLOYEES]: (state: RootState) => state.employees,
  [EntityType.OBJECT_TYPES]: (state: RootState) => state.objectTypes,
  [EntityType.INCIDENT_TYPES]: (state: RootState) => state.incidentTypes,
  [EntityType.RAB]: (state: RootState) => state.rab,
};

export const actions = {
  [EntityType.OBJECTS]: {
    fetch: fetchObjects,
    add: addObject,
    update: updateObject,
    delete: deleteObject,
    clearAll: clearAllObjects,
  },
  [EntityType.INCIDENTS]: {
    fetch: fetchIncidents,
    add: addIncident,
    update: updateIncident,
    delete: deleteIncident,
    clearAll: clearAllIncidents,
  },
  [EntityType.EMPLOYEES]: {
    fetch: fetchEmployees,
    add: addEmployee,
    update: updateEmployee,
    delete: deleteEmployee,
    clearAll: clearAllEmployees,
  },
  [EntityType.OBJECT_TYPES]: {
    fetch: fetchCustomObjectTypes,
    add: addCustomObjectType,
    update: updateCustomObjectType,
    delete: deleteCustomObjectType,
    clearAll: clearAllCustomObjectTypes,
  },
  [EntityType.INCIDENT_TYPES]: {
    fetch: fetchCustomIncidentTypes,
    add: addCustomIncidentType,
    update: updateCustomIncidentType,
    delete: deleteCustomIncidentType,
    clearAll: clearAllCustomIncidentTypes,
  },
  [EntityType.RAB]: {
    fetch: fetchRab,
    add: addRab,
    update: updateRab,
    delete: deleteRab,
    clearAll: clearAllRab,
  },
};

interface IProps {
  entityType: EntityType;
  title: string;
}

export const EntityManager: React.FC<IProps> = ({ entityType, title }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { items } = useAppSelector(selectItems[entityType]);
  const objects = useAppSelector((state) => state.objects.items);

  const handleResetEditingId = () => {
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    dispatch(actions[entityType].delete(id));
  };

  const handleAddOrUpdate = (data: EntityData) => {
    if (editingId) {
      const currentItem = items.find((item) => item.id === editingId);

      if (currentItem && entityType === EntityType.RAB) {
        try {
          const rayDefinitions = currentItem.rayDefinitions || "[]";

          dispatch(
            actions[entityType].update({
              ...data,
              id: editingId,
              rayDefinitions: rayDefinitions,
            })
          );
        } catch (e) {
          dispatch(
            actions[entityType].update({
              ...data,
              id: editingId,
              rayDefinitions: "[]",
            })
          );
        }
      } else {
        dispatch(actions[entityType].update({ ...data, id: editingId }));
      }
      setEditingId(null);
    } else {
      dispatch(actions[entityType].add(data));
    }
  };

  const formattedColumns = TABLE_COLUMNS[entityType].map((column) => {
    if (entityType === EntityType.EMPLOYEES && column.id === LINKED_OBJECT_ID) {
      return {
        ...column,
        format: (value: string) => {
          if (!value) {
            return "—";
          }

          const object = objects.find((obj) => obj.id === value);
          return object ? String(object.name) : "—";
        },
      };
    }
    return column;
  });

  const handleAllClear = () => {
    dispatch(actions[entityType].clearAll());
  };

  useEffect(() => {
    dispatch(actions[entityType].fetch());

    if (entityType === EntityType.EMPLOYEES) {
      dispatch(actions[EntityType.OBJECTS].fetch());
    }
  }, [dispatch, entityType]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.top_row}>
          <h1>{title}</h1>
          <AddData
            tableData={items}
            editingId={editingId}
            columns={formattedColumns}
            entityType={entityType}
            onClear={handleAllClear}
            resetEditing={handleResetEditingId}
            setTableData={handleAddOrUpdate}
          />
        </div>

        <div className={styles.table}>
          <DataTable
            columns={formattedColumns}
            data={items}
            onEditClick={setEditingId}
            onDeleteClick={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};
