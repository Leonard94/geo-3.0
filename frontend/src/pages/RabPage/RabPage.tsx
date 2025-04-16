import { toast } from "react-toastify";
import { EntityManager } from "../../components/EntityManager/EntityManager";
import { Button } from "../../components/ui/Button/Button";
import { ENTITY_TYPE_RU, EntityType } from "../../DATA";
import { useAppDispatch } from "../../store/hooks";
import { fetchRabFromServer } from "../../store/rab/rabActions";

export const RabPage = () => {
  const dispatch = useAppDispatch();

  const handleFetchFromServer = () => {
    dispatch(fetchRabFromServer())
      .unwrap()
      .then((stats) => {
        toast.success(
          `Добавлено новых записей: ${stats.added} Изменено записей: ${stats.updated}`
        );
      })
      .catch((error) => {
        console.error("Ошибка при получении данных с сервера:", error);
        toast.error(`Ошибка при импорте данных: ${error}`);
      });
  };

  return (
    <div>
      <div>
        <Button
          typeView="primary"
          onClick={handleFetchFromServer}
          style={{ marginBottom: "16px" }}
        >
          Загрузить данные с сервера
        </Button>
      </div>
      <EntityManager entityType={EntityType.RAB} title={ENTITY_TYPE_RU.rab} />
    </div>
  );
};
