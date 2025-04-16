import { EntityManager } from "../../components/EntityManager/EntityManager";
import { ENTITY_TYPE_RU, EntityType } from "../../DATA";

export const RabPage = () => {
  return (
    <EntityManager entityType={EntityType.RAB} title={ENTITY_TYPE_RU.rab} />
  );
};
