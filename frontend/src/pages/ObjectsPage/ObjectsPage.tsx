import { EntityManager } from "../../components/EntityManager/EntityManager";
import { EntityType } from "../../DATA";

export const ObjectsPage = () => {
  return (
    <EntityManager entityType={EntityType.OBJECTS} title="Объекты" />
  );
};
