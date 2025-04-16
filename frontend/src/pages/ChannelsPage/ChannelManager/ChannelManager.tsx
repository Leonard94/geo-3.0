import React, { useEffect, useState } from "react";
import {
  addChannel,
  deleteChannel,
  fetchChannels,
  updateChannel,
} from "../../../store/channels/channelsActions";
import { ChannelForm } from "../ChannelForm/ChannelForm";
import { toast } from "react-toastify";
import styles from "./styles.module.scss";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { IChannel } from "../../../store/channels/channelsTypes";
import { Button } from "../../../components/ui/Button/Button";
import { Modal } from "../../../components/ui/Modal/Modal";
import { Confirm } from "../../../components/ui/Confirm/Confirm";
import { isValid, validateChannel } from "../../../utils/channels.utils";
import { Box, CircularProgress } from "@mui/material";
import { ChannelsDataTable } from "./ChannelsDataTable/ChannelsDataTable";

const CHANNEL_COLUMNS = [
  {
    id: "name",
    label: "Название канала",
    width: 300,
  },
  {
    id: "url",
    label: "URL канала",
    width: 400,
  },
];

export const ChannelsManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    items: channels,
    loading,
    error,
  } = useAppSelector((state) => state.channels);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingChannelId, setDeletingChannelId] = useState<string | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchChannels());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleResetEditingId = () => {
    setEditingId(null);
  };

  const handleAddOrUpdate = (
    channelData: Omit<IChannel, "id"> & { id?: string }
  ) => {
    const validationErrors = validateChannel(channelData);

    if (!isValid(validationErrors)) {
      toast.error("Пожалуйста, исправьте ошибки в форме");
      return;
    }

    if (editingId) {
      dispatch(updateChannel({ id: editingId, ...channelData } as IChannel))
        .unwrap()
        .then(() => {
          toast.success("Канал успешно обновлен");
          setIsFormOpen(false);
          setEditingId(null);
          dispatch(fetchChannels());
        })
        .catch((error) => {
          toast.error(
            `Ошибка при обновлении канала: ${error || "Неизвестная ошибка"}`
          );
        });
    } else {
      dispatch(addChannel(channelData))
        .unwrap()
        .then(() => {
          toast.success("Канал успешно добавлен");
          setIsFormOpen(false);
          dispatch(fetchChannels());
        })
        .catch((error) => {
          toast.error(
            `Ошибка при добавлении канала: ${error || "Неизвестная ошибка"}`
          );
        });
    }
  };

  const handleDelete = (id: string) => {
    setDeletingChannelId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (deletingChannelId) {
      dispatch(deleteChannel(deletingChannelId))
        .unwrap()
        .then(() => {
          toast.success("Канал успешно удален");
          setIsConfirmOpen(false);
          setDeletingChannelId(null);
          dispatch(fetchChannels());
        })
        .catch((error) => {
          toast.error(
            `Ошибка при удалении канала: ${error || "Неизвестная ошибка"}`
          );
        });
    }
  };

  const editingChannel = editingId
    ? channels.find((channel) => channel.id === editingId)
    : null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.top_row}>
          <h1>Управление каналами</h1>
          <Button typeView="primary" onClick={() => setIsFormOpen(true)}>
            Добавить канал
          </Button>
        </div>

        <div className={styles.table}>
          {loading ? (
            <Box className={styles.loader}>
              <CircularProgress />
            </Box>
          ) : channels.length === 0 ? (
            <div className={styles.empty_message}>
              Нет доступных каналов. Добавьте новый канал.
            </div>
          ) : (
            <ChannelsDataTable
              columns={CHANNEL_COLUMNS}
              data={channels}
              onEditClick={setEditingId}
              onDeleteClick={handleDelete}
            />
          )}
        </div>

        <ChannelForm
          isOpen={isFormOpen || !!editingId}
          onClose={() => {
            setIsFormOpen(false);
            handleResetEditingId();
          }}
          onSubmit={handleAddOrUpdate}
          initialData={editingChannel}
        />

        <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)}>
          <Confirm
            title="Подтверждение удаления"
            subtitle="Вы уверены, что хотите удалить этот канал? Действие нельзя отменить."
            btnCancel="Отмена"
            btnConfirm="Удалить"
            cancel={() => setIsConfirmOpen(false)}
            confirm={confirmDelete}
          />
        </Modal>
      </div>
    </div>
  );
};
