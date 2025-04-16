import { useEffect, useState } from "react";
import { AddDataForm } from "./AddDataForm/AddDataForm";
import styles from "./styles.module.scss";
import { Column, DataItem, EntityData } from "../../../store/types";
import { nanoid } from "nanoid";
import { ENTITY_TYPE_RU, EntityType } from "../../../DATA";
import { Button } from "../../ui/Button/Button";
import { Modal } from "../../ui/Modal/Modal";
import { Confirm } from "../../ui/Confirm/Confirm";
import { ExcelUploader } from "../../ExcelUploader/ExcelUploader";
import { useAppDispatch } from "../../../store/hooks";
import { actions } from "../EntityManager";
import { ExcelDownloader } from "../../ExcelDownloader/ExcelDownloader";

interface IProps {
  tableData: DataItem[];
  editingId: string | null;
  columns: Column[];
  entityType: EntityType;
  onClear: () => void;
  resetEditing: () => void;
  setTableData: (data: EntityData) => void;
}

export const AddData: React.FC<IProps> = ({
  tableData,
  editingId,
  columns,
  entityType,
  onClear,
  resetEditing,
  setTableData,
}) => {
  const [isOpenModalAddData, setIsOpenModalAddData] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModat] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (editingId) {
      setIsOpenModalAddData(true);
    }
  }, [editingId]);

  const editingItem = editingId
    ? tableData.find((item: DataItem) => item.id === editingId)
    : null;

  const handleSubmit = (formData: Omit<EntityData, "id">) => {
    const data = {
      ...formData,
      id: nanoid(),
    };

    setTableData(data);
    setIsOpenModalAddData(false);
  };

  const handleClose = () => {
    setIsOpenModalAddData(false);
    resetEditing();
  };

  const currentEntityType = ENTITY_TYPE_RU[entityType];

  const canUploadExcel = [
    EntityType.OBJECTS,
    EntityType.INCIDENTS,
    EntityType.EMPLOYEES,
    EntityType.RAB,
  ].includes(entityType);

  return (
    <>
      <div className={styles.controls}>
        <ExcelDownloader entityType={entityType} items={tableData} />
        {canUploadExcel && (
          <>
            <ExcelUploader
              entityType={entityType}
              onUploadComplete={() => {
                dispatch(actions[entityType].fetch());
              }}
            />
            <Button
              typeView="default"
              onClick={() => setIsShowConfirmModat(true)}
            >
              Очистить
            </Button>
          </>
        )}
        <Button typeView="primary" onClick={() => setIsOpenModalAddData(true)}>
          Добавить данные
        </Button>
      </div>
      <AddDataForm
        isOpen={isOpenModalAddData}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editingItem}
        columns={columns}
        entityType={entityType}
      />
      <Modal
        isOpen={isShowConfirmModal}
        onClose={() => setIsShowConfirmModat(false)}
      >
        <Confirm
          title="Подтвердите удаление"
          subtitle={`Вы уверены, что хотите удалить всю таблицу "${currentEntityType}" без возможности восстановления?`}
          btnCancel="Отмена"
          btnConfirm="Удалить"
          cancel={() => setIsShowConfirmModat(false)}
          confirm={() => {
            onClear();
            setIsShowConfirmModat(false);
          }}
        />
      </Modal>
    </>
  );
};
