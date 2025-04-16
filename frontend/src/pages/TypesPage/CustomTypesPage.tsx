import { EntityManager } from "../../components/EntityManager/EntityManager";
import { EntityType } from "../../DATA";
import styles from "./styles.module.scss";

export const CustomTypesPage = () => {
  return (
    <div className={styles.types_page}>
      <div className={styles.type_section}>
        <EntityManager 
          entityType={EntityType.OBJECT_TYPES} 
          title="Типы объектов" 
        />
      </div>
      <div className={styles.type_section}>
        <EntityManager 
          entityType={EntityType.INCIDENT_TYPES} 
          title="Типы инцидентов" 
        />
      </div>
    </div>
  );
};