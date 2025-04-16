import { EntityManager } from "../../components/EntityManager/EntityManager";
import { EntityType } from "../../DATA";

export const IncidentsPage = () => {
  return (
    <EntityManager
      entityType={EntityType.INCIDENTS}
      title="Инциденты"
    />
  );
};
