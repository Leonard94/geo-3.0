import { EntityManager } from "../../components/EntityManager/EntityManager";
import { EntityType } from "../../DATA";

export const EmployeesPage = () => {
  return <EntityManager entityType={EntityType.EMPLOYEES} title="Сотрудники" />;
};
